# Fiado (Figma Asset Downloader)

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

## Notes

- Ensure your Figma access token has the required permissions to access files.

## License

This project is licensed under the ISC License.
