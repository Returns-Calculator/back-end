module.exports = {
  validatePortfolioSymbol
};

function validatePortfolioSymbol(portfolio_symbol) {
  const { portfolio_id, symbol_id } = portfolio_symbol;
  let errors = [];
  if (portfolio_id === undefined) {
    errors.push("Please provide portfolio_id");
  }
  if (symbol_id === undefined) {
    errors.push("Please provide symbol_id");
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
