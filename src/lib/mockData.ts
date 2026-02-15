export const MOCK_STATS = {
    departments: {
        "Cardiology": { active_doctors: 3, wait_time: 15, id: "cardio_1", status: "active" },
        "Neurology": { active_doctors: 2, wait_time: 25, id: "neuro_1", status: "active" },
        "Orthopedics": { active_doctors: 4, wait_time: 10, id: "ortho_1", status: "active" },
        "General": { active_doctors: 5, wait_time: 5, id: "gen_1", status: "active" }
    },
    queue: {
        high_risk_waiting: 2
    }
};

export const MOCK_PATIENTS = [
    { id: "p1", patient_code: "P-1024", risk_level: "CRITICAL", assigned_department: "Cardiology", created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: "p2", patient_code: "P-1025", risk_level: "URGENT", assigned_department: "Neurology", created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { id: "p3", patient_code: "P-1026", risk_level: "STABLE", assigned_department: "General", created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
];


export const MOCK_ANALYTICS = {
    risk_distribution: [
        { name: "CRITICAL", value: 12 },
        { name: "High", value: 25 },
        { name: "Low", value: 63 }
    ],
    department_load: [
        { name: "General", value: 45 },
        { name: "Cardio", value: 30 },
        { name: "Neuro", value: 15 },
        { name: "Ortho", value: 10 }
    ],
    patient_attendance: [
        { name: "8am", value: 12 },
        { name: "10am", value: 25 },
        { name: "12pm", value: 45 },
        { name: "2pm", value: 30 },
        { name: "4pm", value: 15 }
    ],
    model_accuracy: [
        { name: "Precision", value: 94 },
        { name: "Recall", value: 92 },
        { name: "F1 Score", value: 93 }
    ]
};
