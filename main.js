/// <reference path="jquery-3.4.1.js" />
"use strict";


// from about/graph - search - bring to home 
$(() => {
    let allCoinsArray = [];
    let MoreInfoArray = [];

    //get all coins at load
    getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayAllCoins(response));


    //get all coins at home press
    $("#Home").click(() => {
        HomePageDisplay();
        getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayAllCoins(response));
    });

    function HomePageDisplay() {
        $("#allCoins").empty();
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
        $("#allCoins").empty();
        $(`#headerSpinner`).addClass("loader");
        allCoinsArray = Coins.slice(0, 500); //slice the array for how much coins we want to see
        let i = 0;
        for (const item of Coins) { //can run on allCoinsArray and dont need if and index
            i++;
            if (i <= 500) {
                let el = drawOneCoin(item);
                $("#allCoins").append(el);
                $(`#headerSpinner`).removeClass("loader");
            }
        }
    }
    /** display all coins end */

    /** new simple bootstrap switch???? to change?
     * 
     * <!-- Default switch -->
    <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="customSwitches">
      <label class="custom-control-label" for="customSwitches"></label>
    </div>
     */


    /* a single coin draw*/
    function drawOneCoin(item) {
        const str = `
        <div class="coinDiv col-xl-3 col-lg-3 col-md-4 col-sm-12 " >
            <div class=" row">
                <h5 class="card-title col-xl-9 col-lg-9 col-md-9 col-sm-9 col-9">${item.symbol}</h5>
                <label class="switch">
                    <input type="checkbox">
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
            alert("please enter a Symbol name: like BTC or Name: like bitcoin");
            return;
        }
        $.grep(allCoinsArray, function(obj) {
            if (obj.symbol === searchCoin) {
                displaySearchCoin(obj);
                $("#firstParalex").text("Found your Coin symbol, scroll down");
                coinAtList = true;
                return;
            }
        })[0];
        $.grep(allCoinsArray, function(obj) {
            if (obj.name === searchCoin) {
                displaySearchCoin(obj);
                $("#firstParalex").text("Found your Coin name, scroll down");
                coinAtList = true;
                return;
            }
        })[0];
        if (!coinAtList) {
            $(`#headerSpinner`).removeClass("loader");
            alert(`you didnt enter a correct coin please enter a Symbol name: like BTC or Name: like bitcoin`);
        }
    });


    function displaySearchCoin(Coin) {
        HomePageDisplay();
        $("#allCoins").empty();
        // $(`#spinner`).addClass("loader");
        let el = drawOneCoin(Coin);
        $(`#headerSpinner`).removeClass("loader");
        // $(`#spinner`).removeClass("loader");
        $("#allCoins").append(el);
    }
    /*search a coin end*/


    /*LiveReports graph*/
    $("#LiveReports").click(() => {
        $("#allCoins").empty();
        $(`#headerSpinner`).addClass("loader");
        $(".bgimg-1").css({ "background-image": `url("img/LiveReports.jpg")`, "min-height": "50%" });
        $("#firstParalex").text(`
        come see the graph....
        `);
        $(".bgimg-2").css({ "background-image": `url("img/LiveReports.jpg")`, "min-height": "50%" });
        $("#secondParalex").text(`
        your graph....
        `);
        $(`#headerSpinner`).removeClass("loader");

        // $("#allCoins").html(`
        // <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        // <script src="https://canvasjs.com/assets/script/jquery-1.11.1.min.js"></script>
        // <script src="https://canvasjs.com/assets/script/jquery.canvasjs.min.js"></script>`)
        // getAjaxData("https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD", response => displayAllCoins(response));
    });

    // var options = {
    //     exportEnabled: true,
    //     animationEnabled: true,
    //     title: {
    //         text: "Units Sold VS Profit"
    //     },
    //     subtitles: [{
    //         text: "Click Legend to Hide or Unhide Data Series"
    //     }],
    //     axisX: {
    //         title: "States"
    //     },
    //     axisY: {
    //         title: "Units Sold",
    //         titleFontColor: "#4F81BC",
    //         lineColor: "#4F81BC",
    //         labelFontColor: "#4F81BC",
    //         tickColor: "#4F81BC",
    //         includeZero: false
    //     },
    //     axisY2: {
    //         title: "Profit in USD",
    //         titleFontColor: "#C0504E",
    //         lineColor: "#C0504E",
    //         labelFontColor: "#C0504E",
    //         tickColor: "#C0504E",
    //         includeZero: false
    //     },
    //     toolTip: {
    //         shared: true
    //     },
    //     legend: {
    //         cursor: "pointer",
    //         itemclick: toggleDataSeries
    //     },
    //     data: [{
    //             type: "spline",
    //             name: "Units Sold",
    //             showInLegend: true,
    //             xValueFormatString: "MMM YYYY",
    //             yValueFormatString: "#,##0 Units",
    //             dataPoints: [
    //                 { x: new Date(2016, 0, 1), y: 120 },
    //                 { x: new Date(2016, 1, 1), y: 135 },
    //                 { x: new Date(2016, 2, 1), y: 144 },
    //                 { x: new Date(2016, 3, 1), y: 103 },
    //                 { x: new Date(2016, 4, 1), y: 93 },
    //                 { x: new Date(2016, 5, 1), y: 129 },
    //                 { x: new Date(2016, 6, 1), y: 143 },
    //                 { x: new Date(2016, 7, 1), y: 156 },
    //                 { x: new Date(2016, 8, 1), y: 122 },
    //                 { x: new Date(2016, 9, 1), y: 106 },
    //                 { x: new Date(2016, 10, 1), y: 137 },
    //                 { x: new Date(2016, 11, 1), y: 142 }
    //             ]
    //         },
    //         {
    //             type: "spline",
    //             name: "Profit",
    //             axisYType: "secondary",
    //             showInLegend: true,
    //             xValueFormatString: "MMM YYYY",
    //             yValueFormatString: "$#,##0.#",
    //             dataPoints: [
    //                 { x: new Date(2016, 0, 1), y: 19034.5 },
    //                 { x: new Date(2016, 1, 1), y: 20015 },
    //                 { x: new Date(2016, 2, 1), y: 27342 },
    //                 { x: new Date(2016, 3, 1), y: 20088 },
    //                 { x: new Date(2016, 4, 1), y: 20234 },
    //                 { x: new Date(2016, 5, 1), y: 29034 },
    //                 { x: new Date(2016, 6, 1), y: 30487 },
    //                 { x: new Date(2016, 7, 1), y: 32523 },
    //                 { x: new Date(2016, 8, 1), y: 20234 },
    //                 { x: new Date(2016, 9, 1), y: 27234 },
    //                 { x: new Date(2016, 10, 1), y: 33548 },
    //                 { x: new Date(2016, 11, 1), y: 32534 }
    //             ]
    //         }
    //     ]
    // };
    // $("#chartContainer").CanvasJSChart(options);

    // function toggleDataSeries(e) {
    //     if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    //         e.dataSeries.visible = false;
    //     } else {
    //         e.dataSeries.visible = true;
    //     }
    //     e.chart.render();
    // }



    //go to about if about press
    $("#About").click(() => {
        $("#allCoins").empty();
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