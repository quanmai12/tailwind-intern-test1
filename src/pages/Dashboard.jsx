import { useState, useEffect } from "react";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:5174/tasks") // Điều chỉnh URL nếu cần
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "Hoàn thành").length;
  const pendingTasks = tasks.filter(task => task.status === "Chưa làm").length;
  const inProgressTasks = tasks.filter(task => task.status === "Đang làm").length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Công Việc</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Tổng số công việc</h2>
          <p className="text-xl">{totalTasks}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Hoàn thành</h2>
          <p className="text-xl">{completedTasks}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Đang làm</h2>
          <p className="text-xl">{inProgressTasks}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Chưa làm</h2>
          <p className="text-xl">{pendingTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
