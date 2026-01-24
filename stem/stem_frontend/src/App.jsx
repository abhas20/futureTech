import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard';
import MathLearning from './pages/MathLearning';
import ChemistryLab from './pages/ChemistryLab';
import PhysicsLab from './pages/PhysicsLab';
import ExperimentDetail from './pages/ExperimentDetail';
import AITutor from './pages/AITutor';
import ProgressTracker from './pages/ProgressTracker';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/math" element={<MathLearning />} />
          <Route path="/chemistry" element={<ChemistryLab />} />
          <Route path="/physics" element={<PhysicsLab />} />
          <Route
            path="/experiment/:subject/:id"
            element={<ExperimentDetail />}
          />
          <Route path="/tutor" element={<AITutor />} />
          {/* <Route path="/progress" element={<ProgressTracker />} /> */}
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
