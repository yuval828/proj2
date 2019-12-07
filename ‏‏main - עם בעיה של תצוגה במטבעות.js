/// <reference path="jquery-3.4.1.js" />
"use strict";

$(() => {
    let allCoinsArray = [];
    getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayCoins(response));


    $(".getInfo").click(() => {
        getAjaxData(`https://api.coingecko.com/api/v3/coins/${item.id}`, response => displayMoreInfo(response));
    });


    function getAjaxData(url, callback) {
        $.ajax({
            method: "GET",
            url: url,
            error: err => alert("Error: " + err.status),
            success: response => callback(response)
        });
    }



    function displayCoins(Coins) { //run on the array for how many coins we want to draw
        $("#allCoins").empty();
        allCoinsArray = Coins.slice(0, 10); //slice the array for how much coins we want to see
        let i = 0;
        for (const item of Coins) { //can run on allCoinsArray and dont need if and index
            i++;
            if (i <= 10) {
                let str = drawCoin(item);
                $("#allCoins").append(str);
                // var coinsArr = arr.push(item); 
            } //else return coinsArr;
        }
    }


    function drawCoin(item) { //a single coin draw
        const str = `
        <div class="card-body col-xl-4 col-lg-4 col-md-4 col-sm-4 row " >
                <h5 class="card-title">${item.symbol}</h5>  
          
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                </label>  
           
                <p class="card-text">${item.name}</p>
                <p>
                    <button class="btn btn-primary getInfo" type="button" data-toggle="collapse" data-target="#collapse${item.symbol}" aria-expanded="false" aria-controls="collapse">
                      More Info
                    </button>
                </p>
                <div class="collapse" id="collapse${item.symbol}">
                    <div class="card card-body">
                    
                    </div>
                </div>
                  
        </div> `;
        return str;
    }

    //search a coin
    $("#searchCoins").click(() => {
        let searchCoin = $("input").val();
        if (searchCoin == "") {
            alert("please enter a Symbol name: like BTC or Name: like bitcoin");
        } else {
            $.grep(allCoinsArray, function(obj) {
                if (obj.symbol === searchCoin) {
                    displayCoin(obj);
                }
                return;
            })[0];
            $.grep(allCoinsArray, function(obj) {
                if (obj.name === searchCoin) {
                    displayCoin(obj);
                }
                return;
            })[0];
            alert(`you didnt enter a correct coin please enter a Symbol name: like BTC or Name: like bitcoin`);
        }
    });


    function displayCoin(Coin) {
        let str = drawCoin(Coin);
        $("#allCoins").empty();
        $("#allCoins").append(str);
    }

    //get More Info for coin - and then store it for 2 min for local usage
    function displayMoreInfo(id) {
        const str = `
        <div class="collapse" id="collapse${item.symbol}">
           <div class="card-body">
                <h5 class="card-title">${id.data_market.current_price.usd}</h5>
                <h5 class="card-title">${id.data_market.current_price.euro}</h5>
                <h5 class="card-title">${id.data_market.current_price.nis}</h5>
                <span>
                  <img class="imgCountry" src="${id.image.small}" >
                </span>                  
            </div>
        </div>`;
        $("#allCoins").append(str);
    }


});