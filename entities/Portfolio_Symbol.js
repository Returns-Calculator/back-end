module.exports = {
  validatePortfolioSymbol,
  filterPortfolioSymbolPut
};

function validatePortfolioSymbol(portfolio_symbol) {
  const { portfolio_id, symbol_id, share_count } = portfolio_symbol;
  let errors = [];
  if (portfolio_id === undefined) {
    errors.push("Please provide *portfolio_id*");
  }
  if (symbol_id === undefined) {
    errors.push("Please provide *symbol_id*");
  }
  if (share_count === undefined) {
    errors.push("Please provide *share_count*");
  }
  if (typeof share_count !== "number" || share_count < 0) {
    errors.push("*share_count* must be a decimal larger than 0");
  }
  let success = errors.length === 0;
  let message = success
    ? ""
    : "There is missing or erroneous information for the request. See errors for details";
  return {
    success,
    message,
    errors
  };
}

// Do not allow changes to symbol or date
function filterPortfolioSymbolPut(body) {
  const { share_count } = body;
  return share_count === undefined ? {} : { share_count };
}
