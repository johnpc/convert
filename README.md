# convert.jpc.io

A file conversion website available at [convert.jpc.io](https://convert.jpc.io)

## Install dependencies

```bash
npm install
```

## Deploying Backend Resources

Deploy necessary resources to your personal AWS account via

```bash
npx amplify sandbox
```

This will populate the `amplifyconfiguration.json` file at the root of your project, which contains all configuration necessary to interact with the deployed resources.

## Test the website

```bash
npm run dev
```

Then navigate to https://localhost:3000
