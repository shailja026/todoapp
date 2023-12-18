import React from "react";
// import styles from "../styles/todos.mulule.css"
import styles from "../styles/todos.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Lists from "./Lists";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdEditSquare } from "react-icons/md";

const API_URL = "https://todo-server-shailja026.vercel.app/tasks";


function Todos() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  
  useEffect(() => {
    axios(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
      .then((response) => {
        setTasks(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  // saving tasks to local storage================================================================
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
  }, [tasks]);

  // // getting data from local storage================================================================

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tasks"));
    console.log(data);
    if (data) {
      setTasks(data);
    }
  },[]);

  // adding new lists in todos list================================================================
  const addTask = async () => {
    try {
      const response = await axios.post(API_URL, {
        title: newTask,
        completed: false,
      });
      tasks.push(response.data);
      console.log(response.data);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

 
  

  // deleting a perticular task=================================================

  const deleteList = async (listId) => {
    try {
      const newData = tasks.filter((task) => task.id !== listId);
      setTasks(newData);
      const response = await axios.delete(`${API_URL}/${listId}`);
      console.log(response.data);
    } catch (err) {
      console.log("Unable to delete list due to : ", err);
    }
  };

  //mark the task as completed================================>>>>>>>>>>>>>>>
  const updateTask = async (listId) => {
    try {
      const updatedTasks = await tasks.map((task, i) => {
        if (task?.id === listId) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      });
      console.log(updatedTasks);
      setTasks(updatedTasks);

      const response = await axios.patch(`${API_URL}/${listId}`, {
        completed: updatedTasks.find((task) => task?.id === listId).completed,
      });
      alert("Task completed");
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // this function will handle tasks editing and updating

  const handleEditTask = (id, title) => {
    setEditedTaskId(id);
    setEditedTaskTitle(title);
    
  };
 

  const handleSave = async(taskId) => {
    try {
      const newUpdatedtask = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, title: editedTaskTitle };
        } else {
          return task;
        }
      });
      setTasks(newUpdatedtask);
      // Get the updated task's title
      const updatedTaskTitle = newUpdatedtask.find((task) => task.id === taskId).title;
  
      // Send PATCH request with the updated task title
      await axios.patch(`${API_URL}/${taskId}`, {
        title: updatedTaskTitle,
      });
  
     
      setEditedTaskId(null);
      setEditedTaskTitle("");
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className={styles.listContainer}>
      <h1>To-Do App</h1>
      <div className={styles.box}>
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} className={styles.addBtn}>
          <IoAddCircleOutline />
        </button>
      </div>
      <ul className={styles.list}>
        {tasks?.length === 0
          ? ""
          : tasks?.map((task, i) => {
              return (
                <li key={i} className={styles.todos}>
                  {editedTaskId === task.id ? (
                    <div className={styles.editBox}>
                      <input
                        value={editedTaskTitle}
                        type="text"
                        onChange={(e) => setEditedTaskTitle(e.target.value)}
                      />
                      <button onClick={() => handleSave(task.id)}>Save</button>
                    </div>
                  ) : (
                    <div className={styles.mainBox}>
                      <div className={styles.taskBox}>
                        <Lists task={task} />
                      </div>

                      <div className={styles.buttonBox}>
                        <button onClick={() => deleteList(task.id)}>
                          <MdDelete />
                        </button>
                        <button
                          onClick={() => handleEditTask(task.id, task.title)}
                        >
                          {" "}
                          <MdEditSquare />
                        </button>
                        <button
                          onClick={() =>
                            updateTask(task.id, task.title, task.completed)
                          }
                        >
                          {task.completed ? (
                            <span>
                              <MdCheckBox />
                            </span>
                          ) : (
                            <span>
                              <MdCheckBoxOutlineBlank />
                              {}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  );
}

export default Todos;
