import { getElements } from "../core/dom.js";
import { setGameEnded } from "../core/audio-clips.js";
import { getSupabaseClient } from "../core/supabase.js";
import { guessNum } from "../main.js";

const supabaseClient = getSupabaseClient();
let endScreen, closeButton, searchBar, skipButton, guessButton, playButton,
endScreenText, endScreenTitle, endScreenAnswerTitle, endScreenAnswerOther, endScreenGuessNum, youtubeButton;

export function initEndScreens() {
    ({ endScreen, closeButton, searchBar, skipButton, guessButton, playButton,
        endScreenText, endScreenTitle, endScreenAnswerTitle, endScreenAnswerOther, endScreenGuessNum, youtubeButton } = getElements());

    // close end screen on click
    closeButton.addEventListener("click", () => {
        endScreen.close();
    });
}

// helper for end screens
async function endGame(answer) {
    // disable search elements
    searchBar.disabled = true;
    skipButton.style.pointerEvents = "none";
    guessButton.style.pointerEvents = "none";
    setGameEnded(true);

    const answerInfo = await getAnswerInfo(answer); // returns [title, composer, year, youtube_link]
    endScreenAnswerTitle.innerText = answerInfo[0];
    endScreenAnswerOther.innerText = answerInfo[1] + " • " + answerInfo[2];
    youtubeButton.href = answerInfo[3];
    endScreen.showModal();
    playButton.click();
}

// helper to get game answer info from uuid
async function getAnswerInfo(answer) {
    // get song info for answer
    const { data, error } = await supabaseClient
        .from("songs")
        .select("title, composer, year, youtube_link")
        .eq("id", answer)
        .single();

    // handle error
    if (error) {
        console.log(error);
        return;
    }

    return [data.title, data.composer, data.year, data.youtube_link]; // return answer info
}

export async function winScreen(answer) {
    endScreenTitle.innerText = "Congratulations!";
    endScreenTitle.classList.add("game-win-underline");
    endScreenText.innerText = "You correctly guessed";
    if (guessNum == 1) { endScreenGuessNum.innerText = "in 1 guess!" }
    else { endScreenGuessNum.innerText = `in ${guessNum} guesses!` }
    await endGame(answer);
}

export async function loseScreen(answer) {
    endScreenTitle.innerText = "You Lost!";
    endScreenTitle.classList.add("game-lose-underline");
    endScreenText.innerText = "The answer was";
    await endGame(answer);
}