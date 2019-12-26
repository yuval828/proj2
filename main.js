/// <reference path="jquery-3.4.1.js" />
"use strict";


let switchedArray = [];

// from about/graph - search - bring to home 
$(() => {
    let allCoinsArray = [];
    let MoreInfoArray = [];
    let sixCoin = "";


    //get all coins at load
    getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayAllCoins(response));


    //see all coins at home press
    $("#Home").click(() => {
        HomePageDisplay();
        displayAllCoins(allCoinsArray);
    });

    //the homepage we will see at refresh, pressing home or pressing X at search or search
    function HomePageDisplay() {
        clearGraph();
        $(`footer`).html(`<div id="allCoins" class="row bgimg-3"></div>`);
        $(`#headerSpinner`).addClass("loader");
        $(".bgimg-1").css({ "background-image": `url("img/homeHeader.jpg")`, "min-height": "50%" });
        $("#firstParalex").html("<b><u>crypTrack</b></u><br> The Crypto Database");
        $(".bgimg-2").css({ "background-image": `url("img/homeHeader.jpg")`, "min-height": "50%" });
        $("#secondParalex").text("");
        $(`#headerSpinner`).removeClass("loader");
    }


    function getAjaxData(url, callback) {
        $.ajax({
            method: "GET",
            url: url,
            error: err => alert("Error: " + err.status),
            success: response => callback(response)
        });
    }


    /* draw all coins */
    function displayAllCoins(Coins) {
        $(`footer`).html(`<div id="allCoins" class="row bgimg-3"></div>`);
        $("#allCoins").empty();
        $(`#headerSpinner`).addClass("loader");
        allCoinsArray = Coins.slice(0, 1000); //slice the array for how many coins we want to see
        for (const item of allCoinsArray) { //run on allCoinsArray
            let el = drawOneCoin(item); //draw one coin
            $("#allCoins").append(el);
            $(`#headerSpinner`).removeClass("loader");
        }
    }


    /* a single coin draw */
    function drawOneCoin(item) {
        const str = `
        <div class="coinDiv col-xl-3 col-lg-3 col-md-4 col-sm-12 " >
            <div class="row">
                <h5 class="card-title col-xl-9 col-lg-9 col-md-9 col-sm-9 col-9">${item.symbol}</h5>
                <label class="switch">
                    <input type="checkbox" id="switch${item.symbol}" ${item.isChecked ? "checked":""}>
                    <span class="slider round"></span>
                </label>
            </div>
            <hr>
            <p class="card-text">${item.name}</p>  
            <button class="btn btn-primary getInfo" id="${item.id}" data-toggle="collapse" data-target="#collapse${item.id}" aria-expanded="false" aria-controls="collapse">
                <span id="showSpinner${item.id}"></span>
                More Info
            </button>
            <div class="collapse" id="collapse${item.id}"></div>            
        </div>
        `;
        const el = $(str)[0]; //get an element from the string


        /* chack if switch pressed on coin */
        $(el).find(".switch > input").click(function(e) {
            const checkbox = e.target;
            const isChecked = checkbox.checked;

            if (switchedArray.length == 0) { //if switchedArray is empty go in, marked as checked and push the coin info 
                item.isChecked = checkbox.checked;
                switchedArray.push(item);
                return;
            } else {
                if (switchedArray.length <= 5) { //if switchedArray is smaller or equel to 5 go in and check if is on the array
                    for (let index = 0; index < switchedArray.length; index++) {
                        if (switchedArray[index].symbol === item.symbol) { //if in the array remove the checked and delete it
                            item.isChecked = false;
                            switchedArray.splice(index, 1);
                            return;
                        }
                    }
                    item.isChecked = checkbox.checked;
                    switchedArray.push(item);

                    if (switchedArray.length == 6) { //if we pressed on the 6 coin, marked as unchecked and remove from switchedArray
                        item.isChecked = false;
                        sixCoin = item;
                        switchedArray.splice(switchedArray.length - 1, 1)
                        Modal(sixCoin); //open the Modal with the sixcoin we pressed
                    }
                }
            }
        });


        /* draw the modal with six coin (the last one is unchecked) */
        function Modal(sixCoin) {
            let str = `
            <div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">The maximum coins you are allowed to choose is 5. please uncheck one and choose another or press close to exit </h4>
                        </div>
                        <div class="coins"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>`
            const headerModal = $(str)[0];
            const coinsToDisplay = [...switchedArray, sixCoin] //add the two array to "coinsToDisplay"
            for (const item of coinsToDisplay) { //draw all six coins at modal
                const coinEl = drawOneCoinModal(item);
                $(headerModal).find(".coins").append(coinEl)
            }

            $(headerModal).modal().on("hide.bs.modal", e => { //when exiting modal display all coins 
                displayAllCoins(allCoinsArray)
            })
        }


        /*draw one coin at the modal */
        function drawOneCoinModal(item) {
            let str =
                `<div class="row">
                <h5 class="card-title col-xl-9 col-lg-9 col-md-9 col-sm-9 col-9">${item.symbol}</h5>
                <label class="switch">
                    <input type="checkbox" ${item.isChecked ? "checked":""}>
                    <span class="slider round"></span>
                </label>
                </div>`
            const el = $(str)[0];

            /*chack if switch pressed on modal*/
            $(el).find(".switch > input").click(function(e) {
                const checkbox = e.target;
                const isChecked = checkbox.checked;

                if (switchedArray.find(el => el.symbol == item.symbol)) { //see if the coin that was pressed is allready on the switchedArray
                    item.isChecked = false;
                    switchedArray = switchedArray.filter(e => e !== item) //if is in remove it
                    if (sixCoin.enterToArr) { //and if enterToArr(sixCoin) is true go in make it false, mark it as checked and push to array
                        sixCoin.enterToArr = false;
                        sixCoin.isChecked = true;
                        switchedArray.push(sixCoin);
                    }
                    return;
                } else {
                    if (switchedArray.length < 5) { //if switchedArray is less then 5,checked the coin push to the array
                        item.isChecked = checkbox.checked;
                        switchedArray.push(item);
                    } else { // if the first coin we press is the sixCoin - marked enterToArr as true
                        sixCoin = item;
                        sixCoin.enterToArr = checkbox.checked;
                        return sixCoin;
                    }
                }
            })
            return el;
        }


        /*chack if more info pressed */
        $(".getInfo", el).click(function(e) {
            let obj1 = e.currentTarget;
            if (obj1.attributes[4].value == "false") { //only if MoreInfo is closed go in
                $(`#showSpinner${item.id}`).addClass('spinner-border spinner-border-sm'); //show spinner at the button
                let islocal = false;
                let market_cap_rank = 0;
                $.grep(MoreInfoArray, function(obj) {
                    if (obj.id === obj1.id) { //if obj is on the arr
                        if (obj.endTime > Date.parse(new Date)) { //if now time is smaller then time in arr + 2min
                            islocal = true;
                            displayMoreInfo(obj, islocal); //enter for local storage
                            return;
                        } else {
                            islocal = "15";
                            return (market_cap_rank = obj.market_cap_rank);
                        }
                    }
                })[0];


                if (islocal == "15") { //chack if the coin info is on the local array if so remove it and get new data
                    for (let index = 0; index < MoreInfoArray.length; index++) {
                        if (MoreInfoArray[index].market_cap_rank === Number(market_cap_rank)) {
                            MoreInfoArray.splice(index, 1);
                            getAjaxData(`https://api.coingecko.com/api/v3/coins/${(obj1.id)}`, response => displayMoreInfo(response, islocal));
                            return;
                        }
                    }
                }

                if (!islocal) { //if its not marked as local get info
                    getAjaxData(`https://api.coingecko.com/api/v3/coins/${(obj1.id)}`, response => displayMoreInfo(response, islocal));
                }
            } else {
                $(`#${obj1.id}`).text("More Info"); //if more info is showing close the info and change the button name
            }
        });
        return el
    }


    /*get More Info for coin - and then store it for 2 min for islocal usage*/
    function displayMoreInfo(obj, islocal) {
        if (islocal == false || islocal == "15") {
            obj.endTime = Date.parse(new Date) + 120000;
            MoreInfoArray.push(obj);
        }

        $(`#collapse${obj.id}`).empty()
        $(`#${obj.id}`).text("Less info");; // when open change button to less info
        const str = `          
            <div class="card-body">
                <h5><u>Current Price:</u></h5>
                <p class="card-info">Dollar: ${obj.market_data.current_price.usd}&dollar;</p>
                <p class="card-info">Euro: ${obj.market_data.current_price.eur}&euro;</p>
                <p class="card-info">NIS: ${obj.market_data.current_price.ils}&#8362;</p>
                <span>
                  <img class="imgCountry" src="${obj.image.large}" >
                </span>                  
            </div>`;

        $(`#collapse${obj.id}`).append(str);
        $(`#showSpinner${obj.id}`).removeClass('spinner-border spinner-border-sm');
    }
    /*get More Info end*/


    /*search a coin*/
    // if enter pressed 
    $("input").keypress(event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#searchCoins").click();
        }
    });

    // if x-clear is pressed go to Home 
    $("input").bind("mouseup", function(e) {
        var $input = $(this),
            oldValue = $input.val();
        if (oldValue == "") return;

        // When this event is fired after clicking on the clear button
        // the value is not cleared yet. We have to wait for it.
        setTimeout(function() {
            var newValue = $input.val();
            if (newValue == "") {
                // capture the clear
                $input.trigger("cleared");
                $("#Home").click();
            }
        }, 1);
    });

    //search if search button pressed 
    $("#searchCoins").click(() => {
        $(`#headerSpinner`).addClass("loader");
        let searchCoin = $("input").val();

        searchCoin = searchCoin.toLowerCase(); //will search without case sensitive
        let coinAtList = false;
        if (searchCoin == "") { //if search is empty
            $(`#headerSpinner`).removeClass("loader");
            alert(`
                please enter a Symbol name like: btc
            `);
            return;
        }

        $.grep(allCoinsArray, function(obj) {
            if (obj.symbol === searchCoin) {
                displaySearchCoin(obj);
                $("#firstParalex").text("Found your Coin symbol");
                $("#secondParalex").text("scroll down");
                coinAtList = true;
                return;
            }
        })[0];

        if (!coinAtList) {
            $(`#headerSpinner`).removeClass("loader");
            alert(`
                The coin you entered is not on the list \n
                please enter a correct Coin Symbol name like: btc
            `);
        }
    });


    function displaySearchCoin(Coin) {
        HomePageDisplay();
        $(`footer`).html(`
            <div id="allCoins" class="row bgimg-3"></div>
        `);
        $("#allCoins").empty();

        let el = drawOneCoin(Coin);
        $(`#headerSpinner`).removeClass("loader");
        $("#allCoins").append(el);
    }
    /*search a coin end*/

    //go to about if about press
    $("#About").click(() => {
        clearGraph();
        $("#allCoins").empty();
        $("#chartContainer").empty();
        $(`footer`).empty();
        $(`#headerSpinner`).addClass("loader");
        $(".bgimg-1").css({ "background-image": `url("img/aboutBobi.jpg")`, "min-height": "100%" });
        $("#firstParalex").html(`
            ברוכים הבאים, שמי יובל יצחק <br>
            בודק תוכנה בחברת השכר מיכפל<br>
            בן 37, נשוי לטל <br>
            גר בגבעתיים <br>
            ומאוד אוהב את הכלבים שלי בובי וליבי
        `);
        $(".bgimg-2").css({ "background-image": `url("img/aboutLibi.jpg")`, "min-height": "100%" });
        $("#secondParalex").html(`
            Full Stack Web Developer <br>
            jQuery-AJAX API Project <br>
        `);
        $(`#headerSpinner`).removeClass("loader");

    });
});