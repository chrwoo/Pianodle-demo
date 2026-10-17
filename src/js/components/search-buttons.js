import { getElements } from '../core/dom.js';
import { guessNum, setGuessNum } from '../main.js';
import { renderGuessBlocks } from "./user-guesses.js";
import { sendGuess } from "./search-song.js";
import { loseScreen } from "./end-screens.js";
import { getSupabaseClient } from '../core/supabase.js';

const supabaseClient = getSupabaseClient();
let skipButton, guessButton, dropdown, searchBar;

export function initSearchButtons() {
    ({ skipButton, guessButton, dropdown, searchBar } = getElements());

    // skip guess button
    skipButton.addEventListener("click", async () => {
        // update guess blocks
        renderGuessBlocks("skip", "Skipped");
        
        // check for loss condition
        if (guessNum >= 6) {
            const { data, error } = await supabaseClient.rpc("check_guess", {
                song_id_guess: null,
                composer_guess: null,
                guess_num: guessNum
            });

            // if error occurred, print error and stop function
            if (error) {
                console.log(error);
                return;
            }

            await loseScreen(data.answer); // show lose screen
        } else {
            // increment guess num
            setGuessNum(guessNum + 1);
        }

    });

    // click guess button
    guessButton.addEventListener("click", async () => {
        // if dropdown has songs
        if (dropdown.hasChildNodes()) {
            // get song at top of the list
            const topChild = dropdown.firstChild;
            // format title for checking
            const topChildTitle = topChild.getAttribute("data-title") + " - " + topChild.getAttribute("data-composer");
            // if search bar is filled correctly
            if (dropdown.children.length === 1 && topChildTitle === searchBar.value) {
                await sendGuess(topChild);
            }
        }
    });
}