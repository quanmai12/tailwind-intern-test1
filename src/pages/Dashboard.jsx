import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(""); // Trạng thái hiển thị bảng
  const [filteredTasks, setFilteredTasks] = useState([]); // Danh sách công việc lọc

  const [selectedTask, setSelectedTask] = useState(null); // Công việc được chọn
  const navigate = useNavigate(); // Điều hướng trang

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5173/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Hoàn thành").length;
  const pendingTasks = tasks.filter((task) => task.status === "Chưa làm").length;
  const inProgressTasks = tasks.filter((task) => task.status === "Đang làm").length;

  // Hàm xử lý click vào mục thống kê
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(""); // Nếu đang mở, thì đóng bảng
      setFilteredTasks([]);
    } else {
      setSelectedCategory(category);
      const filtered = tasks.filter((task) => {
        if (category === "Tất cả") return true;
        return task.status === category;
      });
      setFilteredTasks(filtered);
    }
  };

  const handleTaskClick = (task) => {
    console.log("Clicked Task:", task); 
    setSelectedTask(task); 
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">📊 Dashboard Công Việc</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-blue-500 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
              onClick={() => handleCategoryClick("Tất cả")}
            >
              <h2 className="text-lg font-semibold">Tổng số công việc</h2>
              <p className="text-3xl font-bold">{tasks.length}</p>
            </div>
            <div
              className="bg-green-500 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
              onClick={() => handleCategoryClick("Hoàn thành")}
            >
              <h2 className="text-lg font-semibold">Hoàn thành</h2>
              <p className="text-3xl font-bold">{tasks.filter((task) => task.status === "Hoàn thành").length}</p>
            </div>
            <div
              className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
              onClick={() => handleCategoryClick("Đang làm")}
            >
              <h2 className="text-lg font-semibold">Đang làm</h2>
              <p className="text-3xl font-bold">{tasks.filter((task) => task.status === "Đang làm").length}</p>
            </div>
            <div
              className="bg-red-500 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
              onClick={() => handleCategoryClick("Chưa làm")}
            >
              <h2 className="text-lg font-semibold">Chưa làm</h2>
              <p className="text-3xl font-bold">{tasks.filter((task) => task.status === "Chưa làm").length}</p>
            </div>
          </div>

          {selectedCategory && (
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Danh sách công việc: {selectedCategory}</h2>
              {filteredTasks.length > 0 ? (
                <table className="min-w-full border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      <th className="p-3 text-left">Tên công việc</th>
                      <th className="p-3 text-left">Người làm</th>
                      <th className="p-3 text-center">Trạng thái</th>
                      <th className="p-3 text-left">Hạn hoàn thành</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr 
                        key={task.id} 
                        className="border-b hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <td className="p-3">{task.name}</td>
                        <td className="p-3">{task.assignee}</td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-white ${task.status === "Hoàn thành" ? "bg-green-500" : task.status === "Đang làm" ? "bg-yellow-500" : "bg-red-500"}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="p-3">{task.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">Không có công việc nào trong danh mục này.</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Popup hiển thị chi tiết công việc */}
      {selectedTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm transition-all z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 z-50">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 truncate max-w-[250px]">{selectedTask.name}</h3>
            <p className="break-words max-w-[250px]"><strong>Người làm: </strong> {selectedTask.assignee}</p>
            <p className="break-words max-w-[250px]"><strong>Trạng thái: </strong> {selectedTask.status}</p>
            <p className="truncate-text max-w-[250px]"><strong>Ngày tạo: </strong> {selectedTask.createdAt}</p>
            <p className="truncate-text max-w-[250px]"><strong>Ngày cập nhật: </strong> {selectedTask.updatedAt}</p>
            <p className="truncate-text max-w-[250px]"><strong>Hạn hoàn thành: </strong> {selectedTask.deadline}</p>

            <div className="mt-4 flex justify-between">
              {/* Nút Đóng */}
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={() => setSelectedTask(null)}
              >
                Đóng
              </button>

              {/* Nút Xem chi tiết */}
              <a
                href={`/details/${selectedTask.id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Xem chi tiết
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
