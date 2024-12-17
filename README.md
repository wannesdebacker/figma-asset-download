# Fiado (Figma Asset Downloader)

[![npm version](https://badge.fury.io/js/fiado.svg)](https://www.npmjs.com/package/fiado)

**Fiado** is a CLI tool to automatically download all assets from a Figma file. It provides flexibility through command-line options, `.env` file support, and programmatic usage.

## Installation

Install `fiado` globally using your preferred package manager:

### Using pnpm:

```bash
pnpm add -g fiado
```

### Using npm:

```bash
npm install -g fiado
```

This will make the `fiado` command globally available.

## Usage

### Basic Command

To download assets from a Figma file:

```bash
fiado --accessToken YOUR_ACCESS_TOKEN --fileId YOUR_FILE_ID --directory ./assets
```

### Options

| Option          | Description                                                               | Default  |
| --------------- | ------------------------------------------------------------------------- | -------- |
| `--accessToken` | Your Figma access token.                                                  | Required |
| `--fileId`      | The ID of the Figma file to download.                                     | Required |
| `--directory`   | Directory to save the downloaded assets.                                  | `./dist` |
| `--dryRun`      | Generates a `config.json` with a list of assets without downloading them. | `false`  |
| `--fileType`    | File extension for the assets (`svg` or `png`).                           | `svg`    |
| `--customLogo`  | String with custom logo (like ascii art)                                  | Fiado    |
| `--hideLogo`    | Hide logo                                                                 | `false`  |
| `--pattern`     | Regex pattern to filter component names (e.g., ^logo-).                   | `null`   |

### Using It Programmatically

Fiado can also be used in a Node.js script:

```js
import init from "fiado";

(async () => {
  try {
    await init({
      accessToken: "your-figma-access-token",
      fileId: "your-figma-file-id",
      directory: "./dist",
      dryRun: false,
    });

    console.log("Assets downloaded successfully!");
  } catch (error) {
    console.error("Error during asset download:", error.message);
  }
})();
```

### Using a `.env` File

To avoid passing sensitive information as command-line arguments, you can use a `.env` file in the current working directory:

```env
FIGMA_ASSET_TOKEN=your-figma-access-token
FIGMA_FILE_ID=your-figma-file-id
```

Fiado will use these values if no command-line arguments are provided for `accessToken` and `fileId`. Command-line arguments always take precedence over `.env` values.

### Interactive Prompts

If any required option is missing from both arguments and the `.env` file, Fiado will prompt you interactively to provide the information.

## Features

- Automatically downloads all assets from a specified Figma file.
- Supports configuration via command-line arguments, `.env` files, and interactive prompts.
- Programmatic API for advanced use cases.
- Customizable save directory for downloaded assets.
- Dry-run option to generate a preview of assets without downloading them.
- Regex filtering with --pattern to match specific component names.

## Notes

- Ensure your Figma access token has the required permissions to access files.

## What is an `accessToken` or `fileId`?

To use Fiado and interact with Figma's API, you need to provide two key pieces of information: an `accessToken` and a `fileId`. Here's what they mean:

### 1. `accessToken`

An `accessToken` is a unique string that grants your tool access to your Figma account. It acts as a secure way to authenticate requests to Figma's API.

#### How to Get an `accessToken`

1. Go to your [Figma Account Settings](https://www.figma.com/settings).
2. Go to the Security tab.
3. Click **Generate new token**.
4. Copy the generated token and provide it to Fiado as the `--accessToken` option or via your `.env` file.

> **Note:** Keep your `accessToken` private. Anyone with access to your token can make requests on your behalf.

### 2. `fileId`

A `fileId` is the unique identifier for the Figma file you want to download assets from. It is part of the URL for your Figma file.

#### How to Find the `fileId`

1. Open the Figma file you want to work with.
2. When you share the file or check its URL in the address bar, it will look something like this:

`https://www.figma.com/design/{fileId}/{something else but not the fileId}`

## License

This project is licensed under the ISC License.
