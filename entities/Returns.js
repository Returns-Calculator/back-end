module.exports = {
  getLastMonth,
  calculateReturns,
  calculatePortfolioReturns
};

function getLastMonth() {
  // Date calculation
  // ex: thisMonth is 2019-11, lastMonth is 10, lastMonthYear is 2019
  // ex: thisMonth is 2019-01, lastMonth is 12, lastMonthYear is 2018
  let thisMonth = new Date();
  let lastMonthYear = thisMonth.getFullYear();
  let lastMonth = String(thisMonth.getMonth()).padStart(2, "0");
  if (String(thisMonth.getMonth()) === "0") {
    lastMonth = 12;
    lastMonthYear -= 1;
  }

  return [lastMonth, lastMonthYear];
}

function calculateReturns(history, lastMonth, lastMonthYear) {
  const lastMonthRecord = history.find(his =>
    his.date.includes(`${lastMonthYear}-${lastMonth}`)
  );
  let lastMonthAdjustedPrice = null;
  if (lastMonthRecord) {
    lastMonthAdjustedPrice = lastMonthRecord.adjusted_close;
  }
  if (!lastMonthRecord) {
    return {
      message:
        "No records found for latest month, please retrieve adjusted_close prices from AlphaVantage"
    };
  }
  let YTD, oneYear, threeYear, fiveYear, tenYear;
  const begYear =
    lastMonth === "12" ? `${lastMonthYear}-12` : `${lastMonthYear - 1}-12`;
  const begYearRecord = history.find(his => his.date.includes(begYear));
  if (begYearRecord) {
    const beginPrice = begYearRecord.adjusted_close;
    YTD = (lastMonthAdjustedPrice - beginPrice) / beginPrice;
  }
  const oneYearAgo = `${lastMonthYear - 1}-${lastMonth}`;
  const oneYearRecord = history.find(his => his.date.includes(oneYearAgo));
  if (oneYearRecord) {
    const oneYearPrice = oneYearRecord.adjusted_close;
    oneYear = (lastMonthAdjustedPrice - oneYearPrice) / oneYearPrice;
  }
  const threeYearAgo = `${lastMonthYear - 3}-${lastMonth}`;
  const threeYearRecord = history.find(his => his.date.includes(threeYearAgo));
  if (threeYearRecord) {
    const threeYearPrice = threeYearRecord.adjusted_close;
    let threeYearTotal =
      (lastMonthAdjustedPrice - threeYearPrice) / threeYearPrice;
    threeYear = Math.pow(1 + threeYearTotal, 1 / 3) - 1;
  }
  const fiveYearAgo = `${lastMonthYear - 5}-${lastMonth}`;
  const fiveYearRecord = history.find(his => his.date.includes(fiveYearAgo));
  if (fiveYearRecord) {
    const fiveYearPrice = fiveYearRecord.adjusted_close;
    let fiveYearTotal =
      (lastMonthAdjustedPrice - fiveYearPrice) / fiveYearPrice;
    fiveYear = Math.pow(1 + fiveYearTotal, 1 / 5) - 1;
  }
  const tenYearAgo = `${lastMonthYear - 10}-${lastMonth}`;
  const tenYearRecord = history.find(his => his.date.includes(tenYearAgo));
  if (tenYearRecord) {
    const tenYearPrice = tenYearRecord.adjusted_close;
    let tenYearTotal = (lastMonthAdjustedPrice - tenYearPrice) / tenYearPrice;
    tenYear = Math.pow(1 + tenYearTotal, 1 / 10) - 1;
  }
  return { YTD, oneYear, threeYear, fiveYear, tenYear };
}

function calculatePortfolioReturns(
  portfolioHoldings,
  portfolioHistory,
  lastMonth,
  lastMonthYear
) {
  let YTD, oneYear, threeYear, fiveYear, tenYear;
}
