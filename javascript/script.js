//array of objects to hold stocks
const portfolio = [
  {
    ticker: "AAPL",
    quantity: 0,
    costBasis: 28000,
    cashReturn: 750,
  },
];

const openOptionsPositions = [
  {
    ticker: "AAPL",
    expiration: "8-19-22",
    strike: 135,
    callPut: "Put",
    premium: 250,
    buySell: "Sell",
  },
];

//declaring variables
const portfolioList = document.querySelector(".portfolio-list");
const addStockForm = document.querySelector(".add-stock-form");
const deleteStock = document.querySelector(".fa-trash-can");
const totalCostBasis = document.querySelector(".total-cost-basis");
const totalCashReturn = document.querySelector(".total-cash-return");
const totalPercentReturn = document.querySelector(".total-percent-return");
const stockFormModal = document.querySelector(".stock-detail-modal-container");
const detailHeader = document.querySelector(".detail-header");
const detailQuantity = document.querySelector(".detail-quantity");
const detailCostBasis = document.querySelector(".detail-cost-basis");
const detailReturns = document.querySelector(".detail-returns");
const detailActiveOptions = document.querySelector(".detail-active-options");

//print portfolio to homepage function
const printPortfolio = (portfolio) => {
  portfolioList.textContent = "";
  let stockCostBasis = 0;
  let stockCashReturn = 0;

  portfolio.forEach((stock, index) => {
    const newStock = document.createElement("tr");
    const ticker = document.createElement("td");
    const tickerLink = document.createElement("a");
    const openOptions = document.createElement("td");
    const buyOptions = document.createElement("button");
    const sellOptions = document.createElement("button");
    const costBasis = document.createElement("td");
    const cashReturn = document.createElement("td");
    const removeStockItem = document.createElement("td");
    const removeStock = document.createElement("i");

    const openBuyOptions = openOptionsPositions.filter(
      (option) => option.buySell == "Buy"
    ).length;
    const openSellOptions = openOptionsPositions.filter(
      (option) => option.buySell == "Sell"
    ).length;

    newStock.classList.add("individual-stock");
    tickerLink.classList.add("stock-link");
    openOptions.classList.add("open-options");
    buyOptions.classList.add("buy-option");
    sellOptions.classList.add("sell-option");
    removeStock.classList.add("fa-solid", "fa-trash-can");

    tickerLink.setAttribute("href", `?stock=${stock.ticker}`);
    openOptions.setAttribute("data-stock", stock.ticker);
    buyOptions.setAttribute("data-buysell", "buy");
    sellOptions.setAttribute("data-buysell", "sell");
    removeStock.setAttribute("data-index", index);

    tickerLink.textContent = stock.ticker;
    buyOptions.textContent = `Buy: ${openBuyOptions}`;
    sellOptions.textContent = `Sell: ${openSellOptions}`;
    costBasis.textContent = `$${stock.costBasis
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    cashReturn.textContent = `$${stock.cashReturn
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    ticker.append(tickerLink);
    openOptions.append(buyOptions, sellOptions);
    removeStockItem.append(removeStock);

    stockCostBasis += stock.costBasis;
    stockCashReturn += stock.cashReturn;

    newStock.append(
      ticker,
      openOptions,
      costBasis,
      cashReturn,
      removeStockItem
    );
    portfolioList.append(newStock);
  });

  totalCostBasis.textContent = `$${stockCostBasis
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  totalCashReturn.textContent = `$${stockCashReturn
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  if (totalCostBasis != 0) {
    totalPercentReturn.textContent = `${(
      (stockCashReturn / stockCostBasis) *
      100
    )
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%`;
  } else {
    totalPercentReturn.textContent = `0%`;
  }
};

//print options in detail modal function
const printOptions = (options, ticker) => {
  detailActiveOptions.textContent = "";
  options.forEach((option) => {
    if (option.ticker == ticker) {
      const newOption = document.createElement("li");
      const expiration = document.createElement("p");
      const strike = document.createElement("p");
      const callPut = document.createElement("p");
      const premium = document.createElement("p");

      expiration.textContent = option.expiration;
      strike.textContent = option.strike;
      callPut.textContent = option.callPut;
      premium.textContent = option.premium;

      newOption.append(expiration, strike, callPut, premium);
      detailActiveOptions.append(newOption);
    }
  });
};

//add a stock to portfolio
addStockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticker = document.querySelector("#ticker").value;
  const costBasis = parseInt(document.querySelector("#cost-basis").value);

  const newStock = {
    ticker,
    quantity: 0,
    buyOptions: 0,
    sellOptions: 0,
    costBasis,
    cashReturn: 0,
  };

  portfolio.push(newStock);
  printPortfolio(portfolio);
});

portfolioList.addEventListener("click", (event) => {
  //delete a stock from portfolio
  if (event.target.classList.contains("fa-trash-can")) {
    const index = event.target.getAttribute("data-index");
    portfolio.splice(index, 1);
    printPortfolio(portfolio);
  }
  //open stock modal for more details
  if (event.target.classList.contains("stock-link")) {
    event.preventDefault();
    const ticker = event.target.textContent;
    stockFormModal.classList.remove("toggle-modal");
    detailHeader.textContent = ticker;

    const stock = portfolio.find((stock) => {
      return stock.ticker == ticker;
    });

    detailQuantity.textContent = stock.quantity;
    detailCostBasis.textContent = stock.costBasis;
    detailReturns.textContent = stock.cashReturn;
    printOptions(openOptionsPositions, ticker);
  }
});

//close stock modal after opening
stockFormModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("stock-detail-modal-container")) {
    stockFormModal.classList.add("toggle-modal");
  }
});

//print portfolio to homepage when first loading
printPortfolio(portfolio);
