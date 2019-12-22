/// <reference path="jquery-3.4.1.js" />
"use strict";


// from about/graph - search - bring to home 
$(() => {
    // let tableArr = switchedArray;
    /*LiveReports graph*/
    $("#LiveReports").click(() => {
        const symbols = switchedArray.map(t => t.symbol).join(",");
        let priceCoinArr = [];
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
        getAjaxData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`, response => drawGraph(response));


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
            // let coinForChart = {};
            for (const coin in allCoins) { //coin = ETH
                //price = USD
                // let coinName = `${coin}`;

                // let EEE = parseFloat(allCoins[coin].USD);
                // EEE = parseFloat(allCoins.coinName.USD);
                // EEE = Number("allCoins.coin.USD");

                priceCoinArr.push(allCoins[coin].USD);
            }



            var options = {
                exportEnabled: true,
                animationEnabled: true,
                title: {
                    text: `${symbols} to USD`
                },
                // subtitles: [{
                //     text: "Click Legend to Hide or Unhide Data Series"
                // }],
                axisX: {
                    title: "time"
                },
                axisY: {
                    title: "price in usd",
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
                        name: switchedArray[0].symbol,
                        showInLegend: true,
                        xValueFormatString: "mm:ss",
                        yValueFormatString: "$#,##0.#",
                        dataPoints: [
                            { x: new Date(), y: priceCoinArr[0] },
                            // { x: new Date(2016, 1, 1), y: `${priceCoinArr[0]}` },
                            // { x: new Date(), y: 10 },
                            // { x: new Date(), y: 20 }
                        ]
                    },
                    // {
                    //     type: "spline",
                    //     name: switchedArray[1].symbol,
                    //     showInLegend: true,
                    //     xValueFormatString: "mm:ss",
                    //     yValueFormatString: "$#,##0.#",
                    //     dataPoints: []

                    //         // { x: new Date(2016, 1, 1), y: `${priceCoinArr[0]}` },
                    //         // { x: new Date(), y: 10 },
                    //         // { x: new Date(), y: 20 }

                    // },


                    // {
                    //     type: "spline",
                    //     name: "price",
                    //     axisYType: "secondary",
                    //     showInLegend: true,
                    //     xValueFormatString: "MMM YYYY",
                    //     yValueFormatString: "$#,##0.#",
                    //     dataPoints: [
                    //         { x: new Date(2016, 0, 1), y: 19034.5 },
                    //         { x: new Date(2016, 1, 1), y: 20015 },
                    //         { x: new Date(2016, 2, 1), y: 27342 },
                    //         { x: new Date(2016, 3, 1), y: 20088 },
                    //         { x: new Date(2016, 4, 1), y: 20234 },
                    //         { x: new Date(2016, 5, 1), y: 29034 },
                    //         { x: new Date(2016, 6, 1), y: 30487 },
                    //         { x: new Date(2016, 7, 1), y: 32523 },
                    //         { x: new Date(2016, 8, 1), y: 20234 },
                    //         { x: new Date(2016, 9, 1), y: 27234 },
                    //         { x: new Date(2016, 10, 1), y: 33548 },
                    //         { x: new Date(2016, 11, 1), y: 32534 }
                    //     ]
                    // }
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

        // update chart every second
        setInterval(function() { updateData() }, 20000);

        function updateData() {
            getAjaxData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`, response => drawGraph(response));
            // dataPoints. x: new Date().getSeconds(), y: priceCoinArr[1] },

        }


















        // var dataPoints = [];

        // var options = {
        //     theme: "light2",
        //     title: {
        //         text: "Live Data"
        //     },
        //     data: [{
        //         type: "line",
        //         dataPoints: dataPoints
        //     }]
        // };
        // $("#chartContainer").CanvasJSChart(options);
        // updateData();

        // // Initial Values
        // var xValue = 0;
        // var yValue = 10;
        // var newDataCount = 6;

        // function addData(data) {
        //     if (newDataCount != 1) {
        //         $.each(data, function(key, value) {
        //             dataPoints.push({ x: value[0], y: parseInt(value[1]) });
        //             xValue++;
        //             yValue = parseInt(value[1]);
        //         });
        //     } else {
        //         //dataPoints.shift();
        //         dataPoints.push({ x: data[0][0], y: parseInt(data[0][1]) });
        //         xValue++;
        //         yValue = parseInt(data[0][1]);
        //     }

        //     newDataCount = 1;

        //     $("#chartContainer").CanvasJSChart().render()
        //     setTimeout(updateData, 2000);
        // }
        // update chart every second
        //     // setInterval(function() { updateChart() }, 20000);
        // function updateData() {
        //     // getAjaxData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`, response => drawGraph(response));

        //     $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=" + xValue + "&ystart=" + yValue + "&length=" + newDataCount + "&type=json", addData);
        // }






















































        //     var dataPoints = [];
        //     var chart = new CanvasJS.Chart("chartContainer", {
        //         title: {
        //             text: `${symbols} to USD`
        //         },
        //         data: [{
        //             type: "spline",
        //             dataPoints: dataPoints
        //         }]
        //     });

        //     chart.render();

        //     // var yVal = 15,
        //     let updateCount = 0;
        //     var updateChart = function() {
        //         for (let index = 0; index < priceCoinArr.length; index++) {

        //             dataPoints.push({
        //                 y: `${priceCoinArr[index]}`
        //             });
        //         }

        //         // yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        //         updateCount++;



        //         chart.options.title.text = "Update " + updateCount;
        //         chart.render();

        //     };

        //     // update chart every second
        //     // setInterval(function() { updateChart() }, 20000);
        // }

















        // var options = {
        //     exportEnabled: true,
        //     animationEnabled: true,
        //     title: {
        //         text: `${symbols} to USD`
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
        //                 { x: new Date().getSeconds(), y: `${priceCoinArr[0]}` },

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
        //                 { x: new Date().getSeconds(), y: `${priceCoinArr[1]}` },

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
    });

});