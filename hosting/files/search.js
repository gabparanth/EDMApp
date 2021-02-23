var products = function userAction() {
    let searchString = document.getElementById("myInput").value;
    let txt = "";
    console.log(searchString);

    // Replace the webhook_url below with your own!!! 
    let webhook_url = "https://webhooks.mongodb-realm.com/api/client/v2.0/app/ecom-xwqkg/service/fullTextSearch/incoming_webhook/getProductFromSearch";
    let url = webhook_url + "?arg=" + searchString;

    fetch(url).then(function (response) {
        if (!response.ok) {
            console.log(`there is an error... Status: ${response.status}`);
            throw Error(response.statusText);
        }
        console.log(response);
        return response.json();
    }).then(function (products) {
        if (products["$undefined"] === true) {
            console.log('NO FETCH RESULT');
        } else {
            if (products.length !== 0) {
                console.log("Fetched array has " + products.length + " entries");
                autocomplete(document.getElementById("myInput"), products);
                // txt = buildMovieList(products);
            } else {
                // console.log("Fetched array has " + movieJSON.length + " entries");
                txt += `<br><br><br><b><h3>Sadly you have no search results. Try checking your spelling or changing your search terms.</h3></b>`;
            }
        }

    });

};

function autocomplete(inp) {


    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    var arr = [];
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);



        /**
         * get data from mdb 
         */

        let searchString = document.getElementById("myInput").value;
        let txt = "";
        console.log(searchString);

        // Replace the webhook_url below with your own!!! 
        let webhook_url = "https://webhooks.mongodb-realm.com/api/client/v2.0/app/ecom-xwqkg/service/fullTextSearch/incoming_webhook/getProductFromSearch";
        let url = webhook_url + "?arg=" + searchString;

        fetch(url).then(function (response) {
            if (!response.ok) {
                console.log(`there is an error... Status: ${response.status}`);
                throw Error(response.statusText);
            }
            console.log(response);
            return response.json();
        }).then(function (products) {
            if (products["$undefined"] === true) {
                console.log('NO FETCH RESULT');
            } else {
                if (products.length !== 0) {
                    // console.log("Fetched array has " + products.length + " entries");
                    arr = products;
                } else {
                    // console.log("Fetched array has " + movieJSON.length + " entries");
                    txt += `<br><br><br><b><h3>Sadly you have no search results. Try checking your spelling or changing your search terms.</h3></b>`;
                }
            }

        });

        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            console.log(arr[i].sku);
            b = document.createElement("DIV");
            // b.innerHTML = arr[i].name;

            // b.innerHTML += "<input type='hidden' value='" + parseFloat(arr[i].sku.$numberInt) + "'>";


            href = document.createElement("a");
            href.setAttribute("href", "products-details.html?sku=" + parseFloat(arr[i].sku.$numberInt));
            href.innerHTML = arr[i].name;
            b.appendChild(href);


            a.appendChild(b);


        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}


var array = [{ name: "iphone S" }, { name: "iphone XS" }, { name: "galaxy S+" }]
autocomplete(document.getElementById("myInput"), array);


function test() {
    return autocomplete(document.getElementById("myInput"), array);
}

