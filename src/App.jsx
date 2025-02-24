import React, { useState, useEffect } from 'react';
import { 
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import To_Do_List from './pages/To_Do_List';
import Dashboard from "./pages/Dashboard";
import TaskDetails from './pages/TaskDetails';
import Sidebar from './partials/Sidebar';  
import Header from './partials/Header';  
import AddNewList from './pages/AddNewList'
function App() {

  const location = useLocation();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
console.log("Dữ liệu từ localStorage:", storedTasks);

  

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/todolist" element={<To_Do_List tasks= {tasks} />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/details/:id" element={<TaskDetails />} />
        <Route path="/addnewlist" element={<AddNewList />} />
      </Routes>
    </>
  );

}

export default App;


