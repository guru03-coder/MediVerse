import sqlite3
import os

DB_NAME = "triagex.db"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, DB_NAME)

def update_schema():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("Checking schema...")
    
    # Check if 'name' column exists in patients table
    cursor.execute("PRAGMA table_info(patients)")
    columns = [info[1] for info in cursor.fetchall()]
    
    new_columns = {
        "name": "TEXT",
        "age": "INTEGER",
        "gender": "TEXT",
        "symptoms": "TEXT",
        "vitals": "TEXT" # JSON string or similar
    }
    
    for col, dtype in new_columns.items():
        if col not in columns:
            print(f"Adding column '{col}' to patients table...")
            try:
                cursor.execute(f"ALTER TABLE patients ADD COLUMN {col} {dtype}")
            except Exception as e:
                print(f"Error adding {col}: {e}")
        else:
            print(f"Column '{col}' already exists.")
            
    conn.commit()
    conn.close()
    print("Schema update complete.")

if __name__ == "__main__":
    update_schema()
