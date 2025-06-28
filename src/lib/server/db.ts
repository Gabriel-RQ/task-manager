import sqlite from "sqlite3";
const { Database } = sqlite;

const db = new Database(":memory");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, password TEXT UNIQUE)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, description TEXT, completed BOOLEAN DEFAULT FALSE, date DATE, created_at DATE DEFAULT CURRENT_DATE, FOREIGN KEY(user_id) REFERENCES users(id))"
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

export function getUserId(name: string): Promise<number | null> {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id FROM users WHERE name = ? LIMIT 1",
      [name],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? (row as any).id : null);
        }
      }
    );
  });
}

export function getTasks(userId: number): Promise<Task[]> {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Task[]);
      }
    });
  });
}

export function deleteTask(taskId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function toggleTaskCompletion(
  taskId: number,
  completed: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      [completed, taskId],
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

export function insertTask({
  user_id,
  title,
  description,
  date,
}: Omit<Task, "id" | "created_at" | "completed">): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO tasks (user_id, title, description, date) VALUES (?, ?, ?, ?)",
      [user_id, title, description, date],
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

export function updateTask(
  taskId: number,
  updates: Partial<Omit<Task, "id" | "user_id" | "created_at">>
): Promise<void> {
  const { title, description, date, completed } = updates;
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE tasks SET 
        title = COALESCE(?, title), 
        description = COALESCE(?, description), 
        date = COALESCE(?, date), 
        completed = COALESCE(?, completed) 
      WHERE id = ?`,
      [title, description, date, completed, taskId],
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
