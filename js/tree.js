/*
==========================================================
Mewtindew's Sound Directory
Folder Tree Renderer
==========================================================
*/


const expandedFolders = new Set();


/*
==========================================================
Build Tree
==========================================================
*/

function buildTree(){

    const container = document.getElementById(
        "tree"
    );


    container.innerHTML = "";


    const root = DirectoryApp.data.tree;


    root.children.forEach(child=>{

        if(child.type === "folder"){

            renderFolder(
                child,
                container,
                0
            );

        }

    });

}


/*
==========================================================
Render Folder
==========================================================
*/

function renderFolder(folder, parent, depth){


    const wrapper = document.createElement(
        "div"
    );


    const row = document.createElement(
        "div"
    );


    row.className = "treeItem";


    row.dataset.path = folder.path;


    row.style.paddingLeft =
        `${depth * 18 + 10}px`;



    /*
    Arrow
    */

    const arrow = document.createElement(
        "span"
    );


    arrow.className = "arrow";



    const hasFolders = folder.children.some(
        child => child.type === "folder"
    );


    if(hasFolders){

        arrow.textContent =
            expandedFolders.has(folder.path)
            ? "▼"
            : "▶";

    }
    else{

        arrow.textContent = "";

    }



    /*
    Icon
    */

    const icon = document.createElement(
        "span"
    );


    if(folder.settings && folder.settings.icon){

        icon.textContent =
            folder.settings.icon;

    }

    else if(folder.icon){

        icon.innerHTML =
            `<img src="${folder.icon}" width="18">`;

    }

    else{

        icon.textContent =
            "📁";

    }



    /*
    Name
    */

    const name = document.createElement(
        "span"
    );


    name.textContent =
        folder.title || folder.name;



    row.appendChild(arrow);

    row.appendChild(icon);

    row.appendChild(name);



    wrapper.appendChild(row);



    parent.appendChild(wrapper);



    /*
    Expand arrow click
    */

    arrow.onclick = (event)=>{

        event.stopPropagation();


        toggleFolder(
            folder,
            wrapper,
            depth
        );

    };



    /*
    Folder click
    */

    row.onclick = ()=>{

        openFolder(
            folder.path
        );

    };



    /*
    Active folder check
    */

    if(
        DirectoryApp.currentFolder &&
        DirectoryApp.currentFolder.path === folder.path
    ){

        row.classList.add(
            "active"
        );

    }


    /*
    Restore expanded folders
    */

    if(
        expandedFolders.has(folder.path)
    ){

        createChildren(
            folder,
            wrapper,
            depth
        );

    }

}


/*
==========================================================
Toggle Folder
==========================================================
*/

function toggleFolder(
    folder,
    wrapper,
    depth
){


    if(
        expandedFolders.has(folder.path)
    ){

        expandedFolders.delete(
            folder.path
        );


        const children =
            wrapper.querySelector(
                ".children"
            );


        if(children){

            children.remove();

        }

    }

    else{

        expandedFolders.add(
            folder.path
        );


        createChildren(
            folder,
            wrapper,
            depth
        );

    }


    buildTree();

}


/*
==========================================================
Create Children
==========================================================
*/

function createChildren(
    folder,
    wrapper,
    depth
){


    const childrenContainer =
        document.createElement(
            "div"
        );


    childrenContainer.className =
        "children";



    folder.children.forEach(child=>{

        if(child.type === "folder"){

            renderFolder(
                child,
                childrenContainer,
                depth + 1
            );

        }

    });



    wrapper.appendChild(
        childrenContainer
    );

}
