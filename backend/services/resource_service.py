
# In-memory store for department availability
# True = Available, False = Busy/Full
dept_availability = {
    "Cardiology": True,
    "Neurology": True,
    "Orthopedics": True,
    "General": True,
    "Pediatrics": True
}

def get_dept_availability():
    return dept_availability

def set_dept_availability(dept: str, is_available: bool):
    if dept in dept_availability:
        dept_availability[dept] = is_available
        return True
    return False
