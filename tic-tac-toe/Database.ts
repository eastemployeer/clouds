import Knex from "knex";
import dotenv from "dotenv";

export * from "./DatabasedType";

dotenv.config();

/**
 * Types of tables are in /types/Knex.d.ts
 */
const Database = Knex({
  client: "pg",
  connection: {
    host: "db1",
    user: "tictactoe",
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
  },
  pool: {
    min: 0,
    max: 7,
  },
  log: {
    warn(message: any) {
      console.warn("Knex warn: ", message);
    },
    error(message: any) {
      console.warn("Knex error: ", message);
    },
    deprecate(message: any) {
      console.warn("Knex deprecate: ", message);
    },
    debug(message: any) {
      console.warn("Knex debug: ", message);
    },
  },
});

export default Database;
