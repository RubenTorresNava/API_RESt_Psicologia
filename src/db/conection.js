import { createPool } from "mysql2/promise";
//import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USER } from "../config.js";

export const connection = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "psicologia",
    port: 3306,
});