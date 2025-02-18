import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5001/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách công việc:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Danh sách công việc</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tên công việc</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Thời gian tạo</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id} className="border">
                <td className="border p-2">
                  <Link to={`/tasks/${task.id}`} className="text-blue-500 underline">
                    {task.name}
                  </Link>
                </td>
                <td className="border p-2">{task.status}</td>
                <td className="border p-2">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">Không có công việc nào!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
