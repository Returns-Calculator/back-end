const db = require("../data/db-config");

module.exports = {
  add,
  find,
  update,
  remove
};

function add(user) {
  return db("users")
    .insert(user, ["*"])
    .then(u => find({ id: u[0].id }).first());
}

function find(filters) {
  // if filters were passed in, search by filter. otherwise return all records. column wise do not return passwords
  if (filters) {
    return db("users")
      .select("*")
      .where(filters);
  }
  return db("users").select("*");
}

function update(filter, changes) {
  // only allow one update at a time, so uses .first()
  return db("users")
    .update(changes, ["*"])
    .where(filter)
    .then(u => find({ id: u[0].id }).first());
}

function remove(filter) {
  // only returns the number of deleted entries
  return db("users")
    .where(filter)
    .del();
}
