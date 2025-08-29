# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Basic documentation structure

## [1.0.0] - 2025-08-29

### Added
- Complete SteelSeries Sonar JavaScript/TypeScript API implementation
- Support for all audio channels (master, game, chat, media, aux, microphone)
- Streamer mode support with streaming and monitoring sliders
- Chat mix control functionality
- Comprehensive TypeScript type definitions
- Cross-platform support (Windows, macOS, Linux)
- Async/await API with Promise-based methods
- Factory method pattern for proper async initialization
- Complete error handling with custom exception types:
  - `EnginePathNotFoundError`
  - `ServerNotAccessibleError`
  - `SonarNotEnabledError`
  - `ServerNotReadyError`
  - `ServerNotRunningError`
  - `WebServerAddressNotFoundError`
  - `ChannelNotFoundError`
  - `SliderNotFoundError`
  - `InvalidVolumeError`
  - `InvalidMixVolumeError`
- Comprehensive test suite with Jest
- ESLint and Prettier configuration for code quality
- GitHub Actions CI/CD pipeline
- Automated npm publishing workflow
- Example usage files for basic and streamer mode scenarios

### Features
- **Volume Control**: Set volume levels for individual audio channels (0.0 to 1.0)
- **Mute/Unmute**: Mute or unmute specific audio channels
- **Streamer Mode**: Separate controls for streaming and monitoring audio
- **Chat Mix**: Adjust the balance between game and chat audio (-1.0 to 1.0)
- **Auto-discovery**: Automatically finds SteelSeries Engine installation
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Detailed error messages with specific exception types

### Technical
- Built with TypeScript 5.2+
- Uses axios for HTTP requests with SSL verification disabled
- Supports Node.js 14.0.0+
- Cross-platform path resolution for SteelSeries Engine
- Factory method pattern for async initialization
- Comprehensive unit tests with mocking
- GitHub Actions for automated testing on multiple Node.js versions and platforms

### Documentation
- Complete README with usage examples
- API reference documentation
- TypeScript type definitions
- Example files for common use cases
- Comprehensive error handling guide

### Development
- ESLint configuration with TypeScript rules
- Prettier for consistent code formatting
- Jest testing framework with coverage reporting
- GitHub Actions for CI/CD
- Automated npm publishing on git tags
