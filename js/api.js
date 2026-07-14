/*
==========================================================
Mewtindew's Sound Directory
API / Data Loader
==========================================================
*/


let directoryCache = null;


/*
==========================================================
Load Directory JSON
==========================================================
*/

async function loadDirectory(){

    // Return cached data if already loaded

    if(directoryCache){

        return directoryCache;

    }


    const response = await fetch(
        "index.json"
    );


    if(!response.ok){

        throw new Error(
            `Failed to load index.json (${response.status})`
        );

    }


    const data = await response.json();



    /*
    Basic validation
    */

    if(!data.tree){

        throw new Error(
            "Invalid directory file. Missing tree data."
        );

    }


    if(!data.meta){

        console.warn(
            "Directory metadata missing."
        );

    }



    directoryCache = data;


    return data;

}


/*
==========================================================
Get folder by path
==========================================================
*/

function getFolder(path){

    if(!DirectoryApp.folderMap){

        return null;

    }


    return DirectoryApp.folderMap.get(path) || null;

}


/*
==========================================================
Get root folder
==========================================================
*/

function getRootFolder(){

    return DirectoryApp.data.tree;

}
