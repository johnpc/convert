export const imageFormats = [
  "png",
  "jpg",
  "gif",
  "ico",
  "bmp",
  "tiff",
  "pdf",
  "jpeg",
  "webp",
  "svg",
];
export const videoFormats = [
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "f4v",
  "mkv",
  "webm",
  "swf",
];
export const audiobookFormats = ["aax", "m4b", "mp3"];
export const ereaderFormats = ["pdf", "txt", "epub", "mobi"];
export const allFormats = [
  imageFormats,
  videoFormats,
  audiobookFormats,
  ereaderFormats,
];
export const getFormatOptions = (fileExtension: string) => {
  const matchingFormatArrays = allFormats.filter((formatsArray) =>
    formatsArray.some((format) => format === fileExtension),
  );
  return matchingFormatArrays.flat();
};
export const parseFileFormat = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf(".") + 1);
};
export const getConvertTool = (
  fileName: string,
): "imagemagick" | "ebook-convert" | undefined => {
  const fileExtension = parseFileFormat(fileName);
  if (
    [...imageFormats, ...videoFormats, ...audiobookFormats].includes(
      fileExtension,
    )
  ) {
    return "imagemagick";
  }

  if (ereaderFormats.includes(fileExtension)) {
    return "ebook-convert";
  }

  return undefined;
};

export const isConversionValid = (
  fileName: string,
  desiredFormat: string,
): boolean => {
  const fileExtension = parseFileFormat(fileName);
  const validOptions = getFormatOptions(fileExtension);
  return validOptions.includes(desiredFormat);
};
