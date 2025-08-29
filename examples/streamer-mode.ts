/**
 * Streamer mode example for steelseries-sonar-js
 * 
 * This example demonstrates how to use the library in streamer mode
 * with separate streaming and monitoring sliders.
 */

import { Sonar, ChannelName, StreamerSliderName } from '../src/index';

async function streamerExample() {
  try {
    console.log('🎮 Setting up SteelSeries Sonar for streaming...');
    
    // Create a Sonar instance with streamer mode enabled
    const sonar = await Sonar.create({ streamerMode: true });
    console.log('✅ Connected in streamer mode!');
    
    // Verify streamer mode is active
    const isStreamerMode = await sonar.isStreamerMode();
    if (!isStreamerMode) {
      console.log('⚠️ Streamer mode not active, enabling it...');
      await sonar.setStreamerMode(true);
      console.log('✅ Streamer mode enabled!');
    }
    
    console.log('\n🎚️ Setting up audio levels for streaming and monitoring...');
    
    // Configure streaming slider (what viewers hear)
    console.log('\n📡 Configuring STREAMING slider (what viewers hear):');
    
    // Game audio - loud for stream
    await sonar.setVolume('game', 0.8, 'streaming');
    console.log('🎮 Game volume: 80% for streaming');
    
    // Chat - moderate for stream
    await sonar.setVolume('chatRender', 0.6, 'streaming');
    console.log('💬 Chat volume: 60% for streaming');
    
    // Music - quiet for stream (to avoid copyright issues)
    await sonar.setVolume('media', 0.3, 'streaming');
    console.log('🎵 Music volume: 30% for streaming');
    
    // Microphone - good level for stream
    await sonar.setVolume('chatCapture', 0.7, 'streaming');
    console.log('🎤 Microphone volume: 70% for streaming');
    
    // Configure monitoring slider (what streamer hears)
    console.log('\n🎧 Configuring MONITORING slider (what you hear):');
    
    // Game audio - moderate for monitoring
    await sonar.setVolume('game', 0.6, 'monitoring');
    console.log('🎮 Game volume: 60% for monitoring');
    
    // Chat - loud for monitoring (to hear viewers clearly)
    await sonar.setVolume('chatRender', 0.9, 'monitoring');
    console.log('💬 Chat volume: 90% for monitoring');
    
    // Music - louder for monitoring (you want to enjoy it)
    await sonar.setVolume('media', 0.8, 'monitoring');
    console.log('🎵 Music volume: 80% for monitoring');
    
    // Microphone monitoring - lower to avoid feedback
    await sonar.setVolume('chatCapture', 0.4, 'monitoring');
    console.log('🎤 Microphone monitoring: 40%');
    
    // Example: Mute music for stream but keep it for monitoring
    console.log('\n🔇 Muting music for stream (copyright safe) but keeping it for monitoring...');
    await sonar.muteChannel('media', true, 'streaming');
    await sonar.muteChannel('media', false, 'monitoring');
    console.log('✅ Music muted for stream, audible for monitoring');
    
    // Example: Quick stream break - mute everything for stream
    console.log('\n⏸️ Simulating stream break (muting all stream audio)...');
    const channels: ChannelName[] = ['game', 'chatRender', 'media', 'chatCapture'];
    
    for (const channel of channels) {
      await sonar.muteChannel(channel, true, 'streaming');
    }
    console.log('🔇 All channels muted for streaming');
    
    // Wait 3 seconds to simulate break
    console.log('⏳ Break time (3 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Unmute everything for stream
    console.log('\n🔊 Back from break - unmuting stream audio...');
    for (const channel of channels) {
      await sonar.muteChannel(channel, false, 'streaming');
    }
    console.log('✅ All channels unmuted for streaming');
    
    // Set up chat mix for balanced audio
    console.log('\n⚖️ Setting chat mix for balanced game/chat audio...');
    await sonar.setChatMix(0.2); // Slightly favor chat
    console.log('✅ Chat mix set to favor chat slightly');
    
    // Get final volume data
    console.log('\n📊 Final volume configuration:');
    const volumeData = await sonar.getVolumeData();
    console.log(JSON.stringify(volumeData, null, 2));
    
    console.log('\n🎉 Streamer setup completed successfully!');
    console.log('💡 Your audio is now optimized for streaming with separate monitoring levels.');
    
  } catch (error) {
    console.error('❌ Error setting up streaming:', error.message);
    
    if (error.name === 'EnginePathNotFoundError') {
      console.log('💡 Make sure SteelSeries Engine 3 is installed and running');
    } else if (error.name === 'SonarNotEnabledError') {
      console.log('💡 Make sure SteelSeries Sonar is enabled in SteelSeries Engine');
    } else if (error.name === 'SliderNotFoundError') {
      console.log('💡 Make sure streamer mode is enabled in SteelSeries Sonar');
    }
  }
}

export { streamerExample };
