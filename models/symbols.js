const db = require("../data/db-config");

module.exports = {
  add,
  find,
  update,
  remove
};

function add(symbol) {
  return db("symbols")
    .insert(symbol, ["*"])
    .then(s => find({ id: s[0].id }).first());
}

function find(filters) {
  // if filters were passed in, search by filter. otherwise return all records. column wise do not return passwords
  if (filters) {
    return db("symbols")
      .select("*")
      .where(filters);
  }
  return db("symbols").select("*");
}

function update(filter, changes) {
  // only allow one update at a time, so uses .first()
  return db("symbols")
    .update(changes, ["*"])
    .where(filter)
    .then(s => find({ id: s[0].id }).first());
}

function remove(filter) {
  // only returns the number of deleted entries
  return db("symbols")
    .where(filter)
    .del();
}
