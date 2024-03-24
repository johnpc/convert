import { Link, Button, Card, Grid } from "@aws-amplify/ui-react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function DownloadFile(props: { convertedUrl: string }) {
  const [copied, setCopied] = useState(false);
  const { convertedUrl } = props;

  return (
    <Card variation="outlined" textAlign={"center"}>
      <Grid
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns={{ base: "1fr" }}
        templateRows={{ base: "1fr 1fr" }}
      >
        <Link
          padding={"10px"}
          width={"100%"}
          margin={"auto"}
          textAlign={"center"}
          href={convertedUrl}
          borderStyle={"dotted"}
        >
          Link to download converted file
        </Link>
        <CopyToClipboard
          text={convertedUrl}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
        >
          <Button colorTheme={copied ? "success" : undefined}>
            {copied ? "✅" : "Copy to Clipboard"}
          </Button>
        </CopyToClipboard>
      </Grid>
    </Card>
  );
}
