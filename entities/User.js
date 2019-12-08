module.exports = {
  validateUser,
  filterPutBody,
  mapPortfolio
};

function validateUser(user) {
  const { email } = user;
  let errors = [];
  if (!email) {
    errors.push("Please provide the email of the User");
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

function filterPutBody(body) {
  const { email, first_name, last_name } = body;
  let filtered = { email, first_name, last_name };
  for (const k of Object.keys(filtered)) {
    if (filtered[k] === undefined) delete filtered[k];
  }
  return filtered;
}

function mapPortfolio(portfolios) {
  // If user has portfolios, map portfolio info to conform names
  // to front end component structure
  let portfolioInfo = portfolios.map(port => {
    const { id, name, created_at, updated_at } = port;
    return {
      id,
      name,
      created_at,
      updated_at
    };
  });
  return portfolioInfo;
}
