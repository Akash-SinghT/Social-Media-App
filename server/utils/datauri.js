import DataUriParser from "datauri/parser.js";
import path from "path";
const parser = new DataUriParser();
const getDatauri = (file) => {
  // wil return uri after modifying file
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer).content; // predifined
};
export default getDatauri;
