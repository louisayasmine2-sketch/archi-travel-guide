import sharp from "sharp";
const [,, src, w, h, out] = process.argv;
await sharp(src).resize(+w, +h, { fit: "contain", background: "#1E3A2F" }).toFile(out);
console.log("ok ->", out);
