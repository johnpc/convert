import * as lambda from "aws-cdk-lib/aws-lambda";
import { defineBackend, defineFunction } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { storage } from "./storage/resource";
import dotenv from "dotenv";
dotenv.config();

const convertFunction = defineFunction({
  entry: "./function/convert.ts",
  runtime: 20,
  timeoutSeconds: 600,
  memoryMB: 1024,
});

const backend = defineBackend({
  auth,
  storage,
  convertFunction,
});
const bucket = backend.storage.resources.bucket;
const underlyingConvertLambda = backend.convertFunction.resources
  .lambda as lambda.Function;
underlyingConvertLambda.addLayers(
  lambda.LayerVersion.fromLayerVersionArn(
    backend.convertFunction.resources.lambda.stack,
    "imagemagick-lambda-layer",
    "arn:aws:lambda:us-west-2:566092841021:layer:imagemagick:1",
  ),
  // lambda.LayerVersion.fromLayerVersionArn(
  //   backend.convertFunction.resources.lambda.stack,
  //   "ffmpeg-lambda-layer",
  //   "arn:aws:lambda:us-east-1:145266761615:layer:ffmpeg:4",
  // ),
);

underlyingConvertLambda.addEnvironment("BUCKET_NAME", bucket.bucketName);

const fnUrl = underlyingConvertLambda.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ["*"],
    allowedHeaders: ["*"],
  },
});

backend.addOutput({
  custom: {
    convertApiUrl: fnUrl.url,
  },
});
