
exports.up = async function (knex) {
    await knex.schema.createTable("food_request", (table) => {
        table.increments("id")
        table.string("type", 280).notNullable
        table.float("servings", 280)
        table.string("pickup_time")
        table.string("description", 500)
        table.boolean('completed').defaultTo(false);

        table.integer("business_id")
            .notNullable()
            .references("id")
            .inTable("business")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")

        table.integer("volunteer_id")
            .notNullable()
            .references("id")
            .inTable("volunteer")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
    })
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("food_request")
};
