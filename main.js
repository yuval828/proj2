/// <reference path="jquery-3.4.1.js" />
"use strict";

$(() => {
    $("#getAllCoins").click(() => {
        getAjaxData("https://api.coingecko.com/api/v3/coins/list", response => displayCoins(response));
    });

    //טרם טופל חיפוש
    $("#searchCoins").click(() => {
        let searchCountryVal = $("input:text").val();
        searchCountryVal == "" ?
            alert("please enter a country name") :
            getAjaxData(`https://restcountries.eu/rest/v2/name/${searchCountryVal}?fields=name;topLevelDomain;capital;currencies;flag`, response => displayCoins(response));
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


    function displayCoins(Coins) {
        $("#allCoins").empty();
        // for (let index = 0; index < 10; index++) {
        let i = 0;
        for (const item of Coins) {
            i++;
            if (i <= 10) {

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
                $("#allCoins").append(obj);

            } else return;


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




    // $("p>button").click(function() {
    //     alert(this.innerText);
    // });

});