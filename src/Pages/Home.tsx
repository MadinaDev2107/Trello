import {
  FaArrowRight,
  FaArrowLeft,
  FaRegClock,
  FaUserTie,
  FaTrash,
  FaTasks,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { database } from "../utils/firebase.config";
import { onValue, ref, remove, update } from "firebase/database";

interface Task {
  id: string;
  title: string;
  user: string;
  date: string;
  status: "to-do" | "in-progress" | "done";
}

const OrderManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    setIsLoading(true);
    const dataRef = ref(database, "tasks");
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tasksArr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(tasksArr);
      } else {
        setTasks([]);
      }
      setIsLoading(false);
    });
  }

  function delItem(id: string) {
    remove(ref(database, `tasks/${id}`));
  }

  function updateItem(id: string, status: string) {
    const newStatus = status === "to-do" ? "in-progress" : "done";
    update(ref(database, `tasks/${id}`), { status: newStatus });
  }

  function updateItems(id: string, status: string) {
    const newStatus = status === "done" ? "in-progress" : "to-do";
    update(ref(database, `tasks/${id}`), { status: newStatus });
  }

  return (
    <div className="bg-dark p-4  vh-100">
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
            ></span>
            Loading...
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
          {[
            { title: "To-do", status: "to-do", color: "bg-danger" },
            {
              title: "In Progress",
              status: "in-progress",
              color: "bg-warning",
            },
            { title: "Done", status: "done", color: "bg-success" },
          ].map((column, index) => (
            <div
              key={index}
              className="flex-grow-1"
              style={{ minWidth: "250px" }}
            >
              <h4 className="text-light text-danger text-center">{column.title}</h4>
              <div
                className={` order-section p-2 rounded ${column.color}`}
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {tasks
                  .filter((task) => task.status === column.status)
                  .map((task, i) => (
                    <div
                      key={i}
                      className="order-item p-2 mb-2 bg-white rounded shadow-sm d-flex justify-content-between align-items-center"
                    >
                      <ul className="list-unstyled w-100">
                        <li>
                          <strong>Task #{i + 1}</strong>
                        </li>
                        <li>
                          <FaTasks /> {task.title}
                        </li>
                        <li>
                          <FaUserTie /> {task.user}
                        </li>
                        <li>
                          <FaRegClock /> {task.date}
                        </li>
                      </ul>
                      <div>
                        {column.status !== "to-do" && (
                          <FaArrowLeft
                            className="text-primary me-2"
                            onClick={() => updateItems(task.id, task.status)}
                          />
                        )}
                        {column.status !== "done" && (
                          <FaArrowRight
                            className="text-primary"
                            onClick={() => updateItem(task.id, task.status)}
                          />
                        )}
                        {column.status === "done" && (
                          <FaTrash
                            className="text-danger"
                            onClick={() => delItem(task.id)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
