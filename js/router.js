/*
==========================================================
Mewtindew's Sound Directory
URL Router
==========================================================
*/


/*
==========================================================
Initialize Router
==========================================================
*/

function initializeRouter(){


    window.addEventListener(

        "hashchange",

        handleRouteChange

    );


}


/*
==========================================================
Handle URL Changes
==========================================================
*/

function handleRouteChange(){


    let path =
        getHashPath();



    if(
        DirectoryApp.folderMap.has(path)
    ){

        openFolder(
            path,
            false
        );

    }

    else{

        openFolder(
            "",
            false
        );

    }

}


/*
==========================================================
Read URL Hash
==========================================================
*/

function getHashPath(){


    if(
        location.hash.length <= 1
    ){

        return "";

    }


    return decodeURIComponent(

        location.hash.substring(1)

    );

}


/*
==========================================================
Update URL
==========================================================
*/

function updateURL(path){


    let newHash = "";


    if(path){

        newHash =
            "#" + encodeURIComponent(path);

    }



    /*
    Avoid unnecessary history entries
    */

    if(
        location.hash !== newHash
    ){

        history.pushState(
            null,
            "",
            newHash
        );

    }

}


/*
==========================================================
Open Folder From URL
==========================================================
*/

function openFromURL(){


    const path =
        getHashPath();



    if(
        DirectoryApp.folderMap.has(path)
    ){

        openFolder(
            path,
            false
        );

    }

    else{

        openFolder(
            "",
            false
        );

    }

}
