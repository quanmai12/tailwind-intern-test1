import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';


function To_Do_List() {


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' hoặc 'desc'

  const [selectedTask, setSelectedTask] = useState(null); // Trạng thái cho popup

  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    if (!tasks) return; // Đảm bảo tasks không bị null hoặc undefined

    const lowerSearchTerm = searchTerm.toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchSearch =
        task.name.toLowerCase().includes(lowerSearchTerm) ||
        task.assignee.toLowerCase().includes(lowerSearchTerm) ||
        task.description.toLowerCase().includes(lowerSearchTerm);

      const matchStatus = filterStatus ? task.status === filterStatus : true;

      return matchSearch && matchStatus;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterStatus]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
    setFilteredTasks(storedTasks);
  }, []);

  // Load kết quả tìm kiếm từ URL khi trang được tải lại hoặc có thay đổi
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";
    const status = queryParams.get("status") || "";

    setSearchTerm(search);
    setFilterStatus(status);

    if (tasks.length > 0) {
      filterTasks(search, status);
    }
  }, [location.search, tasks]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      updateURL(searchTerm, filterStatus);
      filterTasks(searchTerm, filterStatus);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterStatus, tasks]); // Thêm `tasks` để tránh lọc khi dữ liệu chưa sẵn sàng


  useEffect(() => {
    let updatedTasks = [...tasks];

    // Lọc theo tìm kiếm và trạng thái
    if (searchTerm.trim()) {
      const normalizedSearchTerm = removeDiacritics(searchTerm.toLowerCase());
      updatedTasks = updatedTasks.filter((task) =>
        removeDiacritics(task.name.toLowerCase()).includes(normalizedSearchTerm) ||
        removeDiacritics(task.assignee.toLowerCase()).includes(normalizedSearchTerm) ||
        removeDiacritics(task.description.toLowerCase()).includes(normalizedSearchTerm)
      );
    }

    if (filterStatus) {
      updatedTasks = updatedTasks.filter((task) => task.status === filterStatus);
    }

    // Sắp xếp theo hạn hoàn thành
    updatedTasks.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredTasks(updatedTasks);
  }, [tasks, searchTerm, filterStatus, sortOrder]);








  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;


  // Chuyển trang
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Cập nhật URL khi thực hiện tìm kiếm
  const updateURL = (search, status) => {
    const queryParams = new URLSearchParams();
    if (search) queryParams.set("search", search);
    if (status) queryParams.set("status", status);
    navigate({ search: queryParams.toString() });
  };

  // Lọc công việc theo từ khóa và trạng thái
  const filterTasks = (search, status) => {
    let filtered = tasks.filter((task) =>
      task.name.toLowerCase().includes(search.toLowerCase())
    );
    if (status) {
      filtered = filtered.filter((task) => task.status === status);
    }
    setFilteredTasks(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  };

  const handleSearch = () => {
    updateURL(searchTerm, filterStatus); // Lưu kết quả lọc vào URL
  };

  const totalPages = Math.ceil(filteredTasks.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstRecord, indexOfLastRecord);



  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${isDeleteOpen ? "opacity-50 blur-sm" : ""}'>
        {/* Header */}
        <Header className="relative z-10" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Danh sách công việc</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Ô tìm kiếm từ khóa */}
              <input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch();
                }}
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />

              {/* Bộ lọc trạng thái công việc */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-1/4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>

            </div>

            {/* Bảng danh sách công việc */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {filteredTasks.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">Không Có Bản Ghi Nào!</p>
              ) : (
                <table className="min-w-full table-fixed border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      <th className="w-2/6 p-4 text-left truncate">Tên công việc</th>
                      <th className="w-1/6 p-4 text-left truncate">Người làm</th>
                      <th className="w-1/6 p-4 text-center truncate">Trạng thái</th>
                      <th
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="w-1/6 p-4 text-left truncate cursor-pointer select-none"
                      >
                        Hạn hoàn thành {sortOrder === "asc" ? "🔼" : "🔽"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                        onClick={() => setSelectedTask(task)}
                      >
                        <td className="w-2/6 p-4 truncate max-w-[150px]">{task.name}</td>
                        <td className="w-1/6 p-4 truncate max-w-[120px]">{task.assignee}</td>
                        <td className="w-1/6 p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-white ${task.status === "Hoàn thành" ? "bg-green-500" : task.status === "Đang làm" ? "bg-yellow-500" : "bg-red-500"}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="w-1/6 p-4 truncate max-w-[140px]">{task.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </main>
      </div>
      {/* Popup hiển thị details */}
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
}

export default To_Do_List;



