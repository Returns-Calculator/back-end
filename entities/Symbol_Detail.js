module.exports = {
  validateSymbolDetail,
  filterSymbolDetailPut,
  parseDetails,
  getTodayDate
};

function validateSymbolDetail(symbol_detail) {
  const { symbol, date, adjusted_close, close, dividend } = symbol_detail;
  let errors = [];
  if (!symbol) {
    errors.push("Please provide the *symbol*");
  }
  if (!date) {
    errors.push(
      "Please provide the *date* of the data in YYYY-MM-DD format, ex: 2018-12-31"
    );
  }
  if (!adjusted_close) {
    errors.push(
      "Please provide the *adjusted_close* on the date provided for the symbol"
    );
  }
  if (!close) {
    errors.push(
      "Please provide the unadjusted *close* on the date provided for the symbol"
    );
  }
  if (!dividend) {
    errors.push(
      "Please provide the *dividend* on the date provided for the symbol"
    );
  }
  let success = errors.length === 0;
  let message = success
    ? ""
    : "There is missing information for the request. See errors for details";
  return {
    success,
    message,
    errors
  };
}

// Do not allow changes to symbol or date
function filterSymbolDetailPut(body) {
  const { adjusted_close, close, dividend } = body;
  let filtered = { adjusted_close, close, dividend };
  for (const k of Object.keys(filtered)) {
    if (filtered[k] === undefined) delete filtered[k];
  }
  return filtered;
}

function parseDetails(alphaVantageHistory, databaseHistory) {
  const data = alphaVantageHistory["Monthly Adjusted Time Series"];
  const symbol = alphaVantageHistory["Meta Data"]["2. Symbol"];
  const thisMonth = getTodayDate()[1];

  let addArray = [];
  let updateArray = [];
  let notUpdated = [];

  const dbHistoryObj = {};

  // Create object for databaseHistory for deep compare
  for (const i of databaseHistory) {
    const { id, created_at, updated_at, ...record } = i;
    dbHistoryObj[record.date] = record;
  }

  for (const i in data) {
    // Exclude mid month data
    if (i < thisMonth) {
      const record = {
        symbol,
        date: i,
        adjusted_close: data[i]["5. adjusted close"],
        close: data[i]["4. close"],
        dividend: data[i]["7. dividend amount"]
      };
      // If not in databaseHistory, push to addArray
      if (!dbHistoryObj[i]) {
        addArray.push(record);
      }
      // If in databaseHistory but different, push to updateArray
      else if (deepCompareObj(record, dbHistoryObj[i]) === false) {
        updateArray.push(record);
      }
      // Otherwise add to notUpdated array
      else notUpdated.push(record);
    }
  }

  return [addArray, updateArray, notUpdated];
}

function getTodayDate() {
  // Date calculation
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  let thisMonth = yyyy + "-" + mm + "-01";

  return [today, thisMonth];
}

function deepCompareObj(a, b) {
  if (a && b && typeof a == "object" && typeof b == "object") {
    if (Object.keys(a).length != Object.keys(b).length) return false;
    for (let key in a) if (!deepCompareObj(a[key], b[key])) return false;
    return true;
  } else return a === b;
}
