import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';


const AddNewList = () => {
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
    const [taskDeadline, setTaskDeadline] = useState(""); // Thời hạn hoàn thành
    const [editIndex, setEditIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' hoặc 'desc'


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


    const saveTasksToLocalStorage = (updatedTasks) => {
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };


    const [showPopup, setShowPopup] = useState(false);
    const Popup = ({ message, onClose }) => {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{message}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        );
    };
    const handleAddOrUpdate = () => {
        let newErrors = {};
    
        // Kiểm tra tên công việc
        if (!taskName.trim()) {
            newErrors.taskName = "Vui lòng nhập tên công việc!";
        } else if (taskName.length > 50) {
            newErrors.taskName = "Tên công việc không được vượt quá 50 ký tự!";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(taskName)) {
            newErrors.taskName = "Tên công việc không được chứa ký tự đặc biệt!";
        }
    
        // Kiểm tra tên người làm
        if (!taskAssignee.trim()) {
            newErrors.taskAssignee = "Vui lòng nhập tên người làm!";
        } else if (taskAssignee.length > 30) {
            newErrors.taskAssignee = "Tên người làm không được vượt quá 30 ký tự!";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(taskAssignee)) {
            newErrors.taskAssignee = "Tên người làm không được chứa ký tự đặc biệt!";
        }
    
        // Kiểm tra mô tả
        if (!taskDescription.trim()) {
            newErrors.taskDescription = "Vui lòng nhập mô tả!";
        }
    
        // Kiểm tra hạn hoàn thành
        if (!taskDeadline) {
            newErrors.taskDeadline = "Vui lòng chọn hạn hoàn thành!";
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        setErrors({});
    
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
            const newTask = {
                id: Date.now(),
                name: taskName,
                assignee: taskAssignee,
                description: taskDescription,
                status: taskStatus,
                createdAt: currentTime,
                updatedAt: currentTime,
                deadline: taskDeadline,
            };
    
            const updatedTasks = [newTask, ...tasks];
            saveTasksToLocalStorage(updatedTasks);
        }
    
        setTaskName("");
        setTaskAssignee("");
        setTaskDescription("");
        setTaskStatus("Chưa làm");
        setTaskDeadline("");
    
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 2000);
    };
    

    const handleClick = (taskId) => {
        localStorage.setItem("selectedTaskId", taskId);
        window.location.href = `/details/${taskId}`; // Điều hướng sang trang details
    };

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;





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




    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${isDeleteOpen ? "opacity-50 blur-sm" : ""}'>
                {/* Header */}
                <Header className="relative z-10" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="grow">
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <h1 className="text-2xl md:text-3xl font-bold mb-6">Thêm mới công việc</h1>
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
                        {showPopup && <Popup message="Thêm công việc thành công!" onClose={() => setShowPopup(false)} />}

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddNewList;
