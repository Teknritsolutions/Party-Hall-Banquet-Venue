const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
fs.mkdirSync("tests/contact-thumbnails", { recursive: true });
const source = "tests/screenshots";
for (const theme of ["light-ltr", "dark-rtl"]) {
  const files = fs.readdirSync(source).filter((n) => n.endsWith(theme + ".png"));
  for (const file of files)
    execFileSync("magick", [
      source + "/" + file,
      "-crop",
      theme === "light-ltr" ? "1440x1300+0+0" : "390x1100+0+0",
      "+repage",
      "-resize",
      "240x340",
      "-background",
      "#faf7f2",
      "-gravity",
      "north",
      "-extent",
      "260x380",
      "-gravity",
      "south",
      "-fill",
      "#262126",
      "-pointsize",
      "11",
      "-annotate",
      "+0+8",
      file.replace("-" + theme + ".png", "").replace("dashboard-", ""),
      "tests/contact-thumbnails/" + file,
    ]);
  for (let batch = 0; batch < Math.ceil(files.length / 15); batch++) {
    const paths = files
      .slice(batch * 15, batch * 15 + 15)
      .map((f) => "tests/contact-thumbnails/" + f);
    execFileSync("magick", [
      "montage",
      ...paths,
      "-tile",
      "5x3",
      "-geometry",
      "+5+5",
      "-background",
      "#e6ddd7",
      `tests/contact-${theme}-${batch + 1}.jpg`,
    ]);
  }
}
