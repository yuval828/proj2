/// <reference path="jquery-3.4.1.js" />
"use strict";

// from about/graph - search - bring to home
$(() => {
    let interval;
    let chart;

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

        updateData(); //get first time data

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

        const data = [];

        function drawGraph(response) {
            if (response.Response === "Error") {
                $("#secondParalex").text(`
                    The Coins you choosed didnt return any value
                `);
                return
            } else {
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

                // update chart every second
                interval = setInterval(function() {
                    updateData();
                }, 2000);
            }
        }
    });

    //go to about if about press
    $("#About").click(() => {
        if (interval) {
            clearInterval(interval)
            interval = null
        }
        if (chart) {
            chart.destroy()
            chart = null
        }
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