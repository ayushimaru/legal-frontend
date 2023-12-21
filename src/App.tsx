import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Clients from './components/ClientList';
import Protected from './components/Protected';
import ClientAdd from './components/ClientAdd';
import Cases from './components/Cases/CasesList';
import CasesAdd from './components/Cases/CasesAdd';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Navigate to={"/"} />} />
        <Route path="clients" element={<Protected Component={Clients} />} />
        <Route path="clientData" element={<Protected Component={ClientAdd} />} />
        <Route path="clientData/:id" element={<Protected Component={ClientAdd} />} />
        <Route path="cases" element={<Protected Component={Cases} />} />
        <Route path="caseData" element={<Protected Component={CasesAdd} />} />
        <Route path="caseData/:id" element={<Protected Component={CasesAdd} />} />
      </Routes>
    </Router></>
    
  );
}

export default App;
