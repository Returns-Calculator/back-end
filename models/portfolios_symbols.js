const db = require("../data/db-config");

module.exports = {
  add,
  find,
  update,
  remove
};

function add(portfolios_symbols) {
  return db("portfolios_symbols")
    .insert(portfolios_symbols, ["*"])
    .then(p_s => find({ "p_s.id": p_s[0].id }).first());
}

function find(filters) {
  // if filters were passed in, search by filter. otherwise return all records. column wise do not return passwords
  if (filters) {
    return db("portfolios_symbols as p_s")
      .leftJoin("portfolios as p", "p.id", "p_s.portfolio_id")
      .leftJoin("symbols as s", "s.id", "p_s.symbol_id")
      .select(
        "p_s.id",
        "p_s.portfolio_id",
        "p_s.symbol_id",
        "p_s.created_at",
        "p_s.updated_at",
        "p.name",
        "s.symbol"
      )
      .where(filters);
  }
  return db("portfolios_symbols as p_s")
    .leftJoin("portfolios as p", "p.id", "p_s.portfolio_id")
    .leftJoin("symbols as s", "s.id", "p_s.symbol_id")
    .select(
      "p_s.id",
      "p_s.portfolio_id",
      "p_s.symbol_id",
      "p_s.created_at",
      "p_s.updated_at",
      "p.name",
      "s.symbol"
    );
}

function update(filter, changes) {
  // only allow one update at a time, so uses .first()
  return db("portfolios_symbols")
    .update(changes, ["*"])
    .where(filter)
    .then(p_s => find({ "p_s.id": p_s[0].id }).first());
}

function remove(filter) {
  // only returns the number of deleted entries
  return db("portfolios_symbols as p_s")
    .where(filter)
    .del();
}
