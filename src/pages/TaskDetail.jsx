import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://localhost:5001/tasks/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Công việc không tồn tại!");
          } else {
            setError("Có lỗi xảy ra khi tải dữ liệu!");
          }
          return;
        }

        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          setError("Dữ liệu không hợp lệ!");
          return;
        }

        setTask(data);
      } catch (error) {
        setError("Lỗi kết nối đến server!");
        console.error("Lỗi khi tải chi tiết công việc:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!task) return <p>Không tìm thấy công việc!</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">{task.name}</h2>
      <p><strong>Mô tả:</strong> {task.description}</p>
      <p><strong>Trạng thái:</strong> {task.status}</p>
      <p><strong>Thời gian tạo:</strong> {task.createdAt ? new Date(task.createdAt).toLocaleString() : "Không xác định"}</p>
      <p><strong>Cập nhật lần cuối:</strong> {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "Chưa cập nhật"}</p>
      <button
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        onClick={() => navigate("/")}
      >
        Quay lại
      </button>
    </div>
  );
}

export default TaskDetail;
