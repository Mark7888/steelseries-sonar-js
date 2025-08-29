import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as https from 'https';
import {
  EnginePathNotFoundError,
  ServerNotAccessibleError,
  SonarNotEnabledError,
  ServerNotReadyError,
  ServerNotRunningError,
  WebServerAddressNotFoundError,
  ChannelNotFoundError,
  SliderNotFoundError,
  InvalidVolumeError,
  InvalidMixVolumeError,
} from './exceptions';

/**
 * Valid audio channel names in SteelSeries Sonar
 */
export type ChannelName =
  | 'master'
  | 'game'
  | 'chatRender'
  | 'media'
  | 'aux'
  | 'chatCapture';

/**
 * Valid streamer slider names
 */
export type StreamerSliderName = 'streaming' | 'monitoring';

/**
 * Interface for volume data structure
 */
export interface VolumeData {
  [key: string]: any;
}

/**
 * Interface for chat mix data structure
 */
export interface ChatMixData {
  balance: number;
  [key: string]: any;
}

/**
 * Interface for core properties from SteelSeries Engine
 */
interface CoreProperties {
  ggEncryptedAddress: string;
}

/**
 * Interface for sub-app information
 */
interface SubAppInfo {
  subApps: {
    sonar: {
      isEnabled: boolean;
      isReady: boolean;
      isRunning: boolean;
      metadata: {
        webServerAddress: string;
      };
    };
  };
}

/**
 * Configuration options for initializing the Sonar class
 */
export interface SonarOptions {
  appDataPath?: string;
  streamerMode?: boolean;
}

/**
 * Main class for interacting with SteelSeries Sonar API
 */
export class Sonar {
  // chatCapture = mic
  public static readonly CHANNEL_NAMES: readonly ChannelName[] = [
    'master',
    'game',
    'chatRender',
    'media',
    'aux',
    'chatCapture',
  ] as const;

  public static readonly STREAMER_SLIDER_NAMES: readonly StreamerSliderName[] = [
    'streaming',
    'monitoring',
  ] as const;

  private static readonly VOLUME_PATH = '/volumeSettings/classic';
  private static readonly STREAMER_VOLUME_PATH = '/volumeSettings/streamer';

  private readonly appDataPath: string;
  private baseUrl: string = '';
  private webServerAddress: string = '';
  private volumePath: string = Sonar.VOLUME_PATH;
  private httpClient: AxiosInstance;
  private _streamerMode: boolean = false;

  /**
   * Creates a new instance of the Sonar class
   * @param options Configuration options
   * @private Use Sonar.create() instead for proper async initialization
   */
  private constructor(options: SonarOptions = {}) {
    // Set default app data path based on OS
    this.appDataPath =
      options.appDataPath || this.getDefaultAppDataPath();

    // Create axios instance with SSL verification disabled
    this.httpClient = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      timeout: 5000,
    });

    // Initialize streamer mode flag
    this._streamerMode = options.streamerMode ?? false;
    if (this._streamerMode) {
      this.volumePath = Sonar.STREAMER_VOLUME_PATH;
    }
  }

  /**
   * Create a new Sonar instance with proper async initialization
   * @param options Configuration options
   * @returns Promise<Sonar> A fully initialized Sonar instance
   */
  public static async create(options: SonarOptions = {}): Promise<Sonar> {
    const sonar = new Sonar(options);
    
    // Initialize the connection
    sonar.loadBaseUrl();
    await sonar.loadServerAddress();

    // Set streamer mode if not explicitly provided
    if (options.streamerMode === undefined) {
      try {
        sonar._streamerMode = await sonar.isStreamerMode();
        if (sonar._streamerMode) {
          sonar.volumePath = Sonar.STREAMER_VOLUME_PATH;
        }
      } catch {
        // Default to false if unable to determine
        sonar._streamerMode = false;
      }
    }

    return sonar;
  }

  /**
   * Get the default app data path based on the operating system
   */
  private getDefaultAppDataPath(): string {
    const platform = os.platform();
    
    if (platform === 'win32') {
      const programData = process.env.ProgramData || 'C:\\ProgramData';
      return path.join(
        programData,
        'SteelSeries',
        'SteelSeries Engine 3',
        'coreProps.json'
      );
    } else if (platform === 'darwin') {
      // macOS path
      return path.join(
        os.homedir(),
        'Library',
        'Application Support',
        'SteelSeries Engine 3',
        'coreProps.json'
      );
    } else {
      // Linux and other Unix-like systems
      return path.join(
        os.homedir(),
        '.local',
        'share',
        'SteelSeries Engine 3',
        'coreProps.json'
      );
    }
  }

  /**
   * Check if streamer mode is currently active
   */
  public async isStreamerMode(): Promise<boolean> {
    try {
      const response = await this.httpClient.get(`${this.webServerAddress}/mode/`);
      if (response.status !== 200) {
        throw new ServerNotAccessibleError(response.status);
      }
      return response.data === 'stream';
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }

  /**
   * Set streamer mode on or off
   */
  public async setStreamerMode(streamerMode: boolean): Promise<boolean> {
    const mode = streamerMode ? 'stream' : 'classic';
    const url = `${this.webServerAddress}/mode/${mode}`;

    try {
      const response = await this.httpClient.put(url);
      if (response.status !== 200) {
        throw new ServerNotAccessibleError(response.status);
      }

      this._streamerMode = response.data === 'stream';
      this.volumePath = this._streamerMode
        ? Sonar.STREAMER_VOLUME_PATH
        : Sonar.VOLUME_PATH;

      return this._streamerMode;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get current streamer mode status
   */
  public get streamerMode(): boolean {
    return this._streamerMode;
  }

  /**
   * Load the base URL from the SteelSeries Engine configuration
   */
  private loadBaseUrl(): void {
    if (!fs.existsSync(this.appDataPath)) {
      throw new EnginePathNotFoundError();
    }

    try {
      const fileContent = fs.readFileSync(this.appDataPath, 'utf8');
      const commonAppData: CoreProperties = JSON.parse(fileContent);
      this.baseUrl = `https://${commonAppData.ggEncryptedAddress}`;
    } catch (error) {
      throw new EnginePathNotFoundError();
    }
  }

  /**
   * Load the server address from the SteelSeries Engine API
   */
  private async loadServerAddress(): Promise<void> {
    try {
      const appData = await this.httpClient.get(`${this.baseUrl}/subApps`);
      if (appData.status !== 200) {
        throw new ServerNotAccessibleError(appData.status);
      }

      const appDataJson: SubAppInfo = appData.data;

      if (!appDataJson.subApps.sonar.isEnabled) {
        throw new SonarNotEnabledError();
      }

      if (!appDataJson.subApps.sonar.isReady) {
        throw new ServerNotReadyError();
      }

      if (!appDataJson.subApps.sonar.isRunning) {
        throw new ServerNotRunningError();
      }

      this.webServerAddress =
        appDataJson.subApps.sonar.metadata.webServerAddress;

      if (!this.webServerAddress || this.webServerAddress === 'null') {
        throw new WebServerAddressNotFoundError();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get current volume data for all channels
   */
  public async getVolumeData(): Promise<VolumeData> {
    const volumeInfoUrl = `${this.webServerAddress}${this.volumePath}`;

    try {
      const response = await this.httpClient.get(volumeInfoUrl);
      if (response.status !== 200) {
        throw new ServerNotAccessibleError(response.status);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }

  /**
   * Set volume for a specific channel
   */
  public async setVolume(
    channel: ChannelName,
    volume: number,
    streamerSlider: StreamerSliderName = 'streaming'
  ): Promise<any> {
    if (!Sonar.CHANNEL_NAMES.includes(channel)) {
      throw new ChannelNotFoundError(channel);
    }

    if (
      this._streamerMode &&
      !Sonar.STREAMER_SLIDER_NAMES.includes(streamerSlider)
    ) {
      throw new SliderNotFoundError(streamerSlider);
    }

    if (volume < 0 || volume > 1) {
      throw new InvalidVolumeError(volume);
    }

    let fullVolumePath = this.volumePath;
    if (this._streamerMode) {
      fullVolumePath += `/${streamerSlider}`;
    }

    const url = `${this.webServerAddress}${fullVolumePath}/${channel}/Volume/${JSON.stringify(volume)}`;

    try {
      const response = await this.httpClient.put(url);
      if (response.status !== 200) {
        throw new ServerNotAccessibleError(response.status);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }

  /**
   * Mute or unmute a specific channel
   */
  public async muteChannel(
    channel: ChannelName,
    muted: boolean,
    streamerSlider: StreamerSliderName = 'streaming'
  ): Promise<any> {
    if (!Sonar.CHANNEL_NAMES.includes(channel)) {
      throw new ChannelNotFoundError(channel);
    }

    if (
      this._streamerMode &&
      !Sonar.STREAMER_SLIDER_NAMES.includes(streamerSlider)
    ) {
      throw new SliderNotFoundError(streamerSlider);
    }

    let fullVolumePath = this.volumePath;
    if (this._streamerMode) {
      fullVolumePath += `/${streamerSlider}`;
    }

    const muteKeyword = this._streamerMode ? 'isMuted' : 'Mute';
    const url = `${this.webServerAddress}${fullVolumePath}/${channel}/${muteKeyword}/${JSON.stringify(muted)}`;

    try {
      const response = await this.httpClient.put(url);
      if (response.status !== 200) {
        throw new ServerNotAccessibleError(response.status);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get current chat mix data
   */
  public async getChatMixData(): Promise<ChatMixData> {
    const chatMixUrl = `${this.webServerAddress}/chatMix`;

    try {
      const response = await this.httpClient.get(chatMixUrl);
      if (response.status !== 200) {
        throw new ServerNotAccessibleError(response.status);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }

  /**
   * Set chat mix balance
   */
  public async setChatMix(mixVolume: number): Promise<ChatMixData> {
    if (mixVolume < -1 || mixVolume > 1) {
      throw new InvalidMixVolumeError(mixVolume);
    }

    const url = `${this.webServerAddress}/chatMix?balance=${JSON.stringify(mixVolume)}`;

    try {
      const response = await this.httpClient.put(url);
      if (response.status !== 200) {
        throw new ServerNotAccessibleError(response.status);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ServerNotAccessibleError(error.response.status);
      }
      throw error;
    }
  }
}
