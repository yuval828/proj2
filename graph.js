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
        <div id="chartContainer" style="height: 370px; width: 100%;"></div>
        `);
        getAjaxData("https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD", response => drawGraph(response));
    });

    function getAjaxData(url, callback) {
        $.ajax({
            method: "GET",
            url: url,
            error: err => alert("Error: " + err.status),
            success: response => callback(response)
        });
    }

    function drawGraph(price) {
        let priceCoin = price;

        var options = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: `${priceCoin[0]},${priceCoin[1]} to USD`
            },
            subtitles: [{
                text: "Click Legend to Hide or Unhide Data Series"
            }],
            axisX: {
                title: "time every 2 second"
            },
            axisY: {
                title: "Coin Value",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
                includeZero: false
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                    type: "spline",
                    name: "ETH",
                    showInLegend: true,
                    xValueFormatString: "mm ss",
                    yValueFormatString: "$#,##0.#",
                    dataPoints: [
                        { x: new Date().getSeconds(), y: `${priceCoin.ETH.USD}` },

                    ]
                },
                {
                    type: "spline",
                    name: "BTC",
                    axisYType: "secondary",
                    showInLegend: true,
                    xValueFormatString: "mm ss",
                    yValueFormatString: "$#,##0.#",
                    dataPoints: [
                        { x: new Date().getSeconds(), y: `${priceCoin.BTC.USD}` },

                    ]
                }
            ]
        };

        $("#chartContainer").CanvasJSChart(options);

        function toggleDataSeries(e) {
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }


    }



});