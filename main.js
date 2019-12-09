/// <reference path="jquery-3.4.1.js" />
"use strict";

$(() => {
    let allCoinsArray = [];
    let MoreInfoArray = [];


    getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayAllCoins(response));



    $("#Home").click(() => {
        $("#allCoins").empty();
        $("#firstParalex").text("Coins R` us...");
        getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayAllCoins(response));
    });

    $("#LiveReports").click(() => {
        $("#allCoins").empty();
        $("#firstParalex").text(`
        come see the graph....
        `);
        // $("#allCoins").empty();
        // $("#allCoins").html(`
        // <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        // <script src="https://canvasjs.com/assets/script/jquery-1.11.1.min.js"></script>
        // <script src="https://canvasjs.com/assets/script/jquery.canvasjs.min.js"></script>`)
        // getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayAllCoins(response));
    });

    $("#About").click(() => {
        $("#allCoins").empty();
        // $(".bgimg-2").attr("background-image", "images.jpg");
        //style="background-image: url(images.jpg); background-repeat: no-repeat"
        $("#firstParalex").text(`
        welcome to my site....
        `);

        $("#allCoins").html(
            ` <div>
                about me...
                </div>`
        );
    });

    function getAjaxData(url, callback) {
        $.ajax({
            method: "GET",
            url: url,
            error: err => alert("Error: " + err.status),
            success: response => callback(response)
        });
    }



    function displayAllCoins(Coins) { //run on the array for how many coins we want to draw
        $("#allCoins").empty();
        $(`#spinner`).addClass("loader");
        allCoinsArray = Coins.slice(0, 12); //slice the array for how much coins we want to see
        let i = 0;
        for (const item of Coins) { //can run on allCoinsArray and dont need if and index
            i++;
            if (i <= 12) {
                let el = drawOneCoin(item);
                $(`#spinner`).removeClass("loader");
                $("#allCoins").append(el);
                // var coinsArr = arr.push(item); 
            } //else return coinsArr;
        }
    }


    /** new simple switch????
     * <!-- Default switch -->
    <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="customSwitches">
      <label class="custom-control-label" for="customSwitches"></label>
    </div>
     */


    function drawOneCoin(item) { //a single coin draw
        const str = `
        <div class="coinDiv col-xl-4 col-lg-4 col-md-4 col-sm-12 " >
            <div class="card-body row">
                <h5 class="card-title col-xl-8 col-lg-8 col-md-8 col-sm-8 col-7">${item.symbol}</h5>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
            <hr>
                <p class="card-text">${item.name}</p>
                <p>
                <button class="btn btn-primary getInfo has-spinner " id="${item.id}" data-toggle="collapse" data-target="#collapse${item.id}" aria-expanded="false" aria-controls="collapse">
                <span class="spinner"><i class="fa fa-refresh fa-spin"></i></span>
                        More Info
                    </button>
                <div class="collapse" id="collapse${item.id}">
                   
                </div>
            
        </div>
        `;

        const el = $(str)[0]; //get all the div

        $(".getInfo", el).click(function(e) {
            let obj1 = e.currentTarget;
            if (obj1.attributes[4].value == "false") { //MoreInfo is closed!

                /* spinner for button */
                // $(`#${this.id}`).toggleClass('active');
                // $(`#${this.id}`).toggleClass('active');

                let Local = false;

                // setInterval(() => {
                let i = 0;
                $.grep(MoreInfoArray, function(obj) {

                    if (obj.id === obj1.id) {
                        Local = true;
                        if (obj.endTime > Date.parse(new Date)) {
                            displayMoreInfo(obj, Local);
                        } else {
                            if (MoreInfoArray[i].market_cap_rank === Number(obj.market_cap_rank)) {
                                MoreInfoArray.splice(i, 1);
                                Local = false;
                                return;
                            }
                        }
                    }
                    ++i;
                    return;
                })[0];
                // }, 20000);



                if (!Local) {
                    // for (const obj of MoreInfoArray) {
                    //     for(obj.id in MoreInfoArray){
                    //     displayMoreInfo(obj);
                    //     return;
                    // }

                    getAjaxData(`https://api.coingecko.com/api/v3/coins/${(obj1.id)}`, response => displayMoreInfo(response, Local));
                }
            }
        });
        return el
    }


    // spinner for button+to activate spiner on button
    // $(function() {
    //     $('.getInfo').click(function() {
    //         $(this).toggleClass('active');
    //         setTimeout(() => {
    //             alert("HI")
    //             $(this).toggleClass('active');
    //         }, 2000);


    //     });
    // });

    //get More Info for coin - and then store it for 2 min for local usage
    function displayMoreInfo(obj, Local) {
        if (!Local) {
            obj.endTime = Date.parse(new Date) + 120000;
            MoreInfoArray.push(obj);
        }


        $(`#collapse${obj.id}`).empty(); // לדיב אם רוצים כרקע style="background-image: url(${obj.image.large}); background-repeat: no-repeat";
        $(`#collapse${obj.id}`).addClass("loader");
        const str = `          
            </div>
            <div class="card-body">
                <h5><u>Current Price:</u></h5>
                <p class="card-title">Dollar: ${obj.market_data.current_price.usd}&dollar;</p>
                <p class="card-title">Euro: ${obj.market_data.current_price.eur}&euro;</p>
                <p class="card-title">NIS: ${obj.market_data.current_price.ils}&#8362;</p>
                <span>
                  <img class="imgCountry" src="${obj.image.large}" >
                </span>                  
            </div>`;
        $(`#collapse${obj.id}`).removeClass("loader");
        $(`#collapse${obj.id}`).append(str);
    }


    //search a coin
    $("#searchCoins").click(() => {
        let searchCoin = $("input").val();
        if (searchCoin == "") {
            alert("please enter a Symbol name: like BTC or Name: like bitcoin");
            return;
        }
        $.grep(allCoinsArray, function(obj) {
            if (obj.symbol === searchCoin) {
                displaySearchCoin(obj);
            }
            return;
        })[0];
        $.grep(allCoinsArray, function(obj) {
            if (obj.name === searchCoin) {
                displaySearchCoin(obj);
            }
            return;
        })[0];
        // alert(`you didnt enter a correct coin please enter a Symbol name: like BTC or Name: like bitcoin`);

    });


    function displaySearchCoin(Coin) {
        $("#allCoins").empty();
        $(`#spinner`).addClass("loader");
        let el = drawOneCoin(Coin);
        $(`#spinner`).removeClass("loader");
        $("#allCoins").append(el);
    }


    // $("div").click(function(e) {
    //     let obj1 = e.target.closest(".getInfo");
    //     $.grep(MoreInfoArray, function(obj) {
    //         if (obj.id === obj1.id) {

    //             displayMoreInfo(obj1);
    //         }
    //         return;
    //     })[0];
    //     // for (const obj of MoreInfoArray) {
    //     //     for(obj.id in MoreInfoArray){
    //     //     displayMoreInfo(obj);
    //     //     return;
    //     // }

    //     getAjaxData(`https://api.coingecko.com/api/v3/coins/${(obj1.id)}`, response => displayMoreInfo(response));

    // });



    // //LiveReports graph


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




});