/*
==========================================================
Mewtindew's Sound Directory
Content Viewer
==========================================================
*/


/*
==========================================================
Open Folder
==========================================================
*/

function openFolder(path){


    const folder =
        getFolder(path);



    if(!folder){

        console.error(
            "Folder not found:",
            path
        );

        return;

    }



    DirectoryApp.currentFolder =
        folder;



    renderFolderContent(
        folder
    );


    updateTreeSelection();



    if(typeof updateURL === "function"){

        updateURL(
            path
        );

    }

}


/*
==========================================================
Render Folder
==========================================================
*/

function renderFolderContent(folder){


    const breadcrumbs =
        document.getElementById(
            "breadcrumbs"
        );


    const banner =
        document.getElementById(
            "bannerContainer"
        );


    const info =
        document.getElementById(
            "folderInfo"
        );


    const files =
        document.getElementById(
            "fileList"
        );



    breadcrumbs.innerHTML =
        createBreadcrumbs(folder);



    banner.innerHTML = "";



    /*
    Banner
    */

    if(folder.banner){

        const img =
            document.createElement(
                "img"
            );


        img.src =
            folder.banner;


        banner.appendChild(
            img
        );

    }



    /*
    Folder information
    */

    info.innerHTML = `

        <h1>
            ${folder.title || folder.name}
        </h1>


        ${
            folder.info

            ?

            `<p>${folder.info}</p>`

            :

            ""

        }


        <div class="folderStats">

            📁 ${folder.stats.folders} folders

            &nbsp;&nbsp;

            🎵 ${folder.stats.files} sounds

        </div>

    `;



    files.innerHTML = "";



    /*
    Audio files
    */

    folder.children.forEach(child=>{


        if(child.type === "audio"){

            files.appendChild(
                createAudioCard(child)
            );

        }


    });

}


/*
==========================================================
Create Breadcrumbs
==========================================================
*/

function createBreadcrumbs(folder){


    if(
        folder.breadcrumbs.length === 0
    ){

        return "Home";

    }


    let html =
        `<span onclick="openFolder('')">
            Home
        </span>`;


    let current = "";



    folder.breadcrumbs.forEach(part=>{


        current +=
            current
            ? "/" + part
            : part;



        html += `

            /
            
            <span 
                onclick="openFolder('${current}')">

                ${part}

            </span>

        `;


    });


    return html;

}


/*
==========================================================
Create Audio Card
==========================================================
*/

function createAudioCard(audio){


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "audioCard";



    card.innerHTML = `

        <div class="audioTitle">

            🔊 ${audio.displayName || audio.name}

        </div>


        <audio controls preload="none">

            <source src="${audio.path}">

            Your browser does not support audio.

        </audio>


        <div class="folderStats">

            ${audio.extension.toUpperCase()}

            &nbsp;•&nbsp;

            ${audio.sizeText || ""}

        </div>


        <br>


        <a

            class="downloadButton"

            href="${audio.path}"

            download>

            ⬇ Download

        </a>

    `;



    return card;

}


/*
==========================================================
Update Active Tree Item
==========================================================
*/

function updateTreeSelection(){


    document
        .querySelectorAll(".treeItem")
        .forEach(item=>{


            item.classList.remove(
                "active"
            );


            if(
                DirectoryApp.currentFolder &&

                item.dataset.path ===
                DirectoryApp.currentFolder.path

            ){

                item.classList.add(
                    "active"
                );

            }


        });

}
