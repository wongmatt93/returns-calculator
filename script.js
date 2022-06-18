var stock;
var sharesOwned = 0;
var contribute = 0;
var costBasis = 0;
var optionsCost = 0;
var costPerShare = 0;
var percentReturn = 0;
var upStock = 0;
var upCost = 0;
var dividend = 0;
var option = 0;
var profit = 0;
var totalDiv = 0;
var totalOpt = 0;
var closePrice = 0;
var sellPrice = 0;

//ensures dividends can only be added if shares owned is greater than zero
//no such thing as dividends without owning any shares
function activate() {
    if (sharesOwned == 0) {
        if (document.getElementById("dividend").classList.contains("disabled")) {
            return true;
        } else {
            document.getElementById("dividend").classList.add("disabled");
        }
    } else if (sharesOwned > 0) {
        if (document.getElementById("dividend").classList.contains("disabled")) {
            document.getElementById("dividend").classList.remove("disabled");
        } else {
            return true;
        }
    }
}

//this is used very often so figured I'd write its own function
function calcCostPerShare() {
    costPerShare = costBasis/sharesOwned;
    document.getElementById("costBasis").innerHTML = "Current Cost Basis: $" + costBasis.toFixed(2);
    document.getElementById("avgCost").innerHTML = "Cost Per Share: $" + costPerShare.toFixed(2);
}

function bye() {
    console.log("Invalid response. Bye");
    return;
}

function addStocks() {
    stock = prompt("Add stock here:");
    if (!stock) {
        bye();
    } else {
        document.getElementById("upStock").classList.remove("disabled");
        document.getElementById("bto").classList.remove("disabled");
        document.getElementById("sto").classList.remove("disabled");
        document.getElementById("stockName").innerHTML = "Stock: " + stock;
    }
}

function updateStocks() {
    let buySell = prompt("Did you buy or sell shares?")
    if (buySell == "Buy" || buySell == "buy") {
        upStock = Number(prompt("Please enter the number of shares bought:"));
        upCost = Number(prompt("Please enter the cost of these shares:"));
        contribute += upCost;
        sharesOwned += upStock;
        costBasis += upCost;
        activate();
        document.getElementById("numShares").innerHTML = "Number of Shares: " + sharesOwned;
        document.getElementById("contribute").innerHTML = "Contribution: $" + contribute.toFixed(2);
        document.getElementById("calc").classList.remove("disabled");
        calcCostPerShare();
    } else if (buySell == "Sell" || buySell == "sell") {
        upStock = Number(prompt("Please enter the number of shares sold:"));
        if (upStock > sharesOwned) {
            //breaking if statement here because we can't have negative shares
            //we don't do shorts here
            return;
        }
        upCost = Number(prompt("Please enter the amount received from sale:"));
        sharesOwned -= upStock;
        if (sharesOwned == 0) {
            profit += (upCost - costBasis);
            //need to deactivate dividend button since we're selling all shares
            activate();
            costBasis = 0;
            percentReturn = profit/contribute * 100;
            document.getElementById("calc").classList.add("disabled");
            document.getElementById("stockName").innerHTML = "Stock: ";
            document.getElementById("numShares").innerHTML = "Number of Shares: ";
            document.getElementById("costBasis").innerHTML = "Cost Basis: ";
            document.getElementById("avgCost").innerHTML = "Cost Per Share: ";
            document.getElementById("profit").innerHTML = "Total Profit: $" + profit.toFixed(2);
            document.getElementById("percentReturn").innerHTML = "Percent Return: " + percentReturn + "%";
            contribute = 0;
            document.getElementById("contribute").innerHTML = "Contribution:";
        } else {
            costBasis -= upCost;
            document.getElementById("numShares").innerHTML = "Number of Shares: " + sharesOwned;
            calcCostPerShare();
        }
    } else {
        bye();
    }
}

function addDividends() {
    dividend = Number(prompt("Please enter the amount of dividends received"));
    if (dividend >= 0) {
        costBasis -= dividend;
        totalDiv += dividend;
        document.getElementById("totalDiv").innerHTML = "Dividends: $" + totalDiv.toFixed(2);
        calcCostPerShare();
    } else {
        bye();
    }
}

function calcPrice() {
    let percent = Number(prompt("Enter the amount of profit you would like to pocket: (Enter Percent)"));
    percent /= 100;
    sellPrice  = contribute + percent * contribute;
    document.getElementById("sellPrice").innerHTML = "Sell Price: $" + sellPrice;
}

function calcOptions() {
    let percent = Number(prompt("Enter the amount of profit would you like to pocket: (Enter Percent)"));
    document.getElementById("percentProfit").innerHTML = "Desired Profit: " + percent + "%";
    percent /= 100;
    closePrice = totalOpt - totalOpt * percent;
    document.getElementById("closeAmount").innerHTML = "Close Price: $" + closePrice.toFixed(2);
}

function buyToOpen() {
    let bto = Number(prompt("Enter the cost of this option:"));
    document.getElementById("stc").classList.remove("disabled");
    document.getElementById("optionsCalc").classList.remove("disabled");
    totalOpt -= bto;
    document.getElementById("optionsPrem").innerHTML = "Options Premiums: $" + totalOpt.toFixed(2);
    document.getElementById("openOpt").innerHTML = "Open Option: Yes";

}

function buyToClose() {
    let btc = Number(prompt("Enter the cost of this option:"));
    document.getElementById("btc").classList.add("disabled");
    document.getElementById("openOpt").innerHTML = "Open Option: No";
    document.getElementById("optionsCalc").classList.add("disabled");
    totalOpt -= btc;
    document.getElementById("optionsPrem").innerHTML = "Options Premiums: $" + totalOpt.toFixed(2);
    document.getElementById("percentProfit").innerHTML = "Desired Profit: ";
    document.getElementById("closeAmount").innerHTML = "Close Price: $";
    if (costBasis > 0) {
        costBasis += btc;
        calcCostPerShare();
    }
}

function sellToOpen() {
    let sto = Number(prompt("Enter the cost of this option:"));
    document.getElementById("openOpt").innerHTML = "Open Option: Yes";
    document.getElementById("btc").classList.remove("disabled");
    document.getElementById("optionsCalc").classList.remove("disabled");
    totalOpt += sto;
    document.getElementById("optionsPrem").innerHTML = "Options Premiums: $" + totalOpt.toFixed(2);
    if (costBasis > 0) {
        costBasis -= sto;
        calcCostPerShare();
    }
}

function sellToClose() {
    let stc = Number(prompt("Enter the cost of this option:"));
    document.getElementById("stc").classList.add("disabled");
    document.getElementById("optionsCalc").classList.add("disabled");
    document.getElementById("openOpt").innerHTML = "Open Option: No";
    totalOpt += stc;
    document.getElementById("optionsPrem").innerHTML = "Options Premiums: $" + totalOpt.toFixed(2);
    document.getElementById("percentProfit").innerHTML = "Desired Profit:";
    document.getElementById("closeAmount").innerHTML = "Close Price:";
}