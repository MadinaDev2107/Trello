import { Link, Route, Routes } from "react-router-dom";
import SignIn from "./Pages/Login";
import SignUp from "./Pages/Register";
import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
const App = () => {
  return (
    <div>
      <div className=" bg-dark  p-4 d-flex justify-content-between align-items-center">
        <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
          Logo
        </Link>
        <div className=" d-flex gap-5">
          <Link to={"/sign-in"} className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
      </Routes>
    </div>
  );
};

export default App;
