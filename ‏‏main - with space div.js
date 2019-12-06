/// <reference path="jquery-3.4.1.js" />
"use strict";

$(() => {
    $("#getAllCoins").click(() => {
        getAjaxData("https://api.coingecko.com/api/v3/coins/list");
    });

    $("#searchCoins").click(() => {
        let searchCountryVal = $("input:text").val();
        searchCountryVal == "" ?
            alert("please enter a country name") :
            getAjaxData(`https://restcountries.eu/rest/v2/name/${searchCountryVal}?fields=name;topLevelDomain;capital;currencies;flag`);
    });

    function getAjaxData(url) {
        $.ajax({
            method: "GET",
            url: url,
            error: err => alert("Error: " + err.status),
            success: response => displayCountries(response)
        });
    }


    function displayCountries(Coins) {
        $("#allCoins").empty();
        // for (let index = 0; index < 10; index++) {
        let i = -1;
        for (const item of Coins) {
            ++i;
            if (i <= 10) {
                let obj = "";
                if (i == 0) {
                    obj += `<div class="space col-xl-3 col-lg-3 col-md-3 col-sm-12" ></div> `
                }
                obj += `
                    <div class="card col-xl-3 col-lg-3 col-md-3 col-sm-12" >
                    <div class="card-body">
                    <h5 class="card-title">${item.symbol}</h5>
                    <p class="card-text">${item.name}</p>
                        <p>
                            <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse${item.symbol}" aria-expanded="false" aria-controls="collapseExample">
                            More Info
                            </button>
                        </p>
                        <div class="collapse" id="collapse${item.symbol}">
                            <div class="card card-body">
                            ea proident.
                            </div>
                        </div>
                    </div>
                    </div>
                    `;
                if (i == 2 || i == 5 || i == 8) {
                    obj += `<div class="space col-xl-3 col-lg-3 col-md-3 col-sm-12" ></div> 
                    <div class="space col-xl-3 col-lg-3 col-md-3 col-sm-12" ></div> `
                }
                $("#allCoins").append(obj);
            } else return;
            // <span>
            //     <img class="imgCountry" src="${Countries[item].flag}" >
            // </span>

        }
    }
});