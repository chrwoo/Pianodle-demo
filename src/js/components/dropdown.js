import { getElements } from "../core/dom.js";
import { songsGuessed } from "./search-song.js";

let dropdown, searchBar;

export function initDropdown() {
    ({ dropdown, searchBar } = getElements());

    // close dropdown when clicked outside of search bar
    document.addEventListener("click", (event) => {
        if (!(searchBar.contains(event.target) || dropdown.contains(event.target))) {
            dropdown.style.display = "none";
        }
    });

    // open dropdown when clicked search bar
    searchBar.addEventListener("focus", () => {
        if (dropdown.hasChildNodes()) {
            dropdown.style.display = "block";
        }
    });

    // don't blur search bar when clicking dropdown
    dropdown.addEventListener("mousedown", (event) => {
        event.preventDefault();
    });
}

export function clearDropdown() {
    dropdown.innerHTML = '';
    dropdown.style.display = "None";
}

export function renderDropdown(songData) {
    // start with a blank dropdown
    clearDropdown();

    // stop function if there are no found songs
    if (!songData || songData.length === 0) {return}

    for (const song of songData) {
        // skip rendering for songs already guessed
        if (songsGuessed.has(song["id"])) {continue;}
        // create button for song
        const dropdownItem = document.createElement("button");

        dropdownItem.type = "button";
        dropdownItem.className = "dropdown-item";
        dropdownItem.textContent = `${song["title"]} - ${song["composer"]}`;
        // attributes for guess checking
        dropdownItem.setAttribute("data-id", song["id"]);
        dropdownItem.setAttribute("data-title", song["title"]);
        dropdownItem.setAttribute("data-composer", song["composer"]);

        // on click functionality
        dropdownItem.addEventListener("click", (event) => {
            // automatically put search in search bar
            searchBar.value = event.currentTarget.textContent;

            // rerender dropdown
            const singleSongData = [song];
            renderDropdown(singleSongData);
        });
        
        // add item to dropdown
        dropdown.appendChild(dropdownItem);
    }
    // make dropdown visible again if has items
    if (dropdown.hasChildNodes()) {
        dropdown.style.display = "block";
    }
}