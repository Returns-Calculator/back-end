module.exports = {
  calculateReturns,
  calculatePortfolioReturns
};

function getDates() {
  // Date calculation
  // ex: thisMonth is 2019-11, lastMonth is 10, lastMonthYear is 2019
  // ex: thisMonth is 2019-01, lastMonth is 12, lastMonthYear is 2018
  let thisMonth = new Date();
  let lastMonthYear = thisMonth.getFullYear();
  // do not add one because we want last month, which works with zero based getMonth
  let lastMonth = String(thisMonth.getMonth()).padStart(2, "0");
  // account for if thisMonth is January
  if (String(thisMonth.getMonth()) === "0") {
    lastMonth = 12;
    lastMonthYear -= 1;
  }
  // shape of price history data is ex: 2019-11-29, so conform dates to that format
  const lm = `-${lastMonth}-`;
  const lmr = `${lastMonthYear}-${lastMonth}`;
  const begYear =
    lastMonth === "12" ? `${lastMonthYear}-12` : `${lastMonthYear - 1}-12`;
  const oneY = `${lastMonthYear - 1}-${lastMonth}`;
  const threeY = `${lastMonthYear - 3}-${lastMonth}`;
  const fiveY = `${lastMonthYear - 5}-${lastMonth}`;
  const tenY = `${lastMonthYear - 10}-${lastMonth}`;

  return [lm, lmr, begYear, oneY, threeY, fiveY, tenY];
}

function calculate(arr, date, lastMonthAdjPrice, years = 1) {
  // find price history record, then calculate total return, return annualized return
  const record = arr.find(rec => rec.date.includes(date));
  if (record) {
    const price = record.adjusted_close;
    const total = (lastMonthAdjPrice - price) / price;
    return Math.pow(1 + total, 1 / years) - 1;
  } else return null;
}

function calculateReturns(history) {
  // Data from latest month end, so need last month
  const [lm, lmr, begYear, oneY, threeY, fiveY, tenY] = getDates();
  // filter history to reduce .find run times on remaining functions
  const filtered = history.filter(history => history.date.includes(lm));
  // find most recent month end record as base for calculating returns
  const lastMonthRecord = filtered.find(his => his.date.includes(lmr));
  let lastMonthAdjPrice = null;
  if (lastMonthRecord) {
    lastMonthAdjPrice = lastMonthRecord.adjusted_close;
  }
  if (!lastMonthRecord) {
    return {
      message:
        "No records found for latest month, please retrieve adjusted_close prices from AlphaVantage"
    };
  }
  const YTD = calculate(history, begYear, lastMonthAdjPrice);
  const oneYear = calculate(filtered, oneY, lastMonthAdjPrice);
  const threeYear = calculate(filtered, threeY, lastMonthAdjPrice, 3);
  const fiveYear = calculate(filtered, fiveY, lastMonthAdjPrice, 5);
  const tenYear = calculate(filtered, tenY, lastMonthAdjPrice, 10);

  return { YTD, oneYear, threeYear, fiveYear, tenYear };
}

function calculatePortfolioReturns(portfolioHoldings, portfolioHistory) {
  // Data from latest month end, so need last month
  const [lm, lmr, begYear, oneY, threeY, fiveY, tenY] = getDates();

  const filtered = portfolioHistory.filter(his => his.date.includes(lm));

  let YTD, oneYear, threeYear, fiveYear, tenYear;
  return { YTD, oneYear, threeYear, fiveYear, tenYear };
}
