import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Details = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [task, setTask] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const foundTask = storedTasks.find((t) => t.id === id);
  
    if (foundTask) {
      setTask(foundTask);
    }
  }, [id, localStorage.getItem("tasks")]);
  

  return (
    <div className="p-5">
      {task ? (
        <div className="border p-4 rounded shadow-md bg-white">
          <h1 className="text-2xl font-bold">{task.name}</h1>
          <p><strong>Người làm:</strong> {task.assignee}</p>
          <p><strong>Trạng thái:</strong> {task.status}</p>
          <p><strong>Ngày tạo:</strong> {task.createdAt}</p>
          <p><strong>Ngày cập nhật:</strong> {task.updatedAt}</p>
          <p><strong>Hạn hoàn thành:</strong> {task.deadline}</p>
        </div>
      ) : (
        <p>Không tìm thấy công việc</p>
      )}
    </div>
  );
};

export default Details;
