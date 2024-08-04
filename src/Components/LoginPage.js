import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/loginStyleSheet.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phoneNo, setPhoneNo] = useState();
  const [password, setPassword] = useState("");
  const isDisabled = !!phoneNo && !!password;

  const onPhoneNoUpdate = (e) => {
    setPhoneNo(e.target.value);
  };

  const onPasswordUpdate = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitClick = () => {
    const selectedUserDetails = {
      phoneNum: "9876543211",
      name: "David",
      contactList: [
        "9876543210",
        "9123456789",
        "9988776655",
        "9090909090",
        "9456789012",
      ],
      password: "david1415",
    };
    dispatch({
      type: "UPDATE_SELECTEDUSER_DETAILS",
      payload: selectedUserDetails,
    });
    navigate("/Chats");
  };
  return (
    <div className="loginPageStyle">
      <form>
        <input
          type="text"
          placeholder="Enter 10 digits Phone Number"
          value={phoneNo}
          onChange={onPhoneNoUpdate}
        ></input>
      </form>
      <br></br>
      <form>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={onPasswordUpdate}
        ></input>
      </form>
      <Button
        className={isDisabled ? "active" : "disabled"}
        variant="success"
        onClick={onSubmitClick}
      >
        Submit
      </Button>
    </div>
  );
};

export default LoginPage;
