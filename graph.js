/// <reference path="jquery-3.4.1.js" />
"use strict";

// from about/graph - search - bring to home
$(() => {
    let interval;
    let chart;

    // let tableArr = switchedArray;
    /*LiveReports graph*/
    $("#LiveReports").click(() => {
        if (interval) {
            clearInterval(interval)
            interval = null
        }
        if (chart) {
            chart.destroy()
            chart = null
        }
        const symbols = switchedArray.map(t => t.symbol).join(",");
        // let priceCoinArr = [];
        // let dataPoints = [];
        // let dataPoints1 = [];
        // let dataPoints2 = [];
        // let dataPoints3 = [];
        // let dataPoints4 = [];

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
        updateData();

        function getAjaxData(url, callback) {
            $.ajax({
                method: "GET",
                url: url,
                error: err => alert("Error: " + err.status),
                success: response => callback(response),
            });
        }

        const data = [];

        function drawGraph(response) {
            if (response.Response === "Error") {
                $("#secondParalex").text(`
                The Coins you choosed didnt returned any value
                `);
                return
            }

            const now = new Date()
            for (const coin in response) {
                //coin = ETH
                const price = response[coin].USD;
                let dataItem = data.find(t => t.name == coin)
                if (!dataItem) {
                    dataItem = {
                        type: "spline",
                        showInLegend: true,
                        name: coin,
                        xValueFormatString: "mm:ss",
                        yValueFormatString: "$#,##0.#####",
                        dataPoints: [],
                    };
                    data.push(dataItem);
                }
                dataItem.dataPoints.push({ x: now, y: price })
            }

            var options = {
                animationEnabled: true,
                title: {
                    text: `${symbols} to USD`,
                },
                axisX: {
                    title: "time",
                    valueFormatString: "mm:ss",
                },
                axisY: {
                    title: "price in usd",
                    titleFontColor: "#4F81BC",
                    lineColor: "#4F81BC",
                    labelFontColor: "#4F81BC",
                    tickColor: "#4F81BC",
                    includeZero: false,
                },
                toolTip: {
                    shared: true,
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries,
                },
                data: data,
            };

            if (!chart) {
                chart = new CanvasJS.Chart("chartContainer", options); //$("#chartContainer").CanvasJSChart(options);
            }
            chart.render()

            function toggleDataSeries(e) {
                if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        }

        // update chart every second
        interval = setInterval(function() {
            updateData();
        }, 2000);

        function updateData() {
            getAjaxData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`, response =>
                drawGraph(response),
            );
        }
    });
});