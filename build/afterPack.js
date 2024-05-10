import { readdir, unlinkSync } from "fs";

export default async function (context) {
  const localeDir = context.appOutDir + "/locales/";

  readdir(localeDir, function (err, files) {
    if (!(files && files.length)) return;
    for (let i = 0, len = files.length; i < len; i++) {
      const match = files[i].match(/zh-CN\.pak/);
      if (match === null) {
        unlinkSync(localeDir + files[i]);
      }
    }
  });
}
