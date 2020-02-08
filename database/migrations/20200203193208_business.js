
exports.up = async function (knex) {
    await knex.schema.createTable("business", (table) => {
        table.increments("id").primary
        table.string("username", 280).notNullable().unique()
        table.string("password", 280).notNullable()
        table.string("name", 280)
        table.string("address", 280)
        table.bigint("phone")
        table.string("email", 280)
    })
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("business")
};