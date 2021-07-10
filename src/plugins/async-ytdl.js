import ytdl from "ytdl-core";
import fs from "fs";

export default {
  getData(url, songPath) {
    return new Promise(async (resolve, reject) => {
      const songInfo = await ytdl.getInfo(url);

      const song = ytdl(url, {
        filter: "audioonly",
      });

      song.pipe(fs.createWriteStream(songPath));

      song.on("end", () => {
        resolve({ song: { ...songInfo } });
      });
      song.on("error", (e) => {
        reject(e);
      });
    });
  },
};
