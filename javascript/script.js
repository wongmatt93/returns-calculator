const portfolio = [
  {
    ticker: "AAPL",
    quantity: 0,
    buyOptions: 0,
    sellOptions: 2,
    costBasis: 28000,
    cashReturn: 750,
  },
];

const portfolioList = document.querySelector(".portfolio-list");
const addStockForm = document.querySelector(".add-stock-form");
const deleteStock = document.querySelector(".fa-trash-can");
const finalCostBasis = document.querySelector(".total-cost-basis");
const finalCashReturn = document.querySelector(".total-cash-return");

const printPortfolio = (portfolio) => {
  portfolioList.textContent = "";
  let totalCostBasis = 0;
  let totalCashReturn = 0;

  portfolio.forEach((stock, index) => {
    const newStock = document.createElement("tr");
    const ticker = document.createElement("td");
    const quantity = document.createElement("td");
    const openOptions = document.createElement("td");
    const buyOptions = document.createElement("button");
    const sellOptions = document.createElement("button");
    const costBasis = document.createElement("td");
    const cashReturn = document.createElement("td");
    const removeStockItem = document.createElement("td");
    const removeStock = document.createElement("i");

    newStock.classList.add("individual-stock");
    openOptions.classList.add("open-options");
    buyOptions.classList.add("buy-option");
    sellOptions.classList.add("sell-option");
    removeStock.classList.add("fa-solid", "fa-trash-can");

    openOptions.setAttribute("data-stock", stock.ticker);
    buyOptions.setAttribute("data-buysell", "buy");
    sellOptions.setAttribute("data-buysell", "sell");
    removeStock.setAttribute("data-index", index);

    ticker.textContent = stock.ticker;
    quantity.textContent = stock.quantity
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    buyOptions.textContent = `Buy: ${stock.buyOptions}`;
    sellOptions.textContent = `Sell: ${stock.sellOptions}`;
    costBasis.textContent = `$${stock.costBasis
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    cashReturn.textContent = `$${stock.cashReturn
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    openOptions.append(buyOptions, sellOptions);
    removeStockItem.append(removeStock);

    totalCostBasis += stock.costBasis;
    totalCashReturn += stock.cashReturn;

    newStock.append(
      ticker,
      quantity,
      openOptions,
      costBasis,
      cashReturn,
      removeStockItem
    );
    portfolioList.append(newStock);
  });

  finalCostBasis.textContent = `$${totalCostBasis
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  finalCashReturn.textContent = `$${totalCashReturn
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

addStockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticker = document.querySelector("#ticker").value;
  const quantity = document.querySelector("#quantity").value;
  const costBasis = parseInt(document.querySelector("#cost-basis").value);

  const newStock = {
    ticker,
    quantity,
    buyOptions: 0,
    sellOptions: 0,
    costBasis,
    cashReturn: 0,
  };

  portfolio.push(newStock);
  printPortfolio(portfolio);
});

portfolioList.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-trash-can")) {
    const index = event.target.getAttribute("data-index");
    portfolio.splice(index, 1);
    printPortfolio(portfolio);
  }
});

printPortfolio(portfolio);
