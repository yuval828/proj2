/// <reference path="jquery-3.4.1.js" />
"use strict";

$(() => {

    getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayCoins(response));


    //טרם טופל חיפוש
    $("#searchCoins").click(() => {
        let searchCountryVal = $("input").val();
        searchCountryVal == "" ?
            alert("please enter a Symbol name: like BTC or Name: like bitcoin") :
            getAjaxData(`https://api.coingecko.com/api/v3/coins/${searchCountryVal}`, response => displayCoin(response));
    });

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


    function displayCoin(Coin) {
        let obj = drawCoin(Coin);
        $("#allCoins").append(obj);
    }

    function displayCoins(Coins) {
        $("#allCoins").empty();
        // for (let index = 0; index < 10; index++) {
        const arr = new Array;
        let i = 0;
        for (const item of Coins) {
            i++;
            if (i <= 10) {
                let obj = drawCoin(item);

                $("#allCoins").append(obj);
                var coinsArr = arr.push(item);

            } else return coinsArr;
        }
    }

    function displayMoreInfo(id) {
        const obj = `
         <div class="collapse" id="collapse${item.symbol}">
            <div class="card card-body">
            <h5 class="card-title">${id.data_market.current_price.usd}</h5>
            <h5 class="card-title">${id.data_market.current_price.euro}</h5>
            <h5 class="card-title">${id.data_market.current_price.nis}</h5>
              <span>
                  <img class="imgCountry" src="${id.image.small}" >
              </span>                  
            </div>
        </div>
                            `
        $("#allCoins").append(obj);
    }


    function drawCoin(item) {
        const obj = `
                    <div class="card col-xl-4 col-lg-4 col-md-4 col-sm-12" >
                    <div class="card-body">
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider round"></span>
                    </label>
                    <h5 class="card-title">${item.symbol}</h5>
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
                    </div>
                    </div>
                    `;
        return obj;
    }

    // $("p>button").click(function() {
    //     alert(this.innerText);
    // });

});