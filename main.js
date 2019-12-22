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


    //get all coins at home press
    $("#Home").click(() => {
        HomePageDisplay();
        displayAllCoins(allCoinsArray);
    });

    function HomePageDisplay() {
        $(`footer`).html(`<div id="allCoins" class="row bgimg-3"></div>`);
        $(`#headerSpinner`).addClass("loader");
        $(".bgimg-1").css({ "background-image": `url("img/homeHeader.jpg")`, "min-height": "50%" });
        $("#firstParalex").html("<b><u>crypTrack</b></u><br> the crypto database");
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


    /** display all coins */
    function displayAllCoins(Coins) { //run on the array for how many coins we want to draw
        $(`footer`).html(`<div id="allCoins" class="row bgimg-3"></div>`);
        $("#allCoins").empty();
        $(`#headerSpinner`).addClass("loader");
        allCoinsArray = Coins.slice(0, 12); //slice the array for how much coins we want to see
        let i = 0;
        for (const item of Coins) { //can run on allCoinsArray and dont need if and index
            i++;
            if (i <= 12) {
                let el = drawOneCoin(item);
                $("#allCoins").append(el);
                $(`#headerSpinner`).removeClass("loader");
            }
        }
    }
    /** display all coins end */

    // switchEl.find("input").on("change", e => console.log(e.currentTarget.checked))

    /* a single coin draw*/
    function drawOneCoin(item) {
        const str = `
        <div class="coinDiv col-xl-3 col-lg-3 col-md-4 col-sm-12 " >
            <div class=" row">
                <h5 class="card-title col-xl-9 col-lg-9 col-md-9 col-sm-9 col-9">${item.symbol}</h5>
                <label class="switch" >
                    <input type="checkbox" id="switch${item.symbol}" ${item.isChecked ? "checked":""}>
                    <span class="slider round"></span>
                </label>
            </div>
            <hr>
                <p class="card-text">${item.name}</p>
                <p>
                <button class="btn btn-primary getInfo " id="${item.id}" data-toggle="collapse" data-target="#collapse${item.id}" aria-expanded="false" aria-controls="collapse">
                <span id="showSpinner${item.id}"></span>
                        More Info
                    </button>
                <div class="collapse" id="collapse${item.id}">
                   
                </div>
            
        </div>
        `;
        const el = $(str)[0]; //get all the div
        // const checkbox = $(el).find(".switch > input")[0]


        /*chack if switch pressed */
        $(el).find(".switch > input").click(function(e) {
            const checkbox = e.target;
            const isChecked = checkbox.checked;

            if (switchedArray.length == 0) { //אם מערך 0 תכניס את השם למערך
                item.isChecked = checkbox.checked;
                switchedArray.push(item);
                return;
            } else { // אם מערך לא ריק 
                if (switchedArray.length <= 5) {

                    for (let index = 0; index < switchedArray.length; index++) { // כל עוד אינדקס פחות מאורך המערך
                        if (switchedArray[index].symbol === item.symbol) { //בודק האם השם נמצא במערך אם כן מוחק אותו
                            item.isChecked = false;
                            switchedArray.splice(index, 1);
                            return;
                        }
                    }
                    item.isChecked = checkbox.checked;
                    switchedArray.push(item);

                    if (switchedArray.length == 6) {
                        item.isChecked = false;
                        sixCoin = item;
                        switchedArray.splice(switchedArray.length - 1, 1)


                        Modal(sixCoin);
                    }
                }
            }
        });



        function drawOneCoinModal(item) {
            let str =
                `<div class="row">
                <h5 class="card-title col-xl-9 col-lg-9 col-md-9 col-sm-9 col-9">${item.symbol}</h5>
                <label class="switch">
                    <input type="checkbox" ${item.isChecked ? "checked":""}>
                    <span class="slider round"></span>
                </label>
                </div>`
            const el = $(str)[0]; //get all the div
            $(el).find(".switch > input").click(function(e) {
                const checkbox = e.target;
                const isChecked = checkbox.checked;

                if (switchedArray.find(el => el.symbol == item.symbol)) {
                    item.isChecked = false;
                    switchedArray = switchedArray.filter(e => e !== item)
                    if (sixCoin.enterToArr) {
                        sixCoin.enterToArr = false;
                        sixCoin.isChecked = true;
                        switchedArray.push(sixCoin);
                    }
                    return;
                } else {
                    if (switchedArray.length < 5) {
                        item.isChecked = checkbox.checked;
                        switchedArray.push(item);
                    } else {
                        sixCoin = item;
                        sixCoin.enterToArr = checkbox.checked;
                        return sixCoin;
                    }
                }



            })
            return el;
        }



        // מצייר את המודל עם 6 המטבעות שבחרנו השישי לא מסומן כנבחר
        function Modal(sixCoin) {

            let str = `<div class="modal fade" id="myModal" role="dialog">
              <div class="modal-dialog">
              
                <!-- Modal content-->
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">the maximum coins you are allowed is five, please unchecked one and save. or press close to remove the last coin</h4>
                  </div>
                  <div class="coins"></div>
                  <div class="modal-footer">
         
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
                </div>`
            const headerModal = $(str)[0];
            const coinsToDisplay = [...switchedArray, sixCoin] //add the two array to "coinsToDisplay"
            for (const item of coinsToDisplay) {
                const coinEl = drawOneCoinModal(item);
                $(headerModal).find(".coins").append(coinEl)
            }

            $(headerModal).modal().on("hide.bs.modal", e => {
                displayAllCoins(allCoinsArray)
            })
        }




        /*chack if more info pressed */
        $(".getInfo", el).click(function(e) {
            let obj1 = e.currentTarget;
            if (obj1.attributes[4].value == "false") { //only if MoreInfo is closed!
                $(`#showSpinner${item.id}`).addClass('spinner-border spinner-border-sm');
                let islocal = false;
                let market_cap_rank = 0;
                $.grep(MoreInfoArray, function(obj) {
                    if (obj.id === obj1.id) { //if obj is on the arr
                        if (obj.endTime > Date.parse(new Date)) { //if now time is smaller then time in arr+2min
                            islocal = true;
                            displayMoreInfo(obj, islocal); //enter for local
                            return;
                        } else {
                            islocal = "15";
                            return (market_cap_rank = obj.market_cap_rank);
                        }
                    }
                })[0];


                if (islocal == "15") {
                    for (let index = 0; index < MoreInfoArray.length; index++) {
                        if (MoreInfoArray[index].market_cap_rank === Number(market_cap_rank)) {
                            MoreInfoArray.splice(index, 1);
                            getAjaxData(`https://api.coingecko.com/api/v3/coins/${(obj1.id)}`, response => displayMoreInfo(response, islocal));
                            return;
                        }
                    }
                }

                if (!islocal) {
                    getAjaxData(`https://api.coingecko.com/api/v3/coins/${(obj1.id)}`, response => displayMoreInfo(response, islocal));
                }
            } else {
                $(`#${obj1.id}`).text("More Info");
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
        $(`#${obj.id}`).text("Less info");; // לדיב אם רוצים כרקע style="background-image: url(${obj.image.large}); background-repeat: no-repeat";
        // $(`#collapse${obj.id}`).addClass("loader");
        const str = `          
            </div>
            <div class="card-body">
                <h5><u>Current Price:</u></h5>
                <p class="card-info">Dollar: ${obj.market_data.current_price.usd}&dollar;</p>
                <p class="card-info">Euro: ${obj.market_data.current_price.eur}&euro;</p>
                <p class="card-info">NIS: ${obj.market_data.current_price.ils}&#8362;</p>
                <span>
                  <img class="imgCountry" src="${obj.image.large}" >
                </span>                  
            </div>`;
        // $(`#collapse${obj.id}`).removeClass("loader");
        $(`#collapse${obj.id}`).append(str);
        $(`#showSpinner${obj.id}`).removeClass('spinner-border spinner-border-sm');
    }
    /*get More Info end*/


    /*search a coin*/
    //search if enter pressed 
    $("input").keypress(event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#searchCoins").click();
        }
    });

    // if x-clear is pressed go to Home! 
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

        searchCoin = searchCoin.toLowerCase();
        let coinAtList = false;
        if (searchCoin == "") {
            $(`#headerSpinner`).removeClass("loader");
            alert("please enter a Symbol name like: ZOC \n or Name like: 01coin");
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
        $.grep(allCoinsArray, function(obj) {
            if (obj.name === searchCoin) {
                displaySearchCoin(obj);
                $("#firstParalex").text("Found your Coin name");
                $("#secondParalex").text("scroll down");
                coinAtList = true;
                return;
            }
        })[0];
        if (!coinAtList) {
            $(`#headerSpinner`).removeClass("loader");
            alert(`the coin you entered is not on the list \n please enter a correct coin Symbol name like: ZOC \n or Name like: 01coin`);
        }
    });


    function displaySearchCoin(Coin) {
        HomePageDisplay();
        $(`footer`).html(`
        <div id="allCoins" class="row bgimg-3"></div>
        `);
        $("#allCoins").empty();
        // $("#chartContainer").empty().attr("height", "0");

        // $(`#spinner`).addClass("loader");
        let el = drawOneCoin(Coin);
        $(`#headerSpinner`).removeClass("loader");
        // $(`#spinner`).removeClass("loader");
        $("#allCoins").append(el);
    }
    /*search a coin end*/


    //go to about if about press
    $("#About").click(() => {
        $("#allCoins").empty();
        $("#chartContainer").empty();
        $(`#headerSpinner`).addClass("loader");
        $(".bgimg-1").css({ "background-image": `url("img/aboutBobi.jpg")`, "min-height": "100%" });
        $("#firstParalex").html(`welcome to my site yuval isaac....<br>
        infoinfo infoinfoinfo <br> infoinfo infoinfoinfo
       `);
        $(".bgimg-2").css({ "background-image": `url("img/aboutLibi.jpg")`, "min-height": "100%" });
        $("#secondParalex").html(`מה נעשה בפרוייקט...<br>
        infoinfo infoinfo infoinfo infoinfo <br>
        infoinfo infoinfo <br> infoinfo infoinfo`);
        $(`#headerSpinner`).removeClass("loader");
        // $("#allCoins").html(
        //     ` <div>
        //         about me...
        //         </div>`
        // );
    });
});