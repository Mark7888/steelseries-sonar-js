/**
 * Base class for all SteelSeries Sonar related errors
 */
export abstract class SonarError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when SteelSeries Engine 3 is not installed or not in the default location
 */
export class EnginePathNotFoundError extends SonarError {
  constructor() {
    super('SteelSeries Engine 3 not installed or not in the default location!');
  }
}

/**
 * Thrown when the SteelSeries server is not accessible
 */
export class ServerNotAccessibleError extends SonarError {
  public readonly statusCode: number;

  constructor(statusCode: number) {
    super(`SteelSeries server not accessible! Status code: ${statusCode}`);
    this.statusCode = statusCode;
  }
}

/**
 * Thrown when SteelSeries Sonar is not enabled
 */
export class SonarNotEnabledError extends SonarError {
  constructor() {
    super('SteelSeries Sonar is not enabled!');
  }
}

/**
 * Thrown when SteelSeries Sonar is not ready yet
 */
export class ServerNotReadyError extends SonarError {
  constructor() {
    super('SteelSeries Sonar is not ready yet!');
  }
}

/**
 * Thrown when SteelSeries Sonar is not running
 */
export class ServerNotRunningError extends SonarError {
  constructor() {
    super('SteelSeries Sonar is not running!');
  }
}

/**
 * Thrown when the web server address is not found
 */
export class WebServerAddressNotFoundError extends SonarError {
  constructor() {
    super('Web server address not found');
  }
}

/**
 * Thrown when an invalid channel is specified
 */
export class ChannelNotFoundError extends SonarError {
  public readonly channel: string;

  constructor(channel: string) {
    super(`Channel '${channel}' not found`);
    this.channel = channel;
  }
}

/**
 * Thrown when an invalid slider is specified in streamer mode
 */
export class SliderNotFoundError extends SonarError {
  public readonly slider: string;

  constructor(slider: string) {
    super(`Slider '${slider}' not found`);
    this.slider = slider;
  }
}

/**
 * Thrown when an invalid volume value is provided
 */
export class InvalidVolumeError extends SonarError {
  public readonly volume: number;

  constructor(volume: number) {
    super(`Invalid volume '${volume}'! Value must be between 0 and 1!`);
    this.volume = volume;
  }
}

/**
 * Thrown when an invalid mix volume value is provided
 */
export class InvalidMixVolumeError extends SonarError {
  public readonly mixVolume: number;

  constructor(mixVolume: number) {
    super(`Invalid mix volume '${mixVolume}'! Value must be between -1 and 1!`);
    this.mixVolume = mixVolume;
  }
}
