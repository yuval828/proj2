/// <reference path="jquery-3.4.1.js" />
"use strict";


// from about/graph - search - bring to home 
$(() => {

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
        $(`footer`).html(`
        <div id="chartContainer" style="height: 100%; width: 100%;"></div>
        `);
        getAjaxData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${switchedArray[0]},BTC&tsyms=USD`, response => drawGraph(response));
    });

    function getAjaxData(url, callback) {
        $.ajax({
            method: "GET",
            url: url,
            error: err => alert("Error: " + err.status),
            success: response => callback(response)
        });
    }

    function drawGraph(allCoins) { //{"ETH":{"USD":144.3},"BTC":{"USD":7273.66}}
        // let allCoinsObj = allCoins;
        let priceCoinArr = [];
        for (const coin in allCoins) { //coin = ETH
            { //price = USD
                // let coinName = `${coin}`;

                let EEE = parseFloat(allCoins[coin].USD);
                // EEE = parseFloat(allCoins.coinName.USD);
                // EEE = Number("allCoins.coin.USD");

                priceCoinArr.push(EEE);

            }
        }


        var dataPoints = [];
        var chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: `${allCoins[coin]},${allCoins[coin]} to USD`
            },
            data: [{
                type: "spline",
                dataPoints: dataPoints
            }]
        });

        chart.render();

        // var yVal = 15,
        let updateCount = 0;
        var updateChart = function() {
            for (let index = 0; index < priceCoinArr.length; index++) {

                dataPoints.push({
                    y: `${priceCoinArr[index]}`
                });
            }

            // yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
            updateCount++;



            chart.options.title.text = "Update " + updateCount;
            chart.render();

        };

        // update chart every second
        setInterval(function() { updateChart() }, 20000);
    }
















    // var options = {
    //     exportEnabled: true,
    //     animationEnabled: true,
    //     title: {
    //         text: `${priceCoin[0]},${priceCoin[1]} to USD`
    //     },
    //     // subtitles: [{
    //     //     text: "Click Legend to Hide or Unhide Data Series"
    //     // }],
    //     axisX: {
    //         title: "time every 2 second"
    //     },
    //     axisY: {
    //         title: "Coin Value",
    //         titleFontColor: "#4F81BC",
    //         lineColor: "#4F81BC",
    //         labelFontColor: "#4F81BC",
    //         tickColor: "#4F81BC",
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
    //             name: "ETH",
    //             showInLegend: true,
    //             xValueFormatString: "mm ss",
    //             yValueFormatString: "$#,##0.#",
    //             dataPoints: [
    //                 { x: new Date().getSeconds(), y: `${priceCoin.ETH.USD}` },

    //             ]
    //         },
    //         {
    //             type: "spline",
    //             name: "BTC",
    //             // axisYType: "secondary",
    //             showInLegend: true,
    //             xValueFormatString: "mm ss",
    //             yValueFormatString: "$#,##0.#",
    //             dataPoints: [
    //                 { x: new Date().getSeconds(), y: `${priceCoin.BTC.USD}` },

    //             ]
    //         },
    //         {
    //             type: "spline",
    //             name: "else",
    //             // axisYType: "secondary",
    //             showInLegend: true,
    //             xValueFormatString: "mm ss",
    //             yValueFormatString: "$#,##0.#",
    //             dataPoints: [
    //                 { x: new Date().getSeconds(), y: 150 },

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
    // // הוספה של נקודות רנדומלית
    // $("#addDataPoint").click(function() {
    //     var chart = $("#chartContainer").CanvasJSChart();
    //     var length = chart.options.data[0].dataPoints.length;
    //     chart.options.data[0].dataPoints.push({ x: (length + 1) * 10, y: Math.round((30 - Math.random() * 10)) });
    //     chart.render();
    // });
});