import logo from "./logo.svg";
import "./App.css";
import LoginPage from "./Components/LoginPage";
import { Route, Routes } from "react-router-dom";
import Chats from "./Components/Chats";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/Chats" element={<Chats />}></Route>
      </Routes>
    </div>
  );
}

export default App;
