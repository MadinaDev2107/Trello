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
  id: string;
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
  const token: string | null = localStorage.getItem("token");

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
    <div>
      {token === "r4PgDiiE7sYJUYF5XcnjY6CYMFx1" ? (
        <div className="card p-3 w-25 mx-auto mt-3">
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
          <button onClick={save} className="btn btn-dark">
            Save
          </button>
        </div>
      ) : (
        <div
          style={{ height: "450px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <h3 style={{ color: "grey" }}>404 | Page not found</h3>
        </div>
      )}
    </div>
  );
};

export default Admin;
