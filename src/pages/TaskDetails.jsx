// src/pages/TaskDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const foundTask = storedTasks.find((t) => t.id.toString() === id);
    setTask(foundTask);
    if (foundTask) setEditedTask(foundTask);
  }, [id]);

  if (!task) {
    return <p className="text-center mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy công việc.</p>;
  }


  const openEditPopup = () => setIsEditOpen(true);
  const closeEditPopup = () => setIsEditOpen(false);


  const handleUpdateTask = () => {
    const updatedTasks = JSON.parse(localStorage.getItem("tasks")).map(t =>
      t.id.toString() === id ? { ...editedTask, updatedAt: new Date().toLocaleString() } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTask(editedTask);
    closeEditPopup();
  };

  const openDeletePopup = () => setIsDeleteOpen(true);
  const closeDeletePopup = () => setIsDeleteOpen(false);




  const handleDeleteTask = () => {
    const updatedTasks = JSON.parse(localStorage.getItem("tasks")).filter(t => t.id.toString() !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    closeDeletePopup();
    navigate("/todolist"); // Quay lại trang todolist
  };

  const markAsCompleted = () => {
    const updatedTasks = JSON.parse(localStorage.getItem("tasks")).map(t =>
      t.id.toString() === id ? { ...t, status: "Hoàn thành", updatedAt: new Date().toLocaleString() } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTask({ ...task, status: "Hoàn thành" });
    alert("✅ Công việc đã hoàn thành!");
  };



  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Nội dung chính */}
      <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${isDeleteOpen ? "opacity-50 blur-sm" : ""}'>
        {/* Header */}
        <Header className="relative z-10" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Chi tiết công việc */}
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300">
            {/* Tiêu đề công việc */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 break-words text-center">
              {task.name}
            </h2>


            {/* Chi tiết công việc */}
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 break-words text-center">Người thực hiện:</strong> {task.assignee}</p>

              {/* Mô tả công việc */}
              <p><strong className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 break-words text-center">Mô tả:</strong></p>
              <div className="max-h-24 overflow-y-auto p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm">
                {task.description}
              </div>


              {/* Trạng thái công việc */}
              <p>
                <strong className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 break-words text-center">Trạng thái:</strong>
                <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium ${task.status === "Hoàn thành" ? "bg-green-500 text-white" : task.status === "Đang làm" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}`}>
                  {task.status}
                </span>
              </p>

              <p><strong className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 break-words text-center">Ngày tạo:</strong> {task.createdAt}</p>
              <p><strong className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 break-words text-center">Ngày cập nhật:</strong> {task.updatedAt}</p>
              <p><strong className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 break-words text-center">Hạn hoàn thành:</strong> {task.deadline}</p>
            </div>

            {/* Nút chức năng */}
            <div className="mt-6 flex justify-center gap-3">
              {task.status !== "Hoàn thành" && (
                <button
                  className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
                  onClick={markAsCompleted}
                >
                  Hoàn thành
                </button>
              )}
              <button className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300" onClick={openEditPopup}>
                Chỉnh Sửa
              </button>

              <button className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300" onClick={openDeletePopup}>
                Xóa
              </button>

              <button className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300" onClick={() => navigate(-1)}>
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*pop-up*/}
      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm transition-all z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 z-50">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Chỉnh sửa công việc</h3>

            {/* Tên công việc */}
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Tên công việc:</label>
            <input
              className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
              maxLength={50}
            />

            {/* Mô tả công việc */}
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Mô tả:</label>
            <textarea
              className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white max-h-40 overflow-y-auto"
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            />

            {/* Người thực hiện */}
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Người thực hiện:</label>
            <input
              className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
              value={editedTask.assignee}
              onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
              maxLength={30}
            />

            {/* Trạng thái */}
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Trạng thái:</label>
            <select
              className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
            >
              <option value="Chưa làm">Chưa làm</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>

            {/* Hạn hoàn thành */}
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Hạn hoàn thành:</label>
            <input
              type="date"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
              value={editedTask.deadline}
              onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
            />

            {/* Nút hành động */}
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={closeEditPopup}>Hủy</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleUpdateTask}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm transition-all z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 z-50">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Xác nhận xóa công việc</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Bạn có chắc chắn muốn xóa công việc này?</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={closeDeletePopup}>Hủy</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDeleteTask}>Xóa</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskDetails;
