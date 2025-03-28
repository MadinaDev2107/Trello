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

        console.log(tasksArr);
      } else {
        setTasks([]);
      }
    });
    setIsLoading(false);
  }

  function delItem(id: string) {
    const taskRef = ref(database, `tasks/${id}`);
    remove(taskRef);
  }

  function updateItem(current: string, status: string) {
    const newStatus = status === "to-do" ? "in-progress" : "done";
    update(ref(database, `tasks/${current}`), { ...tasks, status: newStatus });
  }
  function updateItems(current: string, status: string) {
    const newStatus = status === "done" ? "in-progress" : "to-do";
    update(ref(database, `tasks/${current}`), { ...tasks, status: newStatus });
  }
  return (
    <div className="container p-4">
      {isLoading ? (
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-primary d-flex justify-content-center align-items-center"
            type="button"
            disabled
          >
            <span
              className="spinner-border spinner-border-sm m-1"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="m-1">Loading...</span>
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-4">
            <h4 className="text-center">To-do</h4>
            <div
              style={{ maxHeight: "350px", overflow: "auto" }}
              className="order-section bg-light p-1 rounded"
            >
              {tasks
                .filter((task) => task.status === "to-do")
                .map((task, index) => (
                  <div
                    key={index}
                    className="order-item p-2 mb-2 bg-white rounded border"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <ul
                        style={{ listStyle: "none" }}
                        key={index}
                        className="list-disc pl-5 space-y-1 w-100"
                      >
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="text-lg font-semibold">
                            Task #{index + 1}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaTasks /> {task.title}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaUserTie /> {task.user}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaRegClock /> {task.date}
                          </p>
                        </li>
                      </ul>
                      <div>
                        <FaArrowRight
                          className="text-primary"
                          onClick={() => updateItem(task.id, task.status)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="col-md-4">
            <h4 className="text-center">In Progress</h4>
            <div
              style={{ maxHeight: "350px", overflow: "auto" }}
              className="order-section bg-light p-1 rounded"
            >
              {tasks
                .filter((task) => task.status === "in-progress")
                .map((task, index) => (
                  <div
                    key={index}
                    className="order-item p-2 mb-2 bg-white rounded border"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <ul
                        style={{ listStyle: "none" }}
                        key={index}
                        className="list-disc pl-5 space-y-1 w-100"
                      >
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="text-lg font-semibold">
                            Task #{index + 1}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaTasks /> {task.title}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaUserTie /> {task.user}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaRegClock /> {task.date}
                          </p>
                        </li>
                      </ul>
                      <div>
                        <FaArrowLeft
                          className="text-primary"
                          onClick={() => updateItems(task.id, task.status)}
                        />
                        <FaArrowRight
                          className="text-primary"
                          onClick={() => updateItem(task.id, task.status)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-md-4">
            <h4 className="text-center">Done</h4>
            <div
              style={{ maxHeight: "350px", overflow: "auto" }}
              className="order-section bg-light p-1 rounded"
            >
              {tasks
                .filter((task) => task.status === "done")
                .map((task, index) => (
                  <div
                    key={index}
                    className="order-item p-2 mb-2 bg-white rounded border"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <ul
                        style={{ listStyle: "none" }}
                        key={index}
                        className="list-disc pl-5 space-y-1 w-100"
                      >
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="text-lg font-semibold">
                            Task #{index + 1}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaTasks /> {task.title}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaUserTie /> {task.user}
                          </p>
                        </li>
                        <li className="border p-1 rounded-lg shadow-md bg-white">
                          <p className="flex items-center gap-2">
                            <FaRegClock /> {task.date}
                          </p>
                        </li>
                      </ul>
                      <div>
                        <FaTrash
                          className="text-danger me-2"
                          onClick={() => delItem(task.id)}
                        />
                        <FaArrowLeft
                          className="text-primary"
                          onClick={() => updateItems(task.id, task.status)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
