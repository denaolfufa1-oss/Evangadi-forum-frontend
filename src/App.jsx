import { createContext, useEffect, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

import instance from "./Api/Axios.js";
import AppRouter from "./routes/App.routes.jsx";

export const UserState = createContext(); // Create a context for the user data

function App() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token stored during login from local storage
      if (!token) {
        navigate("/auth");
      }

      const { data } = await instance.get("/auth/check");

      setUser(data);
      // console.log(data);
      // Store the user data in state so that it can be accessed by others too
    } catch (error) {
      console.log(error);
      navigate("/auth");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    
    <UserState.Provider value={{ user, setUser }}>
      <AppRouter />
    </UserState.Provider>
  );
}

export default App;
