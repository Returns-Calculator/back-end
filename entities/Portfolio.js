module.exports = {
  validatePortfolio,
  filterPortfolioPut
};

function validatePortfolio(portfolio) {
  const { user_id, name } = portfolio;
  let errors = [];
  if (user_id === undefined) {
    errors.push("Please provide the user_id of the owner of the portfolio");
  }
  if (!name) {
    errors.push("Please provide the name of the portfolio");
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

function filterPortfolioPut(body) {
  const { name } = body;
  return name === undefined ? {} : { name };
}
