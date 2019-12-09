module.exports = {
  validateSymbolDetail,
  filterSymbolDetailPut
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
