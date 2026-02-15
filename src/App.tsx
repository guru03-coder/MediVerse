import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NurseDashboard } from './pages/NurseDashboard';
import { PatientIntake } from './pages/PatientIntake';
import { TriageResult } from './pages/TriageResult';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/nurse" element={<NurseDashboard />} />
        <Route path="/intake" element={<PatientIntake />} />
        <Route path="/triage-result" element={<TriageResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
