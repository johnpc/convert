import { readFile, writeFile } from "fs/promises";
import { Context } from "aws-lambda";
import { convert } from "imagemagick-convert";
import { getUrl, downloadData, uploadData } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import { convert as ebookConvert } from "node-ebook-converter";
import config from "../../amplifyconfiguration.json";
import { getConvertTool, isConversionValid } from "./helpers/formats";
import C from "ebook-convert";

import path from "path";
Amplify.configure(config);

const convertEbook = async (
  fileKey: string,
  desiredFormat: string,
  fileBuffer: ArrayBuffer,
): Promise<Buffer> => {
  const tmpInputFile = path.join("/tmp", fileKey);
  const tmpOutputFile = path.join("/tmp", `${fileKey}.${desiredFormat}`);
  await writeFile(tmpInputFile, Buffer.from(fileBuffer));
  // await ebookConvert({
  //   input: tmpInputFile,
  //   output: tmpOutputFile,
  // });
  await new Promise<void>((resolve) => {
    C(
      {
        input: tmpInputFile,
        output: tmpOutputFile,
      },
      (err: Error) => {
        console.error(err);
        resolve();
      },
    );
  });
  return await readFile(tmpOutputFile);
};

const convertFile = async (
  fileKey: string,
  desiredFormat: string,
  fileBuffer: ArrayBuffer,
): Promise<Buffer> => {
  const convertTool = getConvertTool(fileKey);
  switch (convertTool) {
    case "imagemagick":
      return await convert({
        fileBuffer,
        format: desiredFormat,
      });
    case "ebook-convert":
      return await convertEbook(fileKey, desiredFormat, fileBuffer);
    default:
      throw new Error(`Unable to find convert tool for ${fileKey}`);
  }
};

const getConvertedUrl = async (fileKey: string, desiredFormat: string) => {
  const { body } = await downloadData({
    key: decodeURI(fileKey),
    options: {
      accessLevel: "guest",
    },
  }).result;
  const blob = await body.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const srcData = Buffer.from(arrayBuffer);
  const convertedBuffer = await convertFile(fileKey, desiredFormat, srcData);

  await uploadData({
    key: `${fileKey}.${desiredFormat}`,
    data: convertedBuffer,
    options: {
      accessLevel: "guest",
    },
  }).result;

  const url = await getUrl({
    key: `${fileKey}.${desiredFormat}`,
  });

  return url.url;
};

export const handler = async (
  event: {
    headers?: { [key: string]: string };
  },
  context: Context,
) => {
  const fileKey = event?.headers?.["x-file-key"];
  const desiredFormat = event?.headers?.["x-desired-format"];
  console.log({ event, fileKey, desiredFormat });

  let response = {
    statusCode: 0,
    body: "",
  };

  try {
    if (!fileKey || !desiredFormat) {
      throw new Error(
        `Invalid request. ${JSON.stringify(
          { fileKey, desiredFormat },
          null,
          2,
        )}`,
      );
    }
    if (!isConversionValid(fileKey, desiredFormat)) {
      throw new Error(
        `Conversion for ${fileKey} to ${desiredFormat} is not supported.`,
      );
    }

    const url = await getConvertedUrl(fileKey, desiredFormat);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        url,
      }),
    };
  } catch (e) {
    console.error({ e });
    response = {
      statusCode: 400,
      body: JSON.stringify({
        error: (e as Error).message,
      }),
    };
  }

  console.log({ response, context });
  return response;
};
