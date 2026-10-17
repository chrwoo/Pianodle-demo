import { guessNum } from '../main.js';
import { getElements } from './dom.js';

let audioPlayer, playButton, progressBar;

// define animationID for progress bar loop
let animationID = null;

let gameEnded = false;
export function setGameEnded(newBool) {
    gameEnded = newBool;
}

// helper function to convert guessNum to duration
function guessNumToDuration(num) {
    // first guess time
    if (num === 1) {return 0.1;}
    // time for guesses 2-6 being 1s, 2s, 4s, 8s, 16s
    return Math.pow(2, num-2);
}

export function initAudioClips() {
    // set needed elements from DOM
    ({ audioPlayer, playButton, progressBar } = getElements());


    // play audio when play button is clicked
    playButton.addEventListener("click", async () => {
        try {
            if (audioPlayer.paused) {
                await audioPlayer.play();
                // start progress bar animation loop
                animationID = requestAnimationFrame(progressBarLoop);
            } else {
                audioPlayer.pause();
                // stop progress bar animation loop
                cancelAnimationFrame(animationID);
            }
        } catch (error) {
            console.log("Failed to play track: ", error);   
        }
    });

    // backup check to stop audio
    audioPlayer.addEventListener("timeupdate", () => {
        const duration = guessNumToDuration(guessNum)
        if (!gameEnded && !audioPlayer.paused && audioPlayer.currentTime >= duration) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            // reset animation
            cancelAnimationFrame(animationID);
            // set progress bar width
            progressBar.style.width = guessNumToDuration(guessNum) / audioPlayer.duration * 100 + "%";
        }
    });

    // if audio played the whole track, update progressBar
    audioPlayer.addEventListener("ended", () => {
        if (audioPlayer.currentTime == 16) {
            cancelAnimationFrame(animationID);
            audioPlayer.currentTime = 0;
            progressBar.style.width = "100%";
        }
    });
}

// updates progress bar and checks audio time
function progressBarLoop() {
    if (!audioPlayer.paused) {
        // calculate progress percentage
        const progress = audioPlayer.currentTime / audioPlayer.duration * 100;
        // set progress bar width
        progressBar.style.width = progress + "%";
        // get current audio clip duration based on guess
        // let user listen to whole piece if game over
        const duration = gameEnded ? guessNumToDuration(6) : guessNumToDuration(guessNum);

        // stop audio if play duration is over
        if (audioPlayer.currentTime >= duration) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            // reset animation
            cancelAnimationFrame(animationID);
            return;
        }

        // continue loop
        animationID = requestAnimationFrame(progressBarLoop);
    }
}