import { Howl, Howler } from "howler";
import wrongAnswerSfx from "../assets/sfx/wrong-answer.mp3";
import getRewardSfx from "../assets/sfx/get-reward.mp3";
import correctSfx from "../assets/sfx/success.mp3";
import popClickSfx from "../assets/sfx/pop-click.mp3";

// Audio asset sources map
const SFX_SOURCES = {
  wrong: wrongAnswerSfx,
  getReward: getRewardSfx,
  pop: popClickSfx,
  correct: correctSfx,
};

class AudioManager {
  constructor() {
    this.sounds = {};
    // Load initial mute state from localStorage (default to false if not set)
    this.muted = localStorage.getItem("app_audio_muted") === "true";

    // this.volume = localStorage.getItem("app_audio_volume") || "0.5";

    // Set initial mute state in Howler global settings
    Howler.mute(this.muted);
    // Howler.volume(this.volume);
  }

  /**
   * Play a sound effect by its key.
   * @param {('wrong'|'getReward'|'pop'|'correct')} key - The key of the sound effect to play.
   * @returns {Howl|null} The Howl sound instance or null if not found.
   */
  playSFX(key) {
    if (!SFX_SOURCES[key]) {
      console.warn(`Sound effect key "${key}" not found.`);
      return null;
    }

    // Lazily instantiate the Howl instance if not already cached
    if (!this.sounds[key]) {
      this.sounds[key] = new Howl({
        src: [SFX_SOURCES[key]],
        html5: false, // Use Web Audio API for fast triggering of game SFX
        preload: true,
      });
    }

    const sound = this.sounds[key];

    // Stop the sound if it's currently playing to allow overlapping or rapid re-triggering
    if (sound.playing()) {
      sound.stop();
    }

    sound.play();
    return sound;
  }

  /**
   * Check if audio is currently muted.
   * @returns {boolean} True if muted.
   */
  isMuted() {
    return this.muted;
  }

  /**
   * Toggle the global mute state and persist to localStorage.
   * @returns {boolean} The new mute state.
   */
  toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    localStorage.setItem("app_audio_muted", String(this.muted));
    return this.muted;
  }

  /**
   * Explicitly set the global mute state and persist to localStorage.
   * @param {boolean} muteState - True to mute, false to unmute.
   */
  setMute(muteState) {
    this.muted = !!muteState;
    Howler.mute(this.muted);
    localStorage.setItem("app_audio_muted", String(this.muted));
  }

  /**
   * Set global volume (0.0 to 1.0).
   * @param {number} volume - Volume level.
   */
  setVolume(volume) {
    Howler.volume(volume);
  }

  /**
   * Get global volume level.
   * @returns {number} Volume level.
   */
  getVolume() {
    return Howler.volume();
  }
}

const audioManager = new AudioManager();
export default audioManager;
