import logo from "./logo.svg";
import "./App.css";
import LoginPage from "./Components/LoginPage";
import { Route, Routes } from "react-router-dom";
import Chats from "./Components/Chats";
import SignUpPage from "./Components/SignUpPage";

function App() {
  return (
    <div>
      <Routes>
        {/* hgfuytgvjyt */}
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/Chats" element={<Chats />}></Route>
        <Route path="/signUp" element={<SignUpPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
