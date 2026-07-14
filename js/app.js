/*
==========================================================
Mewtindew's Sound Directory
Application Entry Point
==========================================================
*/

window.DirectoryApp = {

    data: null,

    folderMap: new Map(),

    currentFolder: null

};


/*
==========================================================
Build folder lookup table
==========================================================
*/

function buildFolderMap(node){

    if(node.type !== "folder")
        return;

    DirectoryApp.folderMap.set(node.path, node);

    node.children.forEach(child=>{

        if(child.type === "folder"){

            buildFolderMap(child);

        }

    });

}


/*
==========================================================
Initialize application
==========================================================
*/

async function initializeApplication(){

    try{

        const data = await loadDirectory();

        DirectoryApp.data = data;

        buildFolderMap(data.tree);

        initializeRouter();

        initializeSearch();

        initializeAudio();

        buildTree();

        let startFolder = "";

        if(location.hash.length > 1){

            startFolder = decodeURIComponent(
                location.hash.substring(1)
            );

        }

        if(!DirectoryApp.folderMap.has(startFolder)){

            startFolder = "";

        }

        openFolder(startFolder, false);

    }

    catch(error){

        console.error(error);

        document.getElementById("viewer").innerHTML = `

            <div style="padding:40px">

                <h2>Unable to load directory.</h2>

                <br>

                <p>${error}</p>

            </div>

        `;

    }

}


/*
==========================================================
Page Loaded
==========================================================
*/

window.addEventListener(

    "DOMContentLoaded",

    initializeApplication

);
