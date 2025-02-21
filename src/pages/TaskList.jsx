import { useNavigate } from "react-router-dom";

const TaskList = ({ tasks }) => {
  const navigate = useNavigate();

  const handleRowClick = (taskId) => {
    console.log("Navigating to:", `/details/${taskId}`);
    navigate(`/details/${taskId}`);
  };
  
  

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Tên công việc</th>
          <th className="border border-gray-300 p-2">Người làm</th>
          <th className="border border-gray-300 p-2">Trạng thái</th>
          <th className="border border-gray-300 p-2">Hạn hoàn thành</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr
            key={task.id}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => handleRowClick(task.id)}
          >
            <td className="border border-gray-300 p-2">{task.name}</td>
            <td className="border border-gray-300 p-2">{task.assignee}</td>
            <td className="border border-gray-300 p-2">{task.status}</td>
            <td className="border border-gray-300 p-2">{task.deadline}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
