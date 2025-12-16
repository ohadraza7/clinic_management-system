import mysql from "mysql2";
console.log("Connecting to database...");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "clinicdb",
});
db.getConnection((err, connection) => {
  if (err) {
    console.log("DB Connection Error: ", err);
  } else {
    console.log("DB Connected Successfully");
    connection.release();
  }
});

export default db;
