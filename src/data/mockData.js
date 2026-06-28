// ── Medications catalogue ─────────────────────────────────────
export const medications = [
  { id: 1, name: "Metformin",    form: "Tablet", strength: "500mg", unit: "mg" },
  { id: 2, name: "Amlodipine",  form: "Tablet", strength: "5mg",   unit: "mg" },
  { id: 3, name: "Lisinopril",  form: "Tablet", strength: "10mg",  unit: "mg" },
  { id: 4, name: "Atorvastatin",form: "Tablet", strength: "20mg",  unit: "mg" },
];

// ── Prescriptions for current patient ────────────────────────
export const prescriptions = [
  { id: 1, medId: 1, dose: "500mg", frequency: "Twice daily", times: ["7:00 AM","7:00 PM"], startDate: "2024-12-01", endDate: "2025-06-01", notes: "Take with food", stock: 5 },
  { id: 2, medId: 2, dose: "5mg",   frequency: "Once daily",  times: ["8:00 AM"],            startDate: "2025-01-10", endDate: "2025-07-10", notes: "",            stock: 28 },
  { id: 3, medId: 3, dose: "10mg",  frequency: "Once daily",  times: ["12:00 PM"],           startDate: "2025-01-10", endDate: "2025-07-10", notes: "",            stock: 30 },
  { id: 4, medId: 4, dose: "20mg",  frequency: "Once daily",  times: ["9:00 PM"],            startDate: "2025-02-01", endDate: "2025-08-01", notes: "Take at night",stock: 22 },
];

// ── Today's dose log ──────────────────────────────────────────
export const todayDoses = [
  { id: 1, prescriptionId: 1, medName: "Metformin",    dose: "500mg", time: "7:00 AM",  status: "taken",    takenAt: "7:04 AM",  color: "blue" },
  { id: 2, prescriptionId: 2, medName: "Amlodipine",  dose: "5mg",   time: "8:00 AM",  status: "taken",    takenAt: "8:11 AM",  color: "teal" },
  { id: 3, prescriptionId: 3, medName: "Lisinopril",  dose: "10mg",  time: "12:00 PM", status: "upcoming", takenAt: null,       color: "amber" },
  { id: 4, prescriptionId: 4, medName: "Atorvastatin",dose: "20mg",  time: "9:00 PM",  status: "upcoming", takenAt: null,       color: "red" },
];

// ── Adherence data per medication (last 30 days) ──────────────
export const adherenceByMed = [
  { name: "Metformin",     pct: 90, taken: 27, total: 30 },
  { name: "Amlodipine",   pct: 75, taken: 22, total: 30 },
  { name: "Lisinopril",   pct: 88, taken: 26, total: 30 },
  { name: "Atorvastatin", pct: 65, taken: 19, total: 30 },
];

// ── Weekly adherence ─────────────────────────────────────────
export const weeklyAdherence = [
  { day: "Mon", pct: 100 },
  { day: "Tue", pct: 75  },
  { day: "Wed", pct: 100 },
  { day: "Thu", pct: 100 },
  { day: "Fri", pct: 50  },
  { day: "Sat", pct: 100 },
  { day: "Sun", pct: 88  },
];

// ── Caregiver's patient list ──────────────────────────────────
export const caregiverPatients = [
  { id: "P-2847", name: "Lee Chen",    age: 58, meds: 4, adh30: 88, lastDose: "8:00 AM today",      nextDose: "Lisinopril at 12:00 PM", status: "good" },
  { id: "P-0034", name: "Tan Ah Kow", age: 74, meds: 5, adh30: 60, lastDose: "Yesterday 9:00 PM",   nextDose: "Metformin at 7:00 AM",   status: "warn" },
  { id: "P-1198", name: "Betty Lim",  age: 81, meds: 3, adh30: 45, lastDose: "2 days ago",           nextDose: "Overdue: Amlodipine",    status: "risk" },
];

// ── Admin patient list ────────────────────────────────────────
export const adminPatients = [
  { id: "P-2847", name: "Lee Chen",    age: 58, meds: 4, adh: 88, caregiver: "Maria L.",  lastVisit: "2025-05-10" },
  { id: "P-1923", name: "Ahmad Razak", age: 72, meds: 6, adh: 55, caregiver: "—",         lastVisit: "2025-04-28" },
  { id: "P-3301", name: "Siti Rahmah", age: 65, meds: 3, adh: 95, caregiver: "Farid R.",  lastVisit: "2025-05-15" },
  { id: "P-4421", name: "Wong Beng",   age: 80, meds: 5, adh: 42, caregiver: "—",         lastVisit: "2025-04-01" },
  { id: "P-2109", name: "Priya Nair",  age: 54, meds: 2, adh: 100,caregiver: "Dr. Kumar", lastVisit: "2025-05-20" },
];

// ── Notifications ─────────────────────────────────────────────
export const notifications = [
  { id: 1, type: "refill", text: "Metformin refill: only 5 days supply left",         time: "Today, 8:00 AM",    read: false },
  { id: 2, type: "link",   text: "Caregiver Maria linked — she can view your adherence", time: "Yesterday, 3:42 PM", read: false },
  { id: 3, type: "missed", text: "You missed Amlodipine 5mg last Friday",             time: "Fri, 9:00 PM",      read: true  },
];
