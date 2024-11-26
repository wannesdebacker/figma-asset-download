export interface UserInput {
  accessToken?: string;
  fileId?: string;
  directory?: string;
  fileType?: "svg" | "png";
  dryRun?: boolean;
  customLogo?: string;
  hideLogo?: boolean;
}

export interface Config {
  accessToken: string;
  fileId: string;
  directory: string;
  fileType: string;
  dryRun: boolean;
  customLogo: string;
  hideLogo: boolean;
}

export interface Argv extends Partial<Config> {
  batchSize?: number;
}

export interface FigmaNode {
  type: string;
  name?: string;
  id?: string;
  children?: FigmaNode[];
}

export interface FigmaApiResponse {
  document?: {
    children: FigmaNode[];
  };
  [key: string]: any;
}

export interface AssetConfig {
  id: string;
  name: string;
  downloadLink?: string;
}

export type FigmaApi = (
  accessToken: string,
  endpoint: string
) => Promise<FigmaApiResponse>;

export type DownloadAssets = (
  config: AssetConfig[],
  directory: string
) => Promise<void>;
