import { initDOMRegistry } from "./core/dom.js";
import { initAudioClips } from "./core/audio-clips.js";
import { initLoadAudio } from "./core/load-audio.js";
import { initDropdown } from "./components/dropdown.js";
import { initSearchButtons } from "./components/search-buttons.js";
import { initSearchSong } from "./components/search-song.js";
import { initEndScreens } from "./components/end-screens.js";

// global guessNum handling
export let guessNum = 1;
export function setGuessNum(num) { guessNum = num; }

document.addEventListener("DOMContentLoaded", async () => {
    initDOMRegistry();
    await initLoadAudio();
    initAudioClips();
    initDropdown();
    initSearchButtons();
    initSearchSong();
    initEndScreens();
});