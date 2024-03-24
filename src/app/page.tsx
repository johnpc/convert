"use client";
import "@aws-amplify/ui-react/styles.css";
import { useState } from "react";
import { Amplify } from "aws-amplify";

import config from "../../amplifyconfiguration.json";
import UploadFile from "./components/uploadFile";
import DownloadFile from "./components/downloadFile";
import ConvertFile from "./components/convertFile";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
Amplify.configure(config);

const convertApiUrl = (config as any)?.custom?.convertApiUrl;
const makeHash = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export default function Home() {
  const [uuid] = useState(makeHash(5));
  const [fileKey, setFileKey] = useState<string>();
  const [convertedUrl, setConvertedUrl] = useState<string>();
  const [convertFailed, setConvertFailed] = useState<boolean>(false);

  const onUploadSuccess = (event: { key?: string }) => {
    setFileKey(encodeURI(event.key!));
  };
  const onUploadError = (event: any) => {
    console.log(event);
  };

  const handleClick = async (selectedFormat: string) => {
    const response = await fetch(convertApiUrl, {
      headers: {
        "x-file-key": fileKey!,
        "x-desired-format": selectedFormat,
      },
    });
    if (response.status !== 200) {
      setConvertFailed(true);
    }
    const json = await response.json();
    console.log(json);
    setConvertedUrl(json.url);
  };

  return (
    <>
      <Header />
      {convertedUrl ? (
        <DownloadFile convertedUrl={convertedUrl} />
      ) : fileKey ? (
        <ConvertFile
          fileKey={fileKey}
          convertFailed={convertFailed}
          handleClick={handleClick}
        />
      ) : (
        <UploadFile
          uuid={uuid}
          onUploadSuccess={onUploadSuccess}
          onUploadError={onUploadError}
        />
      )}
      <Footer />
    </>
  );
}
