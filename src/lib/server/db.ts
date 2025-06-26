import { Database } from "sqlite3";

const db = new Database(":memory");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, password TEXT UNIQUE)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, description TEXT, completed BOOLEAN, FOREIGN KEY(user_id) REFERENCES users(id))"
  );
});
