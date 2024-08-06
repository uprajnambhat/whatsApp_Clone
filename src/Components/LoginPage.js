import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/loginStyleSheet.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phoneNo, setPhoneNo] = useState();
  const [password, setPassword] = useState("");
  const isDisabled = !!phoneNo && !!password;
  const { metaDataDetails = [] } = useSelector((state) => state.chatDetails);

  const onPhoneNoUpdate = (e) => {
    setPhoneNo(e.target.value);
  };

  const onPasswordUpdate = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitClick = () => {
    axios
      .post(`http://localhost:3004/api/user`, {
        phoneNum: phoneNo,
        password: password,
      })
      .then((response) => {
        console.log("data recived", response.data);
        const selectedUserDetails = response.data[0];
        selectedUserDetails.contactList = JSON.parse(
          selectedUserDetails.contactList
        );

        dispatch({
          type: "UPDATE_SELECTEDUSER_DETAILS",
          payload: selectedUserDetails,
        });
        navigate("/Chats");
      })
      .catch((error) => {
        console.log("Error fetching user details:", error);
        const selectedUserDetails = metaDataDetails.filter((eachUser) => {
          const { phoneNum = "", password: userPassword = "" } = eachUser;
          return phoneNo == phoneNum && password == userPassword;
        })?.[0];
        if (selectedUserDetails) {
          dispatch({
            type: "UPDATE_SELECTEDUSER_DETAILS",
            payload: selectedUserDetails,
          });
          navigate("/Chats");
        } else {
          console.log("No user found with the given phone number and password");
        }
      });
    // const selectedUserDetails =
    // {
    //   phoneNum: "9876543211",
    //   name: "David",
    //   contactList: [
    //     "9876543210",
    //     "9123456789",
    //     "9988776655",
    //     "9090909090",
    //     "9456789012",
    //   ],
    //   password: "david1415",
    // };
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
