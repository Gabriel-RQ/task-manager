import sqlite from "sqlite3";
const { Database } = sqlite;

const db = new Database(":memory");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, password TEXT UNIQUE)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, description TEXT, completed BOOLEAN, FOREIGN KEY(user_id) REFERENCES users(id))"
  );
});

export function checkUserExists(name: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) as count FROM users WHERE name = ?",
      [name],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve((row as any).count > 0);
        }
      }
    );
  });
}

export function verifyLogin(name: string, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) as count FROM users WHERE name = ? AND password = ?",
      [name, password],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve((row as any).count > 0);
        }
      }
    );
  });
}

export function insertUser(name: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (name, password) VALUES (?, ?)",
      [name, password],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}
