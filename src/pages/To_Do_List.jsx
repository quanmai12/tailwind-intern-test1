import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa'; // Import icon



function To_Do_List() {


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [taskName, setTaskName] = useState("");
  const [taskAssignee, setTaskAssignee] = useState(""); // Tên người làm
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("Chưa làm");
  const [taskCreatedAt, setTaskCreatedAt] = useState(""); // Ngày nhập bản ghi
  const [taskUpdatedAt, setTaskUpdatedAt] = useState(""); // Ngày chỉnh sửa bản ghi
  const [taskDeadline, setTaskDeadline] = useState(""); // Thời hạn hoàn thành
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' hoặc 'desc'

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);

    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const query = params.get("q") || "";
  //   setSearchTerm(query);
  // }, [location.search]);
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
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

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
  

  const saveTasksToLocalStorage = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleAddOrUpdate = () => {

    let newErrors = {};

    if (!taskName.trim()) newErrors.taskName = "Vui lòng nhập tên công việc!";
    if (!taskAssignee.trim()) newErrors.taskAssignee = "Vui lòng nhập tên người làm!";
    if (!taskDescription.trim()) newErrors.taskDescription = "Vui lòng nhập mô tả!";
    if (!taskDeadline) newErrors.taskDeadline = "Vui lòng chọn hạn hoàn thành!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Xóa lỗi nếu không còn lỗi
    const currentTime = new Date().toLocaleString();
    if (editIndex !== null) {
      const updatedTask = {
        id: editIndex,
        name: taskName,
        assignee: taskAssignee,
        description: taskDescription,
        status: taskStatus,
        deadline: taskDeadline,
        updatedAt: currentTime,
      };

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editIndex ? { ...task, ...updatedTask } : task))
      );

      setEditIndex(null);
    } else {
      // Thêm công việc mới
      const newTask = {
        id: Date.now(), // Tạo ID dựa trên thời gian
        name: taskName,
        assignee: taskAssignee,
        description: taskDescription,
        status: taskStatus,
        createdAt: currentTime, // Gán thời gian nhập bản ghi
        updatedAt: currentTime, // Ban đầu giống thời gian tạo
        deadline: taskDeadline,
      };

      const updatedTasks = [newTask, ...tasks];
      saveTasksToLocalStorage(updatedTasks);

    }

    // Reset form
    setTaskName("");
    setTaskAssignee("");
    setTaskDescription("");
    setTaskStatus("Chưa làm");
    setTaskDeadline("");
  };

  //hàm xóa công việc
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công việc này không?")) {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      saveTasksToLocalStorage(updatedTasks);
      setFilteredTasks(updatedTasks);
    }
  };
  // const handleSearch = () => {
  //   const lowerSearchTerm = searchTerm.toLowerCase();

  //   const filtered = tasks.filter((task) => {
  //     const matchSearch =
  //       task.name.toLowerCase().includes(lowerSearchTerm) ||
  //       task.assignee.toLowerCase().includes(lowerSearchTerm) ||
  //       task.description.toLowerCase().includes(lowerSearchTerm);

  //     const matchStatus = filterStatus ? task.status === filterStatus : true;

  //     return matchSearch && matchStatus;
  //   });

  //   setFilteredTasks(filtered);
  // };


  const handleSearch = () => {


    const normalizedSearchTerm = removeDiacritics(searchTerm.toLowerCase());

    const filtered = tasks.filter((task) => {
      const matchSearch =
        removeDiacritics(task.name.toLowerCase()).includes(normalizedSearchTerm) ||
        removeDiacritics(task.assignee.toLowerCase()).includes(normalizedSearchTerm) ||
        removeDiacritics(task.description.toLowerCase()).includes(normalizedSearchTerm);

      return matchSearch;
    });
    
    const results = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(results);

    setFilteredTasks(filtered);
  };
  // const handleSearch = () => {
  //   const params = new URLSearchParams();
  //   if (searchTerm) params.set("q", searchTerm);
  //   if (filterStatus) params.set("status", filterStatus);
  //   navigate(`?${params.toString()}`);
  
  //   const normalizedSearch = removeAccents(searchTerm.toLowerCase().trim());
  
  //   const results = tasks
  //     .filter((task) =>
  //       removeAccents(task.name.toLowerCase()).includes(normalizedSearch)
  //     )
  //     .filter((task) => (filterStatus ? task.status === filterStatus : true))
  //     .sort((a, b) => {
  //       const dateA = new Date(a.deadline);
  //       const dateB = new Date(b.deadline);
  //       return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  //     });
  
  //   setFilteredTasks(results);
  // };
  
  

  // Hàm chỉnh sửa công việc
  const handleEdit = (task) => {
    setTaskName(task.name);
    setTaskAssignee(task.assignee);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setTaskDeadline(task.deadline);
    setEditIndex(task.id);
  };

  // Hàm đánh dấu công việc hoàn thành
  const markAsDone = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: "Hoàn thành", updatedAt: new Date().toLocaleString() } : task
    );
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleClick = (taskId) => {
    localStorage.setItem("selectedTaskId", taskId);
    window.location.href = `/details/${taskId}`; // Điều hướng sang trang details
  };

  
  

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Danh sách công việc</h1>
            {/* Form thêm công việc */}
            <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                {editIndex !== null ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {/* Tên công việc */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên công việc</label>
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Nhập tên công việc"
                  />
                  {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName}</p>}
                </div>

                {/* Tên người làm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Người làm</label>
                  <input
                    type="text"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Nhập tên người làm"
                  />
                  {errors.taskAssignee && <p className="text-red-500 text-sm">{errors.taskAssignee}</p>}
                </div>

                {/* Mô tả công việc */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Nhập mô tả công việc"
                  ></textarea>
                  {errors.taskDescription && <p className="text-red-500 text-sm">{errors.taskDescription}</p>}
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="Chưa làm">Chưa làm</option>
                    <option value="Đang làm">Đang làm</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>

                </div>

                {/* Thời hạn hoàn thành */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hạn hoàn thành</label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  {errors.taskDeadline && <p className="text-red-500 text-sm">{errors.taskDeadline}</p>}
                </div>
              </div>

              {/* Nút thêm/cập nhật */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAddOrUpdate}
                  className={`px-4 py-2 rounded ${editIndex !== null ? "bg-yellow-500" : "bg-blue-500"} text-white hover:opacity-80`}
                >
                  {editIndex !== null ? "Cập nhật" : "Thêm công việc"}
                </button>
              </div>
            </div>
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

              {/* Nút xác nhận tìm kiếm */}
              {/* <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reset
              </button> */}
            </div>

            {/* Bảng danh sách công việc */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
              {filteredTasks.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">Không Có Bản Ghi Nào!</p>
              ) : (
                <table className="min-w-full border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      <th className="p-3 text-left">Tên công việc</th>
                      <th className="p-3 text-left">Người làm</th>
                      <th className="p-3 text-center">Trạng thái</th>
                      <th
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="p-3 text-left cursor-pointer select-none px-4 py-2"
                      >
                        Hạn hoàn thành {sortOrder === "asc" ? "🔼" : "🔽"}
                      </th>
                      <th className="p-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="p-3">{task.name}</td>
                        <td className="p-3">{task.assignee}</td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-white ${task.status === "Hoàn thành" ? "bg-green-500" : task.status === "Đang làm" ? "bg-yellow-500" : "bg-red-500"}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="p-3">{task.deadline}</td>
                        <td className="p-3 flex justify-center gap-2">
                          <button onClick={() => handleEdit(task)} className="text-yellow-500 hover:text-yellow-600" title="Chỉnh sửa">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:text-red-600" title="Xóa">
                            <FaTrash />
                          </button>
                          {task.status !== "Hoàn thành" && (
                            <button onClick={() => markAsDone(task.id)} className="text-green-500 hover:text-green-600" title="Hoàn thành">
                              <FaCheck />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default To_Do_List;



