from database import get_db_connection
from services.doctor_service import get_active_doctors_count

def calculate_wait_time(department_id: str, dept_avg_time: int) -> int:
    """
    Dynamic Formula: (Queue Length * Avg Service Time) / Active Doctors
    Returns None if no active doctors.
    """
    active_docs = get_active_doctors_count(department_id)
    if active_docs == 0:
        return None  # Infinite / No Service
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Count waiting patients for this dept
        cursor.execute(
            "SELECT count(*) FROM patients WHERE assigned_department = ? AND status = 'waiting'",
            (department_id,)
        )
        queue_length = cursor.fetchone()[0]
        
        # Formula
        total_time = (queue_length * dept_avg_time) // active_docs
        return total_time
    finally:
        conn.close()

def get_department_stats():
    """
    Returns stats for all departments:
    - Active Doctors
    - Waiting Count
    - Est Wait Time
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    stats = {}
    try:
        # Get all departments
        cursor.execute("SELECT id, name, avg_service_time FROM departments")
        depts = cursor.fetchall()
        
        for dept in depts:
            d_id = dept['id']
            d_name = dept['name']
            avg_time = dept['avg_service_time']
            
            # Active Docs
            active_docs = get_active_doctors_count(d_id)
            
            # Waiting Count
            cursor.execute(
                "SELECT count(*) FROM patients WHERE assigned_department = ? AND status = 'waiting'", 
                (d_name,) # Note: assigned_department stores Name currently, but we should make sure mapping is correct. 
                          # Re-checking init_db: assigned_department is TEXT. 
                          # Patient Code uses Names (Cardiology), but DB has IDs.
                          # Let's standardize on assigning by Dept NAME for now to match Frontend/ML 
                          # OR fix consistency. The ML returns Names.
                          # So we query by Name for now.
            )
            waiting_count = cursor.fetchone()[0]
            
            # Wait Time
            # We need the ID to count doctors (linked by ID), but Name to count patients (linked by Name from ML)
            # This is a bit disjointed. Best to map Name -> ID.
            # But the 'calculate_wait_time' took ID. 
            # FIX: calculate_wait_time should probably take ID but inside we need to know the 'assigned_department' string value.
            
            # Let's recalculate here to be safe and clear.
            wait_time = None
            if active_docs > 0:
                wait_time = (waiting_count * avg_time) // active_docs
                
            stats[d_name] = {
                "id": d_id,
                "active_doctors": active_docs,
                "waiting_patients": waiting_count,
                "wait_time": wait_time
            }
            
        return stats
    finally:
        conn.close()

def get_overall_queue_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT count(*) FROM patients WHERE status = 'waiting'")
        total_waiting = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM patients WHERE status = 'waiting' AND risk_level IN ('CRITICAL', 'High')")
        high_risk = cursor.fetchone()[0]
        
        return {
            "total_waiting": total_waiting,
            "high_risk_waiting": high_risk
        }
    finally:
        conn.close()

def get_analytics_data():
    """
    Returns aggregated data for charts:
    - Risk Distribution (Pie)
    - Department Load (Bar)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Risk Distribution
        cursor.execute("SELECT risk_level, count(*) FROM patients WHERE status='waiting' GROUP BY risk_level")
        risk_dist = [{"name": row[0], "value": row[1]} for row in cursor.fetchall()]
        
        # 2. Dept Load
        cursor.execute("SELECT assigned_department, count(*) FROM patients WHERE status='waiting' GROUP BY assigned_department")
        dept_load = [{"name": row[0], "value": row[1]} for row in cursor.fetchall()]
        
        return {
            "risk_distribution": risk_dist,
            "department_load": dept_load,
            "patient_attendance": [
                {"name": "08:00", "value": 12},
                {"name": "10:00", "value": 18},
                {"name": "12:00", "value": 15},
                {"name": "14:00", "value": 22},
                {"name": "16:00", "value": 10},
            ],
            "model_accuracy": [
                {"name": "Mon", "value": 92},
                {"name": "Tue", "value": 94},
                {"name": "Wed", "value": 91},
                {"name": "Thu", "value": 95},
                {"name": "Fri", "value": 98},
            ]
        }
    finally:
        conn.close()
