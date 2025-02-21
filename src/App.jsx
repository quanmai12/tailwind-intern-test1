import React, { useEffect } from 'react';
import { 
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import To_Do_List from './pages/To_Do_List';
import Details from "./pages/Details";
import Dashboard from "./pages/Dashboard";
import TaskList from './pages/TaskList';
function App() {

  const location = useLocation();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
console.log("Dữ liệu từ localStorage:", storedTasks);

  

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/" element={<To_Do_List tasks= {tasks} />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;


