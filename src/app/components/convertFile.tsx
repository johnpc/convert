import {
  Heading,
  Button,
  Loader,
  Card,
  Grid,
  SelectField,
} from "@aws-amplify/ui-react";
import { useState } from "react";
import { parseFileFormat, getFormatOptions } from "../../../amplify/function/helpers/formats";

export default function ConvertFile(props: {
  fileKey: string;
  convertFailed: boolean;
  handleClick: (selectedFormat: string) => Promise<void>;
}) {
  const { fileKey, convertFailed, handleClick } = props;
  const [convertInProgress, setConvertInProgress] = useState(false);
  const formatOptions = getFormatOptions(parseFileFormat(fileKey));
  const [selectedFormat, setSelectedFormat] = useState(formatOptions?.[0]);

  const clickHandler = async () => {
    setConvertInProgress(true);
    await handleClick(selectedFormat);
    setConvertInProgress(false);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(event.target.value);
  };

  return (
    <Card variation="outlined" textAlign={"center"}>
      <Grid
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns={{ base: "1fr" }}
        templateRows={{ base: "1fr 1fr 1fr" }}
      >
        <Heading level={6}>Uploaded file {fileKey}</Heading>
        <SelectField label="desired format" onChange={handleSelectChange}>
          {formatOptions.length ? formatOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          )) : <option key={'error'} value={'error'}>
          No conversions available for .{fileExtension}
        </option>}
        </SelectField>
        {formatOptions.length ?
        <Button
          variation="primary"
          colorTheme={convertFailed ? "error" : undefined}
          onClick={clickHandler}
        >
          {convertInProgress ? (
            <Loader />
          ) : convertFailed ? (
            "Failed to Convert!"
          ) : (
            "Convert!"
          )}
        </Button> : ''}
      </Grid>
    </Card>
  );
}
