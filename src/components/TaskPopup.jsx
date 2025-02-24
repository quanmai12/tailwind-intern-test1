// src/components/TaskPopup.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TaskPopup = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">{task.name}</h3>
        <p><strong>Người thực hiện:</strong> {task.assignee}</p>
        <p><strong>Mô tả:</strong> {task.description}</p>
        <p><strong>Trạng thái:</strong> {task.status}</p>
        <p><strong>Ngày tạo:</strong> {task.createdAt}</p>
        <p><strong>Ngày cập nhật:</strong> {task.updatedAt}</p>
        <p><strong>Hạn hoàn thành:</strong> {task.deadline}</p>
        <div className="mt-4 flex justify-end">
          <Link
            to={`/details/${task.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskPopup;
