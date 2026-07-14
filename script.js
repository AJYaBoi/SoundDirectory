let directory;

fetch("index.json")
.then(r=>r.json())
.then(data=>{

    directory=data;

    buildSidebar();

});

function buildSidebar(){

    const tree=document.getElementById("folderTree");

    tree.innerHTML="";

    Object.keys(directory).forEach(folder=>{

        const div=document.createElement("div");

        div.className="folder";

        div.textContent="📁 "+folder;

        div.onclick=()=>openFolder(folder);

        tree.appendChild(div);

    });

}

function openFolder(folder){

    const data=directory[folder];

    const content=document.getElementById("content");

    content.innerHTML="";

    const title=document.createElement("h2");

    title.textContent=folder;

    content.appendChild(title);

    if(data.info){

        const info=document.createElement("p");

        info.style.marginTop="15px";

        info.style.whiteSpace="pre-wrap";

        info.textContent=data.info;

        content.appendChild(info);

    }

    data.files.forEach(file=>{

        const div=document.createElement("div");

        div.className="file";

        div.innerHTML=`
            <h3>${file.name}</h3>

            <audio controls preload="none">

                <source src="${file.path}">

            </audio>

            <br>

            <a class="download" href="${file.path}" download>

                ⬇ Download

            </a>
        `;

        content.appendChild(div);

    });

}
