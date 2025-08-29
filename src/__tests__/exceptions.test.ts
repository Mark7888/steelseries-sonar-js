import {
  SonarError,
  EnginePathNotFoundError,
  ServerNotAccessibleError,
  SonarNotEnabledError,
  ChannelNotFoundError,
  SliderNotFoundError,
  InvalidVolumeError,
  InvalidMixVolumeError,
} from '../exceptions';

describe('Exceptions', () => {
  describe('SonarError', () => {
    it('should be an instance of Error', () => {
      const error = new EnginePathNotFoundError();
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(SonarError);
    });
  });

  describe('EnginePathNotFoundError', () => {
    it('should have correct message', () => {
      const error = new EnginePathNotFoundError();
      expect(error.message).toBe(
        'SteelSeries Engine 3 not installed or not in the default location!'
      );
      expect(error.name).toBe('EnginePathNotFoundError');
    });
  });

  describe('ServerNotAccessibleError', () => {
    it('should include status code in message', () => {
      const error = new ServerNotAccessibleError(404);
      expect(error.message).toBe(
        'SteelSeries server not accessible! Status code: 404'
      );
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('ServerNotAccessibleError');
    });
  });

  describe('SonarNotEnabledError', () => {
    it('should have correct message', () => {
      const error = new SonarNotEnabledError();
      expect(error.message).toBe('SteelSeries Sonar is not enabled!');
      expect(error.name).toBe('SonarNotEnabledError');
    });
  });

  describe('ChannelNotFoundError', () => {
    it('should include channel name in message', () => {
      const error = new ChannelNotFoundError('invalid');
      expect(error.message).toBe("Channel 'invalid' not found");
      expect(error.channel).toBe('invalid');
      expect(error.name).toBe('ChannelNotFoundError');
    });
  });

  describe('SliderNotFoundError', () => {
    it('should include slider name in message', () => {
      const error = new SliderNotFoundError('invalid');
      expect(error.message).toBe("Slider 'invalid' not found");
      expect(error.slider).toBe('invalid');
      expect(error.name).toBe('SliderNotFoundError');
    });
  });

  describe('InvalidVolumeError', () => {
    it('should include volume value in message', () => {
      const error = new InvalidVolumeError(1.5);
      expect(error.message).toBe(
        "Invalid volume '1.5'! Value must be between 0 and 1!"
      );
      expect(error.volume).toBe(1.5);
      expect(error.name).toBe('InvalidVolumeError');
    });
  });

  describe('InvalidMixVolumeError', () => {
    it('should include mix volume value in message', () => {
      const error = new InvalidMixVolumeError(2.0);
      expect(error.message).toBe(
        "Invalid mix volume '2'! Value must be between -1 and 1!"
      );
      expect(error.mixVolume).toBe(2.0);
      expect(error.name).toBe('InvalidMixVolumeError');
    });
  });
});
