export interface Argv {
  directory?: string;
  dryRun: boolean;
  batchSize: number;
  accessToken?: string;
  frameId?: string;
}

export interface UserConfigArgs {
  accessToken?: string;
  frameId?: string;
  directory?: string;
}

export interface AssetConfig {
  id: string;
  name: string;
  downloadLink?: string;
}

export interface DownloadAssets {
  (config: AssetConfig[], directory: string): Promise<void>;
}

export interface FigmaNode {
  type: string;
  name?: string;
  id?: string;
  children?: FigmaNode[];
}

export interface FigmaApiResponse {
  [key: string]: any;
}

export interface FigmaApi {
  (accessToken: string, endpoint: string): Promise<FigmaApiResponse>;
}
