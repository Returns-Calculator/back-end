const db = require("../data/db-config");

module.exports = {
  add,
  find,
  update,
  remove
};

function add(symbol_detail) {
  return db("symbols_details")
    .insert(symbol_detail, ["*"])
    .then(s_d => find({ id: s_d[0].id }).first());
}

function find(filters) {
  // if filters were passed in, search by filter. otherwise return all records. column wise do not return passwords
  if (filters) {
    return db("symbols_details")
      .select("*")
      .where(filters);
  }
  return db("symbols_details").select("*");
}

function update(filter, changes) {
  // only allow one update at a time, so uses .first()
  return db("symbols_details")
    .update(changes, ["*"])
    .where(filter)
    .then(s_d => find({ id: s_d[0].id }).first());
}

function remove(filter) {
  // only returns the number of deleted entries
  return db("symbols_details")
    .where(filter)
    .del();
}
