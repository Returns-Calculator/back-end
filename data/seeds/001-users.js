exports.seed = function(knex) {
  return knex("users").insert([
    {
      email: "test@test.com",
      first_name: "test",
      last_name: "tester"
    }
  ]);
};
