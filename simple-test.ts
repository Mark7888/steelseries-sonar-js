/**
 * Simple test script for steelseries-sonar
 */

import { Sonar, ChannelName, StreamerSliderName } from './src/sonar';
import {
  EnginePathNotFoundError,
  ServerNotAccessibleError,
  SonarNotEnabledError,
} from './src/exceptions';

/**
 * Test classic mode functionality
 */
async function testClassicMode(): Promise<void> {
  console.log('🧪 Testing Classic Mode...\n');

  try {
    const sonar = await Sonar.create();

    console.log('🔄 Disabling streamer mode...');
    const streamerModeDisabled = !(await sonar.setStreamerMode(false));
    console.log(`✅ Streamer mode disabled: ${streamerModeDisabled}`);

    console.log('\n📊 Getting volume data...');
    const volumeData = await sonar.getVolumeData();
    console.log('Classic Mode - Volume Data:');
    console.log(JSON.stringify(volumeData, null, 2));

    console.log('\n🎚️ Setting master volume to 50%...');
    const channel: ChannelName = 'master';
    const volume = 0.5;
    const result = await sonar.setVolume(channel, volume);
    console.log(`✅ Classic Mode - Set volume for ${channel}:`, result);

    console.log('\n🔇 Muting game channel...');
    const gameChannel: ChannelName = 'game';
    const muted = true;
    const muteResult = await sonar.muteChannel(gameChannel, muted);
    console.log(`✅ Classic Mode - Mute ${gameChannel}:`, muteResult);

    console.log('\n⚖️ Testing chat mix...');
    const chatMixData = await sonar.getChatMixData();
    console.log('Chat mix data:', chatMixData);

    const mixVolume = 0.3;
    const chatMixResult = await sonar.setChatMix(mixVolume);
    console.log(`✅ Chat mix set to ${mixVolume}:`, chatMixResult);

    console.log('\n✅ Classic Mode tests completed successfully!');
  } catch (error) {
    handleError(error, 'Classic Mode');
  }
}

/**
 * Test streamer mode functionality
 */
async function testStreamerMode(): Promise<void> {
  console.log('🎮 Testing Streamer Mode...\n');

  try {
    const sonar = await Sonar.create();

    console.log('🔄 Enabling streamer mode...');
    const streamerModeEnabled = await sonar.setStreamerMode(true);
    console.log(`✅ Streamer mode enabled: ${streamerModeEnabled}`);

    const sliders: StreamerSliderName[] = ['streaming', 'monitoring'];

    for (const slider of sliders) {
      console.log(`\n🎛️ Testing ${slider.toUpperCase()} slider:`);

      console.log(`📊 Getting volume data for ${slider}...`);
      const volumeData = await sonar.getVolumeData();
      console.log(`Streamer Mode (${slider}) - Volume Data:`);
      console.log(JSON.stringify(volumeData, null, 2));

      console.log(`🎚️ Setting master volume to 50% on ${slider} slider...`);
      const channel: ChannelName = 'master';
      const volume = 0.5;
      const result = await sonar.setVolume(channel, volume, slider);
      console.log(
        `✅ Streamer Mode (${slider}) - Set volume for ${channel}:`,
        result
      );

      console.log(`🔇 Muting game channel on ${slider} slider...`);
      const gameChannel: ChannelName = 'game';
      const muted = true;
      const muteResult = await sonar.muteChannel(gameChannel, muted, slider);
      console.log(
        `✅ Streamer Mode (${slider}) - Mute ${gameChannel}:`,
        muteResult
      );

      // Add a small delay between sliders
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n✅ Streamer Mode tests completed successfully!');
  } catch (error) {
    handleError(error, 'Streamer Mode');
  }
}

/**
 * Test error handling
 */
async function testErrorHandling(): Promise<void> {
  console.log('🚨 Testing Error Handling...\n');

  try {
    const sonar = await Sonar.create();

    // Test invalid channel
    console.log('🧪 Testing invalid channel name...');
    try {
      await sonar.setVolume('invalid' as any, 0.5);
      console.log('❌ Expected error for invalid channel, but got success');
    } catch (error) {
      const err = error as Error;
      console.log('✅ Successfully caught invalid channel error:', err.message);
    }

    // Test invalid volume
    console.log('\n🧪 Testing invalid volume value...');
    try {
      await sonar.setVolume('master', 1.5);
      console.log('❌ Expected error for invalid volume, but got success');
    } catch (error) {
      const err = error as Error;
      console.log('✅ Successfully caught invalid volume error:', err.message);
    }

    // Test invalid mix volume
    console.log('\n🧪 Testing invalid mix volume...');
    try {
      await sonar.setChatMix(2.0);
      console.log('❌ Expected error for invalid mix volume, but got success');
    } catch (error) {
      const err = error as Error;
      console.log('✅ Successfully caught invalid mix volume error:', err.message);
    }

    console.log('\n✅ Error handling tests completed successfully!');
  } catch (error) {
    handleError(error, 'Error Handling');
  }
}

/**
 * Handle and display errors with helpful context
 */
function handleError(error: unknown, context: string): void {
  const err = error as Error;
  console.error(`❌ ${context} Error:`, err.message);

  if (error instanceof EnginePathNotFoundError) {
    console.log('💡 Engine not found!');
    console.log('   Make sure SteelSeries Engine 3 is installed and running');
  } else if (error instanceof ServerNotAccessibleError) {
    console.log(`💡 Server not accessible, status code: ${error.statusCode}`);
    console.log('   Make sure SteelSeries Engine is running and accessible');
  } else if (error instanceof SonarNotEnabledError) {
    console.log('💡 Sonar not enabled!');
    console.log('   Make sure SteelSeries Sonar is enabled in SteelSeries Engine');
  } else {
    console.log('💡 Unexpected error occurred');
  }
}

/**
 * Main test function
 */
async function main(): Promise<void> {
  console.log('🎯 SteelSeries Sonar JavaScript/TypeScript API Tests\n');
  console.log('=' .repeat(60));
  
  console.log('🚀 Starting comprehensive tests...\n');

  // Test classic mode
  await testClassicMode();

  console.log('\n' + '-'.repeat(60) + '\n');

  // Test streamer mode
  await testStreamerMode();

  console.log('\n' + '-'.repeat(60) + '\n');

  // Test error handling
  await testErrorHandling();

  console.log('\n' + '='.repeat(60));
  console.log('🎉 All tests completed!');
  console.log('✅ SteelSeries Sonar JS API is working correctly');
}

// Run the main function
main().catch(error => {
  console.error('💥 Test execution failed:', (error as Error).message);
});

export { testClassicMode, testStreamerMode, testErrorHandling, main };
