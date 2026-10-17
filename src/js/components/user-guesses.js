import { winScreen, loseScreen } from "./end-screens.js"
import { getSupabaseClient } from "../core/supabase.js";
import { guessNum, setGuessNum } from "../main.js";
import { getElements } from "../core/dom.js";

const supabaseClient = getSupabaseClient();

// updates guess blocks after a guess
export function renderGuessBlocks(type, songName) {
    const { guessContainer } = getElements();
    // gets current child of guess container based on guess number
    const guessNumIndex = guessNum - 1;
    const currentGuess = guessContainer.children[guessNumIndex];
    // set guess block text
    currentGuess.textContent = songName;

    // changes guess block to match correctness and handle case for skip
    if (type === "skip") {
        currentGuess.className = "guess-block-fail";
        currentGuess.style.textAlign = "center";
    } else {
        currentGuess.className = `guess-block-${type}`;
    }
    
    // set next block to be "select" class
    if (guessNum < 6) {
        guessContainer.children[guessNumIndex + 1].className = "guess-block-select";
    }
}

// verifies user guess serverside through database rpc
export async function verifyUserGuess(dropdownItem) {
    // unpack attributes
    const id = dropdownItem.getAttribute("data-id");
    const title = dropdownItem.getAttribute("data-title");
    const composer = dropdownItem.getAttribute("data-composer");
    const songName = dropdownItem.textContent;

    // check user guess in rpc
    const { data, error } = await supabaseClient.rpc("check_guess", {
        song_id_guess: id,
        composer_guess: composer,
        guess_num: guessNum
    });

    // if error occurred, print error and stop function
    if (error) {
        console.log(error);
        return;
    }

    const result = data.result; // holds if guess was correct, partially correct, or not
    const answer = data.answer; // holds daily game answer id if game ended, else null

    // call function to render guess
    renderGuessBlocks(result, songName);

    // render end screen if game end, else go to next guess
    if (answer) {
        if (result === "success") { await winScreen(answer); }
        else { await loseScreen(answer); }
    } else {
        // increment guess num
        setGuessNum(guessNum + 1);
    }
}