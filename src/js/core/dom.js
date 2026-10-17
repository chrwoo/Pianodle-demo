let elements = null;

export function initDOMRegistry() {
    elements = {
        dropdown: document.getElementById("dropdown"),
        searchBar: document.getElementById("search-bar"),
        endScreen: document.getElementById("end-screen"),
        endScreenText: document.getElementById("end-screen-text"),
        endScreenTitle: document.getElementById("end-screen-title"),
        endScreenAnswerTitle: document.getElementById("end-screen-answer-title"),
        endScreenAnswerOther: document.getElementById("end-screen-answer-other"),
        endScreenGuessNum: document.getElementById("end-screen-guess-num"),
        youtubeButton: document.getElementById("youtube-button"),
        closeButton: document.getElementById("close-end-screen-button"),
        skipButton: document.getElementById("skip-button"),
        guessButton: document.getElementById("guess-button"),
        clearSearchButton: document.getElementById("clear-search-button"),
        guessContainer: document.getElementById("guess-container"),
        audioPlayer: document.getElementById("audio-player"),
        playButton: document.getElementById("play-button"),
        progressBar: document.getElementById("progress-bar"),
        playButtonIcon: document.getElementById("play-button-icon"),
    };
}

export function getElements() {
    if (!elements) {return null;}
    return elements;
}