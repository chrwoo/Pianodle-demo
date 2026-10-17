import { getSupabaseClient } from "./supabase.js";
import { getElements } from "./dom.js";

let playButtonIcon, audioPlayer;
const supabaseClient = getSupabaseClient();

export async function initLoadAudio() {
    // set needed elements from DOM
    ({ playButtonIcon, audioPlayer } = getElements());
    
    await fetchAudio();

    // update play button to show pause or play depending on audio state
    audioPlayer.addEventListener("playing", () => {
        playButtonIcon.src = "assets/images/pause-button.svg";
    });
    audioPlayer.addEventListener("pause", () => {
        playButtonIcon.src = "assets/images/play-button.svg";
    });
    audioPlayer.addEventListener("ended", () => {
        playButtonIcon.src = "assets/images/play-button.svg";
    });
}

async function fetchAudio() {
    // get signed url from supabase edge function
    const { data, error } = await supabaseClient.functions.invoke("get_daily_audio_url");
    
    // handle error
    if (error) {
        const errorMessage = await error.context.json();
        console.log('Error: ', errorMessage.reason);
        return;
    }

    // get url
    const signedAudioUrl = data.signedUrl;

    // fetch audio and save to local url
    try {
        const response = await fetch(signedAudioUrl);
        // check for error
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fetch failed. Status: ${response.status}, Error: ${errorText}`);
        }

        const blob = await response.blob();

        // point audio player to new local url
        audioPlayer.src = URL.createObjectURL(blob);
    } catch (error) {
        console.log("Failed to fetch audio: ", error);
    }
}