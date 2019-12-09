module.exports = {
  validateSymbol,
  filterSymbolPut
};

function validateSymbol(symbol_obj) {
  const { symbol, last_refreshed } = symbol_obj;
  let errors = [];
  if (symbol === undefined) {
    errors.push("Please provide symbol string");
  }
  if (last_refreshed === undefined) {
    errors.push(
      "Please provide the last_refreshed date of the symbol in YYYY-MM-DD format. Ex: 2019-12-05"
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

function filterSymbolPut(body) {
  const { last_refreshed } = body;
  return last_refreshed === undefined ? {} : { last_refreshed };
}
