/*
==========================================================
Mewtindew's Sound Directory
Search System
==========================================================
*/


let searchBox;
let searchResults;


/*
==========================================================
Initialize Search
==========================================================
*/

function initializeSearch(){


    searchBox =
        document.getElementById(
            "search"
        );


    if(!searchBox){

        console.warn(
            "Search box not found."
        );

        return;

    }



    createSearchResults();



    searchBox.addEventListener(

        "input",

        handleSearchInput

    );


}



/*
==========================================================
Create Results Container
==========================================================
*/

function createSearchResults(){


    searchResults =
        document.createElement(
            "div"
        );


    searchResults.id =
        "searchResults";


    document.body.appendChild(
        searchResults
    );

}



/*
==========================================================
Handle Typing
==========================================================
*/

function handleSearchInput(){


    const query =
        searchBox.value
            .trim()
            .toLowerCase();



    if(query.length < 2){

        clearSearchResults();

        return;

    }



    const results =
        DirectoryApp.data.search.filter(
            item =>

                item.keywords.includes(query)

        )
        .slice(0,50);



    displaySearchResults(
        results
    );

}



/*
==========================================================
Display Results
==========================================================
*/

function displaySearchResults(results){


    clearSearchResults();



    if(results.length === 0){

        searchResults.innerHTML = `

            <div class="searchEmpty">

                No results found

            </div>

        `;

        return;

    }



    results.forEach(result=>{


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "searchResult";



        let icon =
            result.type === "folder"
            ? "📁"
            : "🔊";



        item.innerHTML = `

            <span>
                ${icon}
                ${result.name}
            </span>

            <small>
                ${result.path}
            </small>

        `;



        item.onclick = ()=>{


            if(result.type === "folder"){


                openFolder(
                    result.path
                );


            }

            else{


                openFolder(
                    result.folder
                );


            }



            searchBox.value = "";


            clearSearchResults();


        };



        searchResults.appendChild(
            item
        );


    });


}



/*
==========================================================
Clear Results
==========================================================
*/

function clearSearchResults(){


    if(searchResults){

        searchResults.innerHTML = "";

    }

}
