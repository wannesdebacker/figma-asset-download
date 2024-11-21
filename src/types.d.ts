export interface UserInput {
  accessToken?: string;
  frameId?: string;
  directory?: string;
  type?: string;
  extension?: "svg" | "png";
  dryRun?: boolean;
}

export interface Config {
  accessToken: string;
  frameId: string;
  directory: string;
  type: string;
  extension: string;
  dryRun: boolean;
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
