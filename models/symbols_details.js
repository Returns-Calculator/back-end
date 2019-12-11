const db = require("../data/db-config");

module.exports = {
  add,
  addMany,
  find,
  update,
  remove
};

function add(symbol_detail) {
  return db("symbols_details")
    .insert(symbol_detail, ["*"])
    .then(s_d => find({ id: s_d[0].id }).first());
}

function addMany(symbol_details) {
  return db("symbols_details")
    .insert(symbol_details, ["*"])
    .then(s_ds => {
      let ids = s_ds.map(detail => detail.id);
      return find({ many_ids: ids });
    });
}

function find(filters) {
  // if filters were passed in, search by filter. otherwise return all records
  if (filters) {
    // if passing in ids as an array, use whereIn. Used for grouped record adds
    if (filters.many_ids) {
      return db("symbols_details")
        .select("*")
        .whereIn("id", filters.many_ids)
        .orderBy(["symbol", { column: "date", order: "desc" }]);
    }
    return db("symbols_details")
      .select("*")
      .where(filters)
      .orderBy(["symbol", { column: "date", order: "desc" }]);
  }
  return db("symbols_details")
    .select("*")
    .orderBy(["symbol", { column: "date", order: "desc" }]);
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
