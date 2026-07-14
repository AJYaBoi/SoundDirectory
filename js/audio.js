/*
==========================================================
Mewtindew's Sound Directory
Audio Manager
==========================================================
*/


DirectoryApp.audioPlayer = null;



/*
==========================================================
Initialize Audio System
==========================================================
*/

function initializeAudio(){


    document.addEventListener(
        "play",
        handleAudioPlay,
        true
    );


}



/*
==========================================================
Only Allow One Audio Playing
==========================================================
*/

function handleAudioPlay(event){


    const audio =
        event.target;



    if(
        audio.tagName !== "AUDIO"
    ){

        return;

    }



    if(
        DirectoryApp.audioPlayer &&

        DirectoryApp.audioPlayer !== audio

    ){

        DirectoryApp.audioPlayer.pause();

        DirectoryApp.audioPlayer.currentTime = 0;

    }



    DirectoryApp.audioPlayer =
        audio;


}
