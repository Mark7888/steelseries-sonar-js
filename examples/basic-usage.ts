/**
 * Basic usage example for steelseries-sonar-js
 * 
 * This example demonstrates the basic functionality of the library
 * including connecting to Sonar, getting volume data, and controlling audio channels.
 */

import { Sonar, ChannelName } from '../src/index';

async function basicExample() {
  try {
    console.log('Connecting to SteelSeries Sonar...');
    
    // Create a Sonar instance
    const sonar = await Sonar.create();
    console.log('✅ Connected successfully!');
    
    // Check if streamer mode is active
    const isStreamerMode = await sonar.isStreamerMode();
    console.log(`📡 Streamer mode: ${isStreamerMode ? 'ON' : 'OFF'}`);
    
    // Get current volume data
    console.log('\n🔊 Getting current volume data...');
    const volumeData = await sonar.getVolumeData();
    console.log('Volume data:', JSON.stringify(volumeData, null, 2));
    
    // Set master volume to 75%
    console.log('\n🎚️ Setting master volume to 75%...');
    await sonar.setVolume('master', 0.75);
    console.log('✅ Master volume set!');
    
    // Set game volume to 60%
    console.log('\n🎮 Setting game volume to 60%...');
    await sonar.setVolume('game', 0.6);
    console.log('✅ Game volume set!');
    
    // Mute the media channel temporarily
    console.log('\n🔇 Muting media channel...');
    await sonar.muteChannel('media', true);
    console.log('✅ Media channel muted!');
    
    // Wait 2 seconds
    console.log('\n⏳ Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Unmute the media channel
    console.log('\n🔊 Unmuting media channel...');
    await sonar.muteChannel('media', false);
    console.log('✅ Media channel unmuted!');
    
    // Get chat mix data
    console.log('\n🎙️ Getting chat mix data...');
    const chatMixData = await sonar.getChatMixData();
    console.log('Chat mix data:', JSON.stringify(chatMixData, null, 2));
    
    // Set chat mix to favor chat slightly
    console.log('\n⚖️ Setting chat mix balance...');
    await sonar.setChatMix(0.3);
    console.log('✅ Chat mix balance set to 0.3!');
    
    console.log('\n🎉 Example completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Provide helpful error messages
    if (error.name === 'EnginePathNotFoundError') {
      console.log('💡 Make sure SteelSeries Engine 3 is installed and running');
    } else if (error.name === 'SonarNotEnabledError') {
      console.log('💡 Make sure SteelSeries Sonar is enabled in SteelSeries Engine');
    } else if (error.name === 'ServerNotAccessibleError') {
      console.log('💡 Make sure SteelSeries Engine is running and Sonar is accessible');
    }
  }
}

// Run the example
if (require.main === module) {
  basicExample();
}

export { basicExample };
