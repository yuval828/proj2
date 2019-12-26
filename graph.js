/// <reference path="jquery-3.4.1.js" />
"use strict";

// from about/graph - search - bring to home
$(() => {
    let interval;
    let chart;

    /*LiveReports graph*/
    $("#LiveReports").click(() => {
        clearGraph()

        function clearGraph() {
            if (interval) {
                clearInterval(interval)
                interval = null
            }
            if (chart) {
                chart.destroy()
                chart = null
            }
        }

        const symbols = switchedArray.map(t => t.symbol).join(","); //get all the symbols of coins we choosed

        $("#allCoins").empty();
        $(`#headerSpinner`).addClass("loader");
        $(".bgimg-1").css({ "background-image": `url("img/LiveReports.jpg")`, "min-height": "50%" });
        $("#firstParalex").text(`
            Scroll down to see your graph
        `);
        $(".bgimg-2").css({ "background-image": `url("img/LiveReports.jpg")`, "min-height": "50%" });
        $("#secondParalex").text(``);
        $(`#headerSpinner`).removeClass("loader");
        $(`footer`).html(`
            <div id="chartContainer" style="height: 100%; width: 100%;"></div>
        `);
        const data = [];

        updateData(); //get first time data

        // update chart every 2 second
        interval = setInterval(function() {
            updateData();
        }, 2000);


        function updateData() {
            getAjaxData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`, response =>
                drawGraph(response),
            );
        }


        function getAjaxData(url, callback) {
            $.ajax({
                method: "GET",
                url: url,
                error: err => alert("Error: " + err.status),
                success: response => callback(response),
            });
        }


        function drawGraph(response) {
            if (response.Response === "Error") {
                $("#secondParalex").html(`
                    The Coins you choosed didnt return any value \n
                    please go to home and choose Coins or search your Coin 
                `);
                clearGraph()
                return
            }
            const now = new Date()
            for (const coin in response) { //will get a coin and make a dataItem of it
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

            const options = { //chart options
                animationEnabled: true,
                title: {
                    text: `${symbols} to USD`,
                },
                subtitles: [{
                    text: "If you dont see on the graph one or more of the coins you choosed, it is because they dont have live price value",
                }],
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

            if (!chart) { //if first time make chart
                chart = new CanvasJS.Chart("chartContainer", options);
            }
            chart.render(); //render the chart

            function toggleDataSeries(e) { //the legends down the chart
                if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        }
    });
});