import { Context } from "aws-lambda";
import { convert } from "imagemagick-convert";
import { getUrl, downloadData, uploadData } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../../amplifyconfiguration.json";
Amplify.configure(config);

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
  const imgBuffer = await convert({
    srcData,
    format: desiredFormat,
  });

  await uploadData({
    key: `${fileKey}.${desiredFormat}`,
    data: imgBuffer,
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
