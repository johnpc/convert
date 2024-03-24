import { Card, Grid, Heading } from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";

export default function UploadFile(props: {
  uuid: string;
  onUploadSuccess: (event: { key?: string }) => void;
  onUploadError: (event: any) => void;
}) {
  const { uuid, onUploadSuccess, onUploadError } = props;
  return (
    <>
      <Card variation="outlined" textAlign={"center"}>
        <Grid
          columnGap="0.5rem"
          rowGap="0.5rem"
          templateColumns={{ base: "1fr" }}
          templateRows={{ base: "1fr" }}
        >
          <Heading level={6}>Upload the file you would like to convert</Heading>
          <StorageManager
            acceptedFileTypes={["*"]}
            accessLevel="guest"
            maxFileCount={1}
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
            path={`${uuid}-`}
            isResumable
          />
        </Grid>
      </Card>
    </>
  );
}
