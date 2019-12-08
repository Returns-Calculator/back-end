const db = require("../data/db-config");

module.exports = {
  add,
  find,
  update,
  remove
};

function add(portfolio) {
  return db("portfolios")
    .insert(portfolio, ["*"])
    .then(p => find({ id: p[0].id }).first());
}

function find(filters) {
  // if filters were passed in, search by filter. otherwise return all records. column wise do not return passwords
  if (filters) {
    return db("portfolios")
      .select("*")
      .where(filters);
  }
  return db("portfolios").select("*");
}

function update(filter, changes) {
  // only allow one update at a time, so uses .first()
  return db("portfolios")
    .update(changes, ["*"])
    .where(filter)
    .then(p => find({ id: p[0].id }).first());
}

function remove(filter) {
  // only returns the number of deleted entries
  return db("portfolios")
    .where(filter)
    .del();
}
