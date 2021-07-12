import { createServer } from "http";
import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as yup from "yup";
import ytdlClient from "./async-ytdl";
import serveStatic from "serve-static";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import _ from "lodash";

const schema = yup.object().shape({
  url: yup.string().required(),
});

const app = Express();
const server = createServer(app);

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("dev"));

app.use(bodyParser.json());

const userDataDirectory =
  process.env.APPDATA ||
  (process.platform == "darwin"
    ? process.env.HOME + "/Library/Preferences"
    : process.env.HOME + "/.local/share");

const basePath = join(`${userDataDirectory}`, "youtubeify-cache");

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath);
}

const songCachePath = join(basePath, "audio");

if (!fs.existsSync(songCachePath)) {
  fs.mkdirSync(songCachePath);
}

const indexFilePath = join(songCachePath, "index.json");

if (!fs.existsSync(indexFilePath)) {
  fs.writeFileSync(indexFilePath, JSON.stringify([]));
}

app.use("/play/file", serveStatic(songCachePath));

app.post("/get-song", async (req, res) => {
  const { body } = req;

  try {
    await schema.validate(body);

    const cacheFile = uuidv4() + ".mp3";

    const songData = await ytdlClient.getSongInfo(body.url);

    const toBeIndexed = {
      id: songData.videoDetails.videoId,
      fileName: cacheFile,
      url: body.url,
      title: songData.videoDetails.title,
      thumbnails: songData.videoDetails.thumbnails,
      author: { ...songData.videoDetails.author },
      media: { ...songData.videoDetails.media },
      lengthSeconds: songData.videoDetails.lengthSeconds,
      normalizedName:
        songData.videoDetails.media.song || songData.videoDetails.title,
    };

    const indexFile = JSON.parse(String(fs.readFileSync(indexFilePath))) || [];

    const found = _.filter(
      indexFile,
      (o) => o.id === songData.videoDetails.videoId
    );

    if (found.length < 1) {
      indexFile.push(toBeIndexed);
      fs.writeFileSync(indexFilePath, JSON.stringify(indexFile));
    }

    if (found.length >= 1) {
      // I'm grabbing the first one, cuz there's no possibility of the file being indexed more than once
      const item = found.reverse()[0];

      return res.status(200).json({
        path: "http://localhost:9090/play/file/" + item.fileName,
        ...item,
      });
    }

    const songPath = join(songCachePath, cacheFile);
    await ytdlClient.downloadSong(body.url, songPath);

    res.status(200).json({
      path: "http://localhost:9090/play/file/" + cacheFile,
      ...toBeIndexed,
    });

    //
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

export default server;
