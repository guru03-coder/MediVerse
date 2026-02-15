import uuid
from database import get_db_connection

def add_doctor(name: str, department_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    doctor_id = str(uuid.uuid4())
    
    try:
        cursor.execute(
            'INSERT INTO doctors (id, name, department_id, is_active) VALUES (?, ?, ?, 1)',
            (doctor_id, name, department_id)
        )
        conn.commit()
        return {"id": doctor_id, "name": name, "department_id": department_id, "is_active": True}
    except Exception as e:
        print(f"Error adding doctor: {e}")
        return None
    finally:
        conn.close()

def toggle_doctor_activation(doctor_id: str, is_active: bool):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'UPDATE doctors SET is_active = ? WHERE id = ?',
            (is_active, doctor_id)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"Error toggling doctor: {e}")
        return False
    finally:
        conn.close()

def get_active_doctors_count(department_id: str) -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if department_id:
             cursor.execute(
                'SELECT count(*) FROM doctors WHERE department_id = ? AND is_active = 1',
                (department_id,)
            )
        else:
             cursor.execute('SELECT count(*) FROM doctors WHERE is_active = 1')
             
        return cursor.fetchone()[0]
    except Exception as e:
        print(f"Error counting active doctors: {e}")
        return 0
    finally:
        conn.close()

def get_doctors_by_department(department_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM doctors WHERE department_id = ?', (department_id,))
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()
