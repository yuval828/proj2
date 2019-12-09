/// <reference path="jquery-3.4.1.js" />
"use strict";

$(() => {
    let allCoinsArray = [];
    let MoreInfoArray = [];
    getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayAllCoins(response));

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
        $(`#allCoins`).addClass("loader");
        allCoinsArray = Coins.slice(0, 12); //slice the array for how much coins we want to see
        let i = 0;
        for (const item of Coins) { //can run on allCoinsArray and dont need if and index
            i++;
            if (i <= 12) {
                let el = drawOneCoin(item);
                $(`#allCoins`).removeClass("loader");
                $("#allCoins").append(el);
                // var coinsArr = arr.push(item); 
            } //else return coinsArr;
        }
    }


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
            // $(`#${this.id}`).toggleClass('active');

            // $(`#${this.id}`).toggleClass('active');

            /* how to make the MoreInfoArray to last for 2 min(and at this time local reading of more info)
             from the first entry no metter how much we press
             so only one entry for a coin 
             */


            // setInterval(() => {
            // $.grep(MoreInfoArray, function(obj) {
            //     if (obj.id === obj1.id) {
            //         displayMoreInfo(obj1);
            //     }
            //     return;
            // })[0];
            // }, 20000);




            // for (const obj of MoreInfoArray) {
            //     for(obj.id in MoreInfoArray){
            //     displayMoreInfo(obj);
            //     return;
            // }

            getAjaxData(`https://api.coingecko.com/api/v3/coins/${(obj1.id)}`, response => displayMoreInfo(response));

        });
        return el
    }


    // to activate spiner on button
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
    function displayMoreInfo(obj) {
        MoreInfoArray.push(obj);
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
        $(`#allCoins`).addClass("loader");
        let el = drawOneCoin(Coin);
        $(`#allCoins`).removeClass("loader");
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





});