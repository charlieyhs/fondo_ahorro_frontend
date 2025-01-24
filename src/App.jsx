import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Home from './components/Home';
import { useEffect } from 'react';

function App() {
  useEffect(() =>{
    document.title= 'Fondo ahorro';
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />}/>
      </Routes>
    </Router>
  );
}

export default App;