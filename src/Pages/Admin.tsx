import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Select from "react-select";
import { database, db } from "../utils/firebase.config";
import { push, ref } from "firebase/database";

interface Task {
  title: string;
  status: string;
  user: string;
  date: string;
}

interface User {
  name: string;
}

const Admin: React.FC = () => {
  const today: string = new Date().toISOString().split("T")[0];
  const [task, setTask] = useState<Task>({
    title: "",
    status: "to-do",
    user: "",
    date: "",
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const usersCollection = collection(db, "users");
    const res = await getDocs(usersCollection);
    const userList: User[] = res.docs.map((itm) => ({
      id: itm.id,
      ...(itm.data() as User),
    }));
    setUsers(userList);
  }

  const options = users.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  function save() {
    push(ref(database, "tasks"), task).then(() => {
      setTask({
        title: "",
        status: "to-do",
        user: "",
        date: "",
      });
    });
  }

  return (
    <div
      className="container d-flex bg-dark justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-3 w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-3">Create Task</h3>
        <input
          placeholder="Title..."
          type="text"
          className="form-control mb-2"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
        />
        <Select
          className="mb-2"
          options={options}
          onChange={(selectedOption) => {
            setTask({ ...task, user: selectedOption?.value || "" });
          }}
        />
        <input
          min={today}
          value={task.date}
          className="form-control mb-2"
          type="date"
          onChange={(e) => setTask({ ...task, date: e.target.value })}
        />
        <button onClick={save} className="btn btn-dark w-100">
          Save
        </button>
      </div>
    </div>
  );
};

export default Admin;
