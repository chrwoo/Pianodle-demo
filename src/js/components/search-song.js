import { getSupabaseClient } from '../core/supabase.js'
import { getElements } from '../core/dom.js';
import { renderDropdown, clearDropdown } from './dropdown.js'
import { verifyUserGuess } from './user-guesses.js'

const supabaseClient = getSupabaseClient();
let searchBar, dropdown, clearSearchButton;
// dropdown search delay time ms
const DELAY = 300;
// track which songs have been guessed using uuid
export const songsGuessed = new Set();

// queries database to look for songs
async function songSearch(input) {
    // split input into array of words
    const separatedInputArray = input.trim().replaceAll(/[-,]+/g, " ").split(/\s+/);

    // base query
    let supabaseQuery = supabaseClient.from("songs").select("id, title, composer");

    // make a query that searches for rows that have each word in either the title or composer column
    for (const word of separatedInputArray) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${word}%, composer.ilike.%${word}%`);
    }

    // limit rows
    supabaseQuery.limit(10);

    // search database
    const { data, error } = await supabaseQuery;
    
    // check for error and return empty array if error found
    if (error) {
        console.log(error);
        return [];
    }

    return data;
}

// helper function to delay database searches
function debounce(func, delay) {
    let timeout;

    // wrap func with delay
    return function(...inputText) {
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            func.apply(this, inputText);
        }, delay);
    }
}

// calls search and dropdown functions
async function executeSearch(text) {
    // cancel function if search bar is empty and clear dropdown if it is
    if (!text.trim()) {
        clearDropdown()
        return;
    }
    
    // run search
    const songData = await songSearch(text);
    
    renderDropdown(songData);
}

// function that calls everything needed when sending a guess
export async function sendGuess(topChild) {
    // clear search bar and dropdown
    searchBar.value = "";
    clearSearchButton.style.display = "none";
    clearDropdown();
    // add song to songsGuessed
    songsGuessed.add(topChild.getAttribute("data-id"));
    // send guess for checking
    await verifyUserGuess(topChild);
}

export function initSearchSong() {
    ({ searchBar, dropdown, clearSearchButton } = getElements());

    // add debounce to search
    const debounceSearch = debounce((event) => {
        executeSearch(event.target.value);
    }, DELAY);

    // call debounce search when user inputs
    searchBar.addEventListener("input", debounceSearch);
    
    // track enter key for song submission
    // if dropdown is open, autofill top song to search bar
    searchBar.addEventListener("keydown", async function(event) {
        if (event.key === "Enter") {
            // cancel function if bar is empty or input is repeating
            if (searchBar.value === "" || event.repeat) {return;}

            // if dropdown has songs
            if (dropdown.hasChildNodes()) {
                // get song at top of the list
                const topChild = dropdown.firstChild;
                
                // if search bar is filled correctly and dropdown closed, send guess
                if (dropdown.children.length === 1 && dropdown.style.display === "none") {
                    await sendGuess(topChild);

                } else if (dropdown.style.display != "none") { // if dropdown still open
                    // autofill search bar
                    searchBar.value = dropdown.firstChild.textContent;
                    // build songData object
                    const songData = [{
                        "id": topChild.getAttribute("data-id"),
                        "title": topChild.getAttribute("data-title"),
                        "composer": topChild.getAttribute("data-composer")
                    }];
                    renderDropdown(songData);
                    dropdown.style.display = "none";
                }
            }
        }
    });

    // listener for clearing search bar button
    clearSearchButton.addEventListener("click", () => {
        searchBar.value = "";
        clearSearchButton.style.display = "none";
        clearDropdown();
    });
    // listener for making search bar button appear and disappear
    searchBar.addEventListener("input", () => {
        if (searchBar.value != "") {
            clearSearchButton.style.display = "inline";
        } else {
            clearSearchButton.style.display = "none";
        }
    });
}
