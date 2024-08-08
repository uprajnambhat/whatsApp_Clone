import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "../styleSheets/loginStyleSheet.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phoneNo, setPhoneNo] = useState();
  const [name, setName] = useState("");
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
      .post(`http://localhost:3004/api/user/signUp`, {
        name,
        phoneNum: phoneNo,
        password: password,
      })
      .then((response) => {
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
      .catch((error) => {})
      .finally(() => {
        const dataToAdd = {
          phoneNum: phoneNo,
          name,
          password,
          contactList: [],
        };
        const duplicateData = metaDataDetails.filter((eachUserData) => {
          const { phoneNum: exsistingPhoneNo = "" } = eachUserData;
          return exsistingPhoneNo == phoneNo;
        });
        if (duplicateData.length == 0) {
          const updatedMetaDataDetails = [...metaDataDetails, dataToAdd];

          dispatch({
            type: "UPDATE_METADATA_DETAILS",
            payload: updatedMetaDataDetails,
          });
          dispatch({
            type: "UPDATE_SELECTEDUSER_DETAILS",
            payload: dataToAdd,
          });
          navigate("/Chats");
        } else {
          alert("user already exsists, please Login");
        }
      });
  };

  return (
    <div className="container login-container">
      <div className="row d-flex justify-content-center">
        <div className="col-md-4">
          <form id="loginform">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                aria-describedby="emailHelp"
                placeholder="Enter Name"
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                aria-describedby="emailHelp"
                placeholder="Enter Phone Number"
                onChange={(event) => setPhoneNo(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </form>
          <div className="login-btn">
            <button className="btn btn-primary " onClick={onSubmitClick}>
              Submit
            </button>
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
