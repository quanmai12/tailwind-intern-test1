import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa'; // Import icon

function Dashboard() {
  // State quản lý sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State quản lý danh sách công việc
  const [tasks, setTasks] = useState([]);

  // Lấy dữ liệu từ JSON (giả lập)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5001/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Lỗi khi tải công việc:", error);
      }
    };
    fetchTasks();
  }, []);



  // State quản lý dữ liệu nhập từ form
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("Chưa làm");
  const [editIndex, setEditIndex] = useState(null);

  // Hàm thêm hoặc cập nhật công việc
  // const handleAddOrUpdate = async () => {
  //   if (!taskName.trim() || !taskDescription.trim() || !taskDeadline) return;

  //   if (editIndex !== null) {
  //     // Lấy công việc cũ để giữ lại createdAt
  //     const existingTask = tasks.find((task) => task.id === editIndex);

  //     const updatedTask = {
  //       ...existingTask, // Giữ nguyên dữ liệu cũ (bao gồm createdAt)
  //       name: taskName,
  //       description: taskDescription,
  //       status: taskStatus,
  //       deadline: taskDeadline,
  //       updatedAt: new Date().toLocaleString(), // Chỉ cập nhật thời gian sửa đổi
  //     };

  //     try {
  //       const response = await fetch(`http://localhost:5000/tasks/${editIndex}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedTask),
  //       });

  //       const result = await response.json();
  //       console.log("Update response:", result);
  //       if (response.ok) {
  //         setTasks((prevTasks) =>
  //           prevTasks.map((task) =>
  //             task.id === editIndex ? updatedTask : task
  //           )
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi cập nhật công việc:", error);
  //     }

  //     setEditIndex(null);
  //   } else {
  //     const newTask = {
  //       name: taskName,
  //       description: taskDescription,
  //       status: taskStatus,
  //       deadline: taskDeadline,
  //       createdAt: new Date().toLocaleString(), // Giữ thời gian tạo
  //       updatedAt: new Date().toLocaleString(),
  //     };

  //     try {
  //       const response = await fetch("http://localhost:5000/tasks", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(newTask),
  //       });

  //       if (response.ok) {
  //         const addedTask = await response.json();
  //         setTasks((prevTasks) => [addedTask, ...prevTasks]);
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi thêm công việc:", error);
  //     }
  //   }

  //   setTaskName("");
  //   setTaskDescription("");
  //   setTaskStatus("Chưa làm");
  //   setTaskDeadline("");
  // };
  const handleAddOrUpdate = async () => {
    if (!taskName.trim() || !taskDescription.trim() || !taskDeadline) return;
  
    if (editIndex !== null) {
      console.log("Updating task with ID:", editIndex);
  
      const updatedTask = {
        id: editIndex, // Đảm bảo ID tồn tại
        name: taskName,
        description: taskDescription,
        status: taskStatus,
        deadline: taskDeadline,
        updatedAt: new Date().toLocaleString(),
      };
  
      try {
        const response = await fetch(`http://localhost:5001/tasks/${editIndex}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
  
        if (response.ok) {
          const updatedData = await response.json();
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === editIndex ? updatedData : task))
          );
          console.log("Task updated successfully:", updatedData);
        } else {
          console.error("Update failed:", await response.text());
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật công việc:", error);
      }
  
      setEditIndex(null);
    } else {
      console.log("Adding new task");
  
      const newTask = {
        name: taskName,
        description: taskDescription,
        status: taskStatus,
        deadline: taskDeadline,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };
  
      try {
        const response = await fetch("http://localhost:5001/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });
  
        if (response.ok) {
          const addedTask = await response.json();
          setTasks((prevTasks) => [addedTask, ...prevTasks]);
          console.log("Task added successfully:", addedTask);
        } else {
          console.error("Add failed:", await response.text());
        }
      } catch (error) {
        console.error("Lỗi khi thêm công việc:", error);
      }
    }
  
    setTaskName("");
    setTaskDescription("");
    setTaskStatus("Chưa làm");
    setTaskDeadline("");
  };
  
  //   if (!taskName.trim() || !taskDescription.trim() || !taskDeadline) return;

  //   // Nếu đang chỉnh sửa, thực hiện cập nhật
  //   if (editIndex !== null) {
  //     const updatedTask = {
  //       name: taskName,
  //       description: taskDescription,
  //       status: taskStatus,
  //       deadline: taskDeadline,
  //       updatedAt: new Date().toLocaleString(),
  //     };

  //     try {
  //       const response = await fetch(`http://localhost:5000/tasks/${editIndex}`, {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedTask),
  //       });

  //       if (response.ok) {
  //         setTasks((prevTasks) =>
  //           prevTasks.map((task) =>
  //             task.id === editIndex ? { ...task, ...updatedTask } : task
  //           )
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi cập nhật công việc:", error);
  //     }

  //     setEditIndex(null); // Reset trạng thái chỉnh sửa
  //   } else {
  //     // Nếu không phải đang chỉnh sửa, thêm công việc mới
  //     const newTask = {
  //       name: taskName,
  //       description: taskDescription,
  //       status: taskStatus,
  //       deadline: taskDeadline,
  //       createdAt: new Date().toLocaleString(),
  //       updatedAt: new Date().toLocaleString(),
  //     };

  //     try {
  //       const response = await fetch("http://localhost:5000/tasks", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(newTask),
  //       });

  //       if (response.ok) {
  //         const addedTask = await response.json();
  //         setTasks((prevTasks) => [addedTask, ...prevTasks]);
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi thêm công việc:", error);
  //     }
  //   }

  //   // Reset form về mặc định sau khi thêm/cập nhật
  //   setTaskName("");
  //   setTaskDescription("");
  //   setTaskStatus("Chưa làm");
  //   setTaskDeadline("");
  // };

  // Hàm xóa công việc
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Lỗi khi xóa công việc:", error);
    }
  };
  // Hàm chỉnh sửa công việc
  const handleEdit = (task) => {
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setTaskDeadline(task.deadline);
    setEditIndex(task.id); // Gán id để biết đang chỉnh sửa
  };

  const handleUpdate = async () => {
    if (editIndex === null) return;

    const updatedTask = {
      name: taskName,
      description: taskDescription,
      status: taskStatus,
      updatedAt: new Date().toLocaleString(),
    };

    try {
      const response = await fetch(`http://localhost:5001/tasks/${editIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editIndex ? { ...task, ...updatedTask } : task
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật công việc:", error);
    }

    setTaskName("");
    setTaskDescription("");
    setTaskStatus("Chưa làm");
    setEditIndex(null);
  };
  // Hàm đánh dấu công việc hoàn thành
  const markAsDone = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Hoàn thành", updatedAt: new Date().toLocaleString() }),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, status: "Hoàn thành", updatedAt: new Date().toLocaleString() } : task
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái công việc:", error);
    }
  };
  // hàm cập nhập, xóa công việc
  const updateTask = (index, updatedTask) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      newTasks[index] = { ...updatedTask, updatedAt: new Date().toLocaleString() };
      return newTasks;
    });
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };
  const [taskDeadline, setTaskDeadline] = useState("");

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
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-md">
              <h2 className="text-xl font-semibold mb-3">Thêm công việc mới</h2>
              <input type="text" placeholder="Tên công việc" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="block w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <textarea placeholder="Mô tả công việc" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className="block w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea>
              <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} className="block w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
              <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="block w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                <option value="Chưa làm">Chưa làm</option>
                <option value="Đang làm">Đang làm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
              <button onClick={handleAddOrUpdate} className={`px-4 py-2 rounded ${editIndex !== null ? "bg-yellow-500" : "bg-blue-500"} text-white dark:bg-yellow-600 dark:bg-blue-600`}>{editIndex !== null ? "Cập nhật công việc" : "Thêm công việc"}</button>
            </div>
            {/* Bảng danh sách công việc */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                    <th className="p-3 text-left">Tên công việc</th>
                    <th className="p-3 text-left">Trạng thái</th>
                    <th className="p-3 text-left">Thời gian tạo</th>
                    <th className="p-3 text-left">Thời gian cập nhật</th>
                    <th className="p-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Link to={`/task/${index.id}`} className="text-blue-500 underline">
                          {task.name}
                        </Link>
                      </td>
                      <td className={`p-3 font-semibold ${task.status === "Hoàn thành" ? "text-green-500" : "text-red-500"}`}>{task.status}</td>
                      <td className="p-3">{task.createdAt}</td>
                      <td className="p-3">{task.updatedAt}</td>
                      <td className="p-3 text-center flex justify-center gap-4">
                        <button onClick={() => handleEdit(task)} className="text-yellow-500"><FaEdit /></button>
                        <button onClick={() => handleDelete(task.id)} className="text-red-500"><FaTrash /></button>
                        {task.status !== "Hoàn thành" && (
                          <button onClick={() => markAsDone(task.id)} className="text-green-500"><FaCheck /></button>
                        )}

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

