import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NurseDashboard } from './pages/NurseDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/nurse" element={<NurseDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
