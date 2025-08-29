/**
 * SteelSeries Sonar JavaScript/TypeScript API
 * 
 * @packageDocumentation
 */

export { Sonar } from './sonar';
export type { 
  ChannelName, 
  StreamerSliderName, 
  VolumeData, 
  ChatMixData, 
  SonarOptions 
} from './sonar';

export {
  SonarError,
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

// Default export
export { Sonar as default } from './sonar';
