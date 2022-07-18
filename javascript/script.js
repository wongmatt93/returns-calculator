//array of objects to hold dummystocks
const portfolio = [
  {
    ticker: "AAPL",
    quantity: 0,
    costBasis: 28600,
    dividends: 0,
  },
];

//array of objects to hold dummy options
const optionsPositions = [
  {
    type: "STO",
    ticker: "AAPL",
    transactionDate: "2022-07-12",
    strike: 135,
    callPut: "Put",
    premium: 1500,
    expiration: "2022-08-19",
    openOption: true,
  },
];

const dividends = [];

//declaring variables
const portfolioList = document.querySelector(".portfolio-list");
const addStockForm = document.querySelector(".add-stock-form");
const deleteStock = document.querySelector(".fa-trash-can");
const totalCostBasis = document.querySelector(".total-cost-basis");
const totalCashReturn = document.querySelector(".total-cash-return");
const totalPercentReturn = document.querySelector(".total-percent-return");
const stockFormModal = document.querySelector(".stock-detail-modal-container");
const updateQuantityForm = document.querySelector(".update-quantity-form");
const updateDividendForm = document.querySelector(".update-dividend-form");
const addOptionsForm = document.querySelector(".add-options-form");
const detailHeader = document.querySelector(".detail-header");
const detailQuantity = document.querySelector(".detail-quantity");
const detailCostBasis = document.querySelector(".detail-cost-basis");
const detailDividends = document.querySelector(".detail-dividends");
const detailPremiums = document.querySelector(".detail-premiums");
const detailReturns = document.querySelector(".detail-total-returns");
const detailActiveOptions = document.querySelector(".detail-all-options");
const detailAllOptions = document.querySelector(".detail-all-options");

//print portfolio to homepage function
const printPortfolio = (portfolio) => {
  portfolioList.textContent = "";
  let totalStockCostBasis = 0;
  let totalStockCashReturn = 0;

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

    const openBuyOptions = optionsPositions.filter(
      (option) =>
        option.type.includes("B") &&
        option.ticker == stock.ticker &&
        option.openOption
    ).length;
    const openSellOptions = optionsPositions.filter(
      (option) =>
        option.type.includes("S") &&
        option.ticker == stock.ticker &&
        option.openOption
    ).length;
    const premium = optionsPositions.reduce(
      (pv, cv) => (cv.ticker === stock.ticker ? pv + cv.premium : pv),
      0
    );
    const stockReturn = stock.dividends + premium;

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
    removeStock.setAttribute("data-stock", stock.ticker);

    tickerLink.textContent = stock.ticker;
    buyOptions.textContent = `Buy: ${openBuyOptions}`;
    sellOptions.textContent = `Sell: ${openSellOptions}`;
    costBasis.textContent = `$${stock.costBasis
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    cashReturn.textContent = `$${stockReturn
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    ticker.append(tickerLink);
    openOptions.append(buyOptions, sellOptions);
    removeStockItem.append(removeStock);

    totalStockCostBasis += stock.costBasis;
    totalStockCashReturn += stockReturn;

    newStock.append(
      ticker,
      openOptions,
      costBasis,
      cashReturn,
      removeStockItem
    );
    portfolioList.append(newStock);
  });

  totalCostBasis.textContent = `$${totalStockCostBasis
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  totalCashReturn.textContent = `$${totalStockCashReturn
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  if (totalCostBasis.textContent != "$0.00") {
    totalPercentReturn.textContent = `${(
      (totalStockCashReturn / totalStockCostBasis) *
      100
    )
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%`;
  } else {
    totalPercentReturn.textContent = `N/A`;
  }
};

//print options in detail modal function
const printOptions = (optionsArray, ticker) => {
  detailActiveOptions.textContent = "";

  let totalPremium = 0;

  optionsArray.forEach((option) => {
    if (option.ticker == ticker) {
      const newOption = document.createElement("tr");
      const type = document.createElement("td");
      const transactionDate = document.createElement("td");
      const strike = document.createElement("td");
      const callPut = document.createElement("td");
      const premium = document.createElement("td");
      const expiration = document.createElement("td");
      const status = document.createElement("td");

      const statusText = option.openOption ? "Open" : "Closed";

      type.textContent = option.type;
      transactionDate.textContent = option.transactionDate;
      strike.textContent = `$${option.strike
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
      callPut.textContent = option.callPut;
      premium.textContent = `$${option.premium
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
      expiration.textContent = option.expiration;
      status.textContent = statusText;

      totalPremium += option.premium;

      newOption.append(
        type,
        transactionDate,
        strike,
        callPut,
        premium,
        expiration,
        statusText
      );
      detailActiveOptions.append(newOption);
    }
  });

  const dividends = detailDividends.textContent;
  const totalReturn = parseInt(totalPremium + dividends);

  detailPremiums.textContent = `$${totalPremium
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  detailReturns.textContent = `$${totalReturn
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const printDividends = (dividends, ticker) => {
  const stockDividends = dividends.filter(
    (dividend) => dividend.ticker == ticker
  );
  const totalDividends = stockDividends.reduce((pv, cv) => {
    return pv + cv.amount;
  }, 0);

  detailDividends.textContent = `$${totalDividends
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

//add a stock to portfolio
addStockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticker = document.querySelector("#ticker").value;
  const costBasis = parseInt(document.querySelector("#cost-basis").value);

  if (portfolio.some((stock) => stock.ticker == ticker)) {
    alert("You've already added this stock");
  } else {
    const newStock = {
      ticker,
      quantity: 0,
      costBasis,
      dividends: 0,
    };

    portfolio.push(newStock);
    printPortfolio(portfolio);
  }
});

//update stock quantity
updateQuantityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticker = detailHeader.textContent;
  const quantity = document.querySelector("#quantity").value;
  const stock = portfolio.find((stock) => {
    return stock.ticker == ticker;
  });

  stock.quantity = quantity;
  detailQuantity.textContent = quantity;
});

//add new dividends
updateDividendForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticker = detailHeader.textContent;
  const date = document.querySelector("#dividend-date").value;
  const amount = parseInt(document.querySelector("#dividend-amount").value);

  const newDividend = {
    ticker,
    date,
    amount,
  };

  dividends.push(newDividend);
  printDividends(dividends, ticker);
});

//add an option to portfolio
addOptionsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticker = detailHeader.textContent;
  const type = document.querySelector("#type").value;
  const transactionDate = document.querySelector("#transaction-date").value;
  const strike = parseInt(document.querySelector("#strike").value);
  const callPut = document.querySelector("#call-put").value;
  const premium = parseInt(document.querySelector("#premium").value);
  const expiration = document.querySelector("#expiration").value;

  const newOption = {
    type: type,
    ticker: ticker,
    transactionDate: transactionDate,
    strike: strike,
    callPut: callPut,
    premium: premium,
    expiration: expiration,
    openOption: type.includes("O"),
  };
  optionsPositions.push(newOption);

  printOptions(optionsPositions, ticker);
  printPortfolio(portfolio);
});

//multiple events, but both are included in same event listener
portfolioList.addEventListener("click", (event) => {
  //delete a stock from portfolio
  if (event.target.classList.contains("fa-trash-can")) {
    const index = event.target.getAttribute("data-index");
    const ticker = event.target.getAttribute("data-stock");
    if (optionsPositions.some((option) => option.ticker == ticker)) {
      alert("You still have open options positions.");
    } else {
      portfolio.splice(index, 1);
      printPortfolio(portfolio);
    }
  }

  //open stock modal for more details
  if (event.target.classList.contains("stock-link")) {
    event.preventDefault();
    const ticker = event.target.textContent;
    stockFormModal.classList.remove("toggle-modal");
    detailHeader.textContent = ticker;

    const stock = portfolio.find((stock) => stock.ticker == ticker);

    detailQuantity.textContent = `${stock.quantity
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    detailCostBasis.textContent = `$${stock.costBasis
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    detailDividends.textContent = `$${stock.dividends
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    printOptions(optionsPositions, ticker);
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
