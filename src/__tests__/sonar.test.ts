import { Sonar } from '../sonar';
import {
  EnginePathNotFoundError,
  SonarNotEnabledError,
  ChannelNotFoundError,
  InvalidVolumeError,
  InvalidMixVolumeError,
} from '../exceptions';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock fs
jest.mock('fs');
import * as fs from 'fs';
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Sonar', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(
      '{"ggEncryptedAddress": "127.0.0.1:8080"}'
    );

    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      put: jest.fn(),
    } as any);
  });

  describe('create', () => {
    it('should create a Sonar instance successfully', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 200,
          data: {
            subApps: {
              sonar: {
                isEnabled: true,
                isReady: true,
                isRunning: true,
                metadata: {
                  webServerAddress: 'http://localhost:8081',
                },
              },
            },
          },
        }),
        put: jest.fn(),
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Mock isStreamerMode call
      mockAxiosInstance.get
        .mockResolvedValueOnce({
          status: 200,
          data: {
            subApps: {
              sonar: {
                isEnabled: true,
                isReady: true,
                isRunning: true,
                metadata: {
                  webServerAddress: 'http://localhost:8081',
                },
              },
            },
          },
        })
        .mockResolvedValueOnce({
          status: 200,
          data: 'classic',
        });

      const sonar = await Sonar.create();
      expect(sonar).toBeInstanceOf(Sonar);
      expect(sonar.streamerMode).toBe(false);
    });

    it('should throw EnginePathNotFoundError when path does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(Sonar.create()).rejects.toThrow(EnginePathNotFoundError);
    });

    it('should throw SonarNotEnabledError when Sonar is not enabled', async () => {
      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 200,
          data: {
            subApps: {
              sonar: {
                isEnabled: false,
                isReady: true,
                isRunning: true,
                metadata: {
                  webServerAddress: 'http://localhost:8081',
                },
              },
            },
          },
        }),
        put: jest.fn(),
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      await expect(Sonar.create()).rejects.toThrow(SonarNotEnabledError);
    });
  });

  describe('setVolume', () => {
    let sonar: Sonar;
    let mockAxiosInstance: any;

    beforeEach(async () => {
      mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 200,
          data: {
            subApps: {
              sonar: {
                isEnabled: true,
                isReady: true,
                isRunning: true,
                metadata: {
                  webServerAddress: 'http://localhost:8081',
                },
              },
            },
          },
        }),
        put: jest.fn().mockResolvedValue({
          status: 200,
          data: { success: true },
        }),
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance);

      // Mock isStreamerMode call
      mockAxiosInstance.get
        .mockResolvedValueOnce({
          status: 200,
          data: {
            subApps: {
              sonar: {
                isEnabled: true,
                isReady: true,
                isRunning: true,
                metadata: {
                  webServerAddress: 'http://localhost:8081',
                },
              },
            },
          },
        })
        .mockResolvedValueOnce({
          status: 200,
          data: 'classic',
        });

      sonar = await Sonar.create();
    });

    it('should set volume successfully', async () => {
      const result = await sonar.setVolume('master', 0.5);
      expect(result).toEqual({ success: true });
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        'http://localhost:8081/volumeSettings/classic/master/Volume/0.5'
      );
    });

    it('should throw ChannelNotFoundError for invalid channel', async () => {
      await expect(sonar.setVolume('invalid' as any, 0.5)).rejects.toThrow(
        ChannelNotFoundError
      );
    });

    it('should throw InvalidVolumeError for invalid volume', async () => {
      await expect(sonar.setVolume('master', 1.5)).rejects.toThrow(
        InvalidVolumeError
      );
    });
  });

  describe('setChatMix', () => {
    let sonar: Sonar;
    let mockAxiosInstance: any;

    beforeEach(async () => {
      mockAxiosInstance = {
        get: jest.fn().mockResolvedValue({
          status: 200,
          data: {
            subApps: {
              sonar: {
                isEnabled: true,
                isReady: true,
                isRunning: true,
                metadata: {
                  webServerAddress: 'http://localhost:8081',
                },
              },
            },
          },
        }),
        put: jest.fn().mockResolvedValue({
          status: 200,
          data: { balance: 0.5 },
        }),
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance);

      // Mock isStreamerMode call
      mockAxiosInstance.get
        .mockResolvedValueOnce({
          status: 200,
          data: {
            subApps: {
              sonar: {
                isEnabled: true,
                isReady: true,
                isRunning: true,
                metadata: {
                  webServerAddress: 'http://localhost:8081',
                },
              },
            },
          },
        })
        .mockResolvedValueOnce({
          status: 200,
          data: 'classic',
        });

      sonar = await Sonar.create();
    });

    it('should set chat mix successfully', async () => {
      const result = await sonar.setChatMix(0.5);
      expect(result).toEqual({ balance: 0.5 });
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        'http://localhost:8081/chatMix?balance=0.5'
      );
    });

    it('should throw InvalidMixVolumeError for invalid mix volume', async () => {
      await expect(sonar.setChatMix(1.5)).rejects.toThrow(
        InvalidMixVolumeError
      );
    });
  });
});
