import ytdl from "ytdl-core";
import fs from "fs";

export default {
  getSongInfo(url) {
    return ytdl.getInfo(url);
  },

  downloadSong(url, songPath) {
    return new Promise(async (resolve, reject) => {
      const song = ytdl(url, {
        filter: "audioonly",
      });

      song.pipe(fs.createWriteStream(songPath));

      song.on("end", async () => {
        const sinfo = await this.songInfo;
        resolve({ song: { ...sinfo } });
      });
      song.on("error", (e) => {
        reject(e);
      });
    });
  },
};
