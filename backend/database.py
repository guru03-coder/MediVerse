import sqlite3
import os
import uuid
from datetime import datetime

DB_NAME = "triagex.db"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, DB_NAME)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Departments Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS departments (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            avg_service_time INTEGER DEFAULT 15
        )
    ''')

    # 2. Doctors Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            department_id TEXT,
            is_active BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments (id)
        )
    ''')

    # 3. Patients Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY,
            patient_code TEXT,
            risk_level TEXT,
            recommended_department TEXT,
            assigned_department TEXT,
            status TEXT DEFAULT 'waiting', -- waiting, assigned, completed
            priority_weight INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seed Departments if empty
    cursor.execute('SELECT count(*) FROM departments')
    if cursor.fetchone()[0] == 0:
        depts = [
            ("Cardiology", 20),
            ("Neurology", 25),
            ("Orthopedics", 15),
            ("General", 10),
            ("Pediatrics", 15)
        ]
        for name, time in depts:
            dept_id = str(uuid.uuid4())
            cursor.execute('INSERT INTO departments (id, name, avg_service_time) VALUES (?, ?, ?)',
                           (dept_id, name, time))
        print("✅ Seeded Departments")

    conn.commit()
    conn.close()
    print(f"✅ Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
