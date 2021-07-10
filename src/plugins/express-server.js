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

app.use("/play/file", serveStatic(songCachePath));

app.post("/get-song", async (req, res) => {
  const { body } = req;

  try {
    await schema.validate(body);

    const cacheFile = uuidv4() + ".mp3";
    const songPath = join(songCachePath, cacheFile);

    const song = await ytdlClient.getData(body.url, songPath);

    res.status(200).json({
      path: "http://localhost:9090/play/file/" + cacheFile,
      ...song,
    });

    //
  } catch (error) {
    return res.status(400).json({ error });
  }
});

export default server;
