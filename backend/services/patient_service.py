import uuid
from datetime import datetime
from database import get_db_connection
from services.doctor_service import get_active_doctors_count

# Priority Map
# Critical -> 3, High -> 2, Medium -> 1, Low -> 0
PRIORITY_MAP = {
    "CRITICAL": 3,
    "High": 2,
    "Medium": 1,
    "Low": 0,
    "Stable": 0
}

def admit_patient(patient_data: dict, risk_level: str, recommended_dept: str):
    """
    1. Calculate Priority
    2. Check Dept Availability (Active Doctors > 0)
    3. Assign Dept (Re-route if needed)
    4. Save to DB
    """
    
    # 1. Priority
    # Map risk_level casing if needed (e.g. 'High Risk' -> 'High')
    # Assuming exact match for now or partial
    p_weight = 0
    for key, weight in PRIORITY_MAP.items():
        if key.upper() in risk_level.upper():
            p_weight = weight
            break
            
    # 2. Routing Logic
    assigned_dept = recommended_dept
    
    # Needs: Dept ID for 'recommended_dept' string to check doctors
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM departments WHERE name = ?", (recommended_dept,))
        row = cursor.fetchone()
        
        if row:
            dept_id = row['id']
            # Check Active Doctors
            active_docs = get_active_doctors_count(dept_id)
            
            if active_docs == 0:
                assigned_dept = "General" # Fallback
                # Optional: Append " (Re-routed)" for UI clariy
        else:
            # If dept doesn't match known DB depts, maybe map to General
            assigned_dept = "General"

        # 3. Create Patient
        patient_id = str(uuid.uuid4())
        patient_code = f"P-{str(uuid.uuid4())[:4].upper()}" # Gen random code P-XXXX
        
        cursor.execute('''
            INSERT INTO patients 
            (id, patient_code, risk_level, recommended_department, assigned_department, status, priority_weight)
            VALUES (?, ?, ?, ?, ?, 'waiting', ?)
        ''', (patient_id, patient_code, risk_level, recommended_dept, assigned_dept, p_weight))
        
        conn.commit()
        
        return {
            "id": patient_id,
            "patient_code": patient_code,
            "risk_level": risk_level,
            "assigned_dept": assigned_dept,
            "priority": p_weight,
            "original_dept": recommended_dept
        }
        
    except Exception as e:
        print(f"Error admitting patient: {e}")
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_waiting_patients():
    """
    Returns live queue sorted by Priority DESC, CreatedAt ASC
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            SELECT * FROM patients 
            WHERE status = 'waiting'
            ORDER BY priority_weight DESC, created_at ASC
        ''')
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

def discharge_patient(patient_id: str):
    """
    Marks a patient as discharged/completed.
    Removes them from the active queue views.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if exists
        cursor.execute("SELECT id FROM patients WHERE patient_code = ? OR id = ?", (patient_id, patient_id))
        row = cursor.fetchone()
        if not row:
            return False
            
        real_id = row['id']
        
        cursor.execute('''
            UPDATE patients 
            SET status = 'discharged' 
            WHERE id = ?
        ''', (real_id,))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error discharging patient: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()
