import React, { useEffect, useState } from "react";
import "../styleSheets/chatsPageStyleSheet.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageIcon from "@mui/icons-material/Message";
import WorkIcon from "@mui/icons-material/Work";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputGroup } from "react-bootstrap";
import { Height } from "@mui/icons-material";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { messages } from "../messages";

const Chats = () => {
  const dispatch = useDispatch();
  const {
    chatList = [],
    metaDataDetails = [],
    selectedUser = {},
  } = useSelector((state) => state.chatDetails);
  console.log("testing chatlist", chatList);

  const [selectedMessages, setSelectedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [reciever, setReciever] = useState("");
  const { contactList = [], phoneNum: selectedUserPhoneNo = "" } = selectedUser;
  const recieverDetails = metaDataDetails.filter((eachUser) => {
    const { phoneNum = "" } = eachUser;
    return reciever == phoneNum;
  })?.[0];

  // useEffect(() => {
  //   const msgsToDisplay = chatList.filter((eachChat) => {
  //     const { id = "", from = "", to = "", message = "", time = "" } = eachChat;
  //     return (
  //       (from === reciever || from === selectedUserPhoneNo) &&
  //       (to === reciever || to === selectedUserPhoneNo)
  //     );
  //   });
  //   setSelectedMessages([...msgsToDisplay]);
  // }, [chatList]);

  const onChatClick = (phoneNo) => {
    setReciever(phoneNo);
    axios
      .get(`http://localhost:3004/api/user/chats`, {
        params: {
          from_phone: selectedUserPhoneNo,
          to_phone: phoneNo,
        },
      })
      .then((response) => {
        setSelectedMessages(response.data);
      })
      .catch((error) => {
        // mock data to dis
        const fromAndToMessages = messages.filter((eachChat) => {
          const {
            id = "",
            from_phone = "",
            to_phone = "",
            message = "",
            time = "",
          } = eachChat;
          return (
            (from_phone === selectedUserPhoneNo && to_phone === phoneNo) ||
            (from_phone === phoneNo && to_phone === selectedUserPhoneNo)
          );
        });
        console.log("qqqq", fromAndToMessages);
        setSelectedMessages(fromAndToMessages);
        console.log(fromAndToMessages);
      });
  };

  const onMessageSent = () => {
    const msgToUpdate = {
      id: "23",
      from_phone: selectedUserPhoneNo,
      to_phone: reciever,
      message: newMessage,
      time: new Date()?.toISOString(),
    };
    const listToUpdate = [...selectedMessages, msgToUpdate];
    setSelectedMessages(listToUpdate);
    dispatch({
      type: "UPDATE_MESSAGES_LIST",
      payload: listToUpdate,
    });
    setNewMessage("");
  };

  const onNameClick = (selectedName) => {
    return selectedName;
  };

  return (
    <div className="chatPage">
      <Container fluid>
        <Row sm={1} md={2} lg={3}>
          <Col className="chatPanel" style={{ width: "7%" }}>
            <div>
              <div className="logoStyle">
                <p>Zi Cloud</p>
              </div>
              <div className="iconStyle">
                <MessageIcon />
                <br></br> All Chats
              </div>
              <div className="iconStyle">
                <WorkIcon />
                <br></br> Work
              </div>
              <div className="iconStyle">
                <WorkIcon />
                <br></br> Meet
              </div>
              <div className="iconStyle">
                <InsertInvitationIcon />
                <br></br> Calendar
              </div>
              <div className="iconStyle">
                <AssessmentIcon />
                <br></br> Rating
              </div>
              <div className="iconStyle">
                <BookmarksIcon />
                <br></br> Saved
              </div>
            </div>
          </Col>
          <Col className="chatPanel" style={{ width: "25%" }}>
            {contactList.map((eachPhoneNo, index) => {
              const selectedName = metaDataDetails.find((eachUserData) => {
                const {
                  phoneNum = "",
                  name = "",
                  password = "",
                } = eachUserData;
                return phoneNum === eachPhoneNo;
              });
              return (
                <div
                  key={index}
                  onClick={() => {
                    onChatClick(eachPhoneNo);
                  }}
                  className="namesDisplayStyling"
                >
                  {selectedName.name}
                </div>
              );
            })}
          </Col>
          {reciever && (
            <Col className="chatPanel" style={{ width: "68%" }}>
              <div className="profileDisplay" style={{ height: "8%" }}>
                <strong>{recieverDetails.name}</strong> <br></br>
                <span className="phoneNoDisplay">
                  {recieverDetails.phoneNum}
                </span>
              </div>
              <div className="messagesContainer" style={{ height: "85%" }}>
                {selectedMessages.map((eachMsg, ind) => {
                  const {
                    id = "",
                    from_phone: from = "",
                    to_phone: to = "",
                    message = "",
                    time = "",
                  } = eachMsg;
                  console.log(
                    "rrr",
                    from,
                    selectedUserPhoneNo,
                    from === selectedUserPhoneNo,
                    eachMsg
                  );
                  return (
                    <div
                      key={ind}
                      className={
                        from === selectedUserPhoneNo
                          ? "message-right"
                          : "message-left"
                      }
                    >
                      {message}
                      <br></br>
                      <span className="time">{time?.substring(11, 16)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ height: "6%" }}>
                <div>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="type message here"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      className="send"
                      variant="success"
                      onClick={onMessageSent}
                    >
                      Send
                    </Button>
                  </InputGroup>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Chats;
