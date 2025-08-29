# SteelSeries Sonar JavaScript/TypeScript API

[![npm version](https://badge.fury.io/js/steelseries-sonar-js.svg)](https://badge.fury.io/js/steelseries-sonar-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This JavaScript/TypeScript package provides a convenient interface for interacting with the SteelSeries Sonar application API. The Sonar application allows users to control and display volumes for various audio channels, making it perfect for gamers and streamers who need programmatic control over their audio setup.

## Features

- 🎮 **Full Sonar API Support**: Control all audio channels (master, game, chat, media, aux, mic)
- 🎚️ **Streamer Mode**: Support for streaming and monitoring sliders
- 🎛️ **Chat Mix Control**: Adjust chat mix balance
- 📦 **TypeScript Ready**: Full TypeScript support with type definitions
- 🧪 **Well Tested**: Comprehensive test suite
- 🔧 **Cross-Platform**: Works on Windows, macOS, and Linux
- ⚡ **Modern**: Built with async/await and Promise-based API

## Installation

Install the package using npm or yarn:

### Using npm
```bash
npm install steelseries-sonar-js
```

### Using yarn
```bash
yarn add steelseries-sonar-js
```

## Usage

### Importing the Library

#### ES6 Modules / TypeScript
```typescript
import { Sonar, SonarOptions } from 'steelseries-sonar-js';
```

#### CommonJS
```javascript
const { Sonar } = require('steelseries-sonar-js');
```

### Basic Example

```typescript
import { Sonar } from 'steelseries-sonar-js';

async function main() {
  try {
    // Create a Sonar instance
    const sonar = await Sonar.create();
    
    // Get current volume data
    const volumeData = await sonar.getVolumeData();
    console.log('Volume data:', volumeData);
    
    // Set master volume to 50%
    await sonar.setVolume('master', 0.5);
    
    // Mute the game channel
    await sonar.muteChannel('game', true);
    
    // Set chat mix balance
    await sonar.setChatMix(0.2);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Configuration Options

The `Sonar.create()` method accepts an optional `SonarOptions` object:

```typescript
interface SonarOptions {
  appDataPath?: string;  // Custom path to SteelSeries Engine coreProps.json
  streamerMode?: boolean; // Force streamer mode on/off
}

// Example with custom options
const sonar = await Sonar.create({
  appDataPath: '/custom/path/to/coreProps.json',
  streamerMode: true
});
```

### Default Paths

The library automatically detects the SteelSeries Engine installation path:

- **Windows**: `%ProgramData%\\SteelSeries\\SteelSeries Engine 3\\coreProps.json`
- **macOS**: `~/Library/Application Support/SteelSeries Engine 3/coreProps.json`
- **Linux**: `~/.local/share/SteelSeries Engine 3/coreProps.json`

## API Reference

### Sonar Class

#### Static Methods

##### `Sonar.create(options?: SonarOptions): Promise<Sonar>`
Creates a new Sonar instance with proper async initialization.

**Parameters:**
- `options` (optional): Configuration options

**Returns:** Promise that resolves to a Sonar instance

**Throws:**
- `EnginePathNotFoundError`: SteelSeries Engine not found
- `ServerNotAccessibleError`: Cannot connect to SteelSeries server
- `SonarNotEnabledError`: Sonar is not enabled
- `ServerNotReadyError`: Sonar is not ready
- `ServerNotRunningError`: Sonar is not running

#### Instance Methods

##### `isStreamerMode(): Promise<boolean>`
Check if streamer mode is currently active.

##### `setStreamerMode(streamerMode: boolean): Promise<boolean>`
Enable or disable streamer mode.

##### `getVolumeData(): Promise<VolumeData>`
Get current volume data for all channels.

##### `setVolume(channel: ChannelName, volume: number, streamerSlider?: StreamerSliderName): Promise<any>`
Set volume for a specific channel.

**Parameters:**
- `channel`: Audio channel name ('master', 'game', 'chatRender', 'media', 'aux', 'chatCapture')
- `volume`: Volume level (0.0 to 1.0)
- `streamerSlider` (optional): Streamer slider ('streaming' or 'monitoring', default: 'streaming')

##### `muteChannel(channel: ChannelName, muted: boolean, streamerSlider?: StreamerSliderName): Promise<any>`
Mute or unmute a specific channel.

**Parameters:**
- `channel`: Audio channel name
- `muted`: Whether to mute the channel
- `streamerSlider` (optional): Streamer slider (only in streamer mode)

##### `getChatMixData(): Promise<ChatMixData>`
Get current chat mix data.

##### `setChatMix(mixVolume: number): Promise<ChatMixData>`
Set chat mix balance.

**Parameters:**
- `mixVolume`: Mix balance (-1.0 to 1.0)

### Types

#### `ChannelName`
```typescript
type ChannelName = 'master' | 'game' | 'chatRender' | 'media' | 'aux' | 'chatCapture';
```

#### `StreamerSliderName`
```typescript
type StreamerSliderName = 'streaming' | 'monitoring';
```

## Streamer Mode

The SteelSeries Sonar API supports streamer mode, which allows users to manage two separate sliders: `streaming` and `monitoring`. These sliders enable fine-tuned control over different audio channels.

### Checking Streamer Mode

```typescript
const sonar = await Sonar.create();
const isStreamerMode = await sonar.isStreamerMode();
console.log('Streamer mode:', isStreamerMode);
```

### Enabling Streamer Mode

```typescript
const sonar = await Sonar.create();
const enabled = await sonar.setStreamerMode(true);
console.log('Streamer mode enabled:', enabled);
```

### Using Streamer Sliders

```typescript
const sonar = await Sonar.create({ streamerMode: true });

// Set volume for streaming slider
await sonar.setVolume('master', 0.8, 'streaming');

// Set volume for monitoring slider  
await sonar.setVolume('master', 0.6, 'monitoring');

// Mute game channel on streaming slider
await sonar.muteChannel('game', true, 'streaming');
```

## Error Handling

The library provides comprehensive error handling with specific error types:

```typescript
import { 
  Sonar,
  EnginePathNotFoundError,
  ServerNotAccessibleError,
  SonarNotEnabledError,
  InvalidVolumeError,
  ChannelNotFoundError
} from 'steelseries-sonar-js';

try {
  const sonar = await Sonar.create();
  await sonar.setVolume('master', 0.5);
} catch (error) {
  if (error instanceof EnginePathNotFoundError) {
    console.error('SteelSeries Engine not found!');
  } else if (error instanceof ServerNotAccessibleError) {
    console.error('Cannot connect to SteelSeries server:', error.statusCode);
  } else if (error instanceof SonarNotEnabledError) {
    console.error('Sonar is not enabled in SteelSeries Engine');
  } else if (error instanceof InvalidVolumeError) {
    console.error('Invalid volume level:', error.volume);
  } else if (error instanceof ChannelNotFoundError) {
    console.error('Invalid channel name:', error.channel);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

### Available Exceptions

- `EnginePathNotFoundError`: SteelSeries Engine 3 not installed or not in the default location
- `ServerNotAccessibleError`: SteelSeries server not accessible
- `SonarNotEnabledError`: SteelSeries Sonar is not enabled
- `ServerNotReadyError`: SteelSeries Sonar is not ready yet
- `ServerNotRunningError`: SteelSeries Sonar is not running
- `WebServerAddressNotFoundError`: Web server address not found
- `ChannelNotFoundError`: Invalid channel name specified
- `SliderNotFoundError`: Invalid slider name specified (streamer mode)
- `InvalidVolumeError`: Invalid volume value (must be 0-1)
- `InvalidMixVolumeError`: Invalid mix volume value (must be -1 to 1)

## Examples

### Complete Example

```typescript
import { Sonar, ChannelName } from 'steelseries-sonar-js';

async function controlSonar() {
  try {
    // Initialize Sonar
    const sonar = await Sonar.create();
    console.log('Connected to SteelSeries Sonar');
    
    // Check current mode
    const isStreamer = await sonar.isStreamerMode();
    console.log('Streamer mode:', isStreamer);
    
    // Get current volume data
    const volumes = await sonar.getVolumeData();
    console.log('Current volumes:', volumes);
    
    // Set volumes for different channels
    const channels: ChannelName[] = ['master', 'game', 'media'];
    for (const channel of channels) {
      await sonar.setVolume(channel, 0.7);
      console.log(`Set ${channel} volume to 70%`);
    }
    
    // Mute chat temporarily
    await sonar.muteChannel('chatRender', true);
    console.log('Chat muted');
    
    // Adjust chat mix
    await sonar.setChatMix(0.3);
    console.log('Chat mix set to 0.3');
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Unmute chat
    await sonar.muteChannel('chatRender', false);
    console.log('Chat unmuted');
    
  } catch (error) {
    console.error('Error controlling Sonar:', error.message);
  }
}

controlSonar();
```

### Streamer Mode Example

```typescript
import { Sonar } from 'steelseries-sonar-js';

async function streamerExample() {
  try {
    // Create instance with streamer mode enabled
    const sonar = await Sonar.create({ streamerMode: true });
    
    // Set different volumes for streaming and monitoring
    await sonar.setVolume('game', 0.8, 'streaming');   // Game loud for stream
    await sonar.setVolume('game', 0.5, 'monitoring');  // Game quieter for monitoring
    
    await sonar.setVolume('chatRender', 0.6, 'streaming');  // Chat medium for stream
    await sonar.setVolume('chatRender', 0.9, 'monitoring'); // Chat loud for monitoring
    
    // Mute music for stream but keep it for monitoring
    await sonar.muteChannel('media', true, 'streaming');
    await sonar.muteChannel('media', false, 'monitoring');
    
    console.log('Streamer audio setup complete');
    
  } catch (error) {
    console.error('Streamer setup failed:', error.message);
  }
}

streamerExample();
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Mark7888/steelseries-sonar-js.git
cd steelseries-sonar-js

# Install dependencies
yarn install

# Build the project
yarn build

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Lint code
yarn lint

# Format code
yarn format
```

### Scripts

- `yarn build` - Compile TypeScript to JavaScript
- `yarn build:watch` - Watch mode compilation
- `yarn test` - Run test suite
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn lint` - Lint TypeScript files
- `yarn lint:fix` - Fix linting issues automatically
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

## Requirements

- Node.js 14.0.0 or higher
- SteelSeries Engine 3 installed and running
- SteelSeries Sonar enabled in SteelSeries Engine

## Platform Support

- ✅ Windows 10/11
- ✅ macOS 10.14+
- ✅ Linux (Ubuntu 18.04+, other distributions may work)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [steelseries-sonar-py](https://github.com/Mark7888/steelseries-sonar-py) - Python version of this library

## Changelog

### 1.0.0
- Initial release
- Full SteelSeries Sonar API support
- TypeScript support
- Streamer mode support
- Comprehensive test suite
- Cross-platform compatibility

## Support

If you encounter any problems or have questions, please open an issue on the [GitHub repository](https://github.com/Mark7888/steelseries-sonar-js/issues).

For SteelSeries-specific issues, please refer to the [SteelSeries Support](https://support.steelseries.com/) page.
