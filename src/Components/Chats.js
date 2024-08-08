import React, { useEffect, useState, useRef } from "react";
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
import { Button, Dropdown, InputGroup } from "react-bootstrap";
import { Height } from "@mui/icons-material";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { messages } from "../messages";
import Modal from "react-bootstrap/Modal";
import PushPinIcon from "@mui/icons-material/PushPin";

const Chats = () => {
  const dispatch = useDispatch();
  const {
    chatList = [],
    metaDataDetails = [],
    selectedUser = {},
  } = useSelector((state) => state.chatDetails);

  const [selectedMessages, setSelectedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [addContact, setAddContact] = useState();
  const [addContactName, setAddContactName] = useState();
  const [pinnedChat, setPinnedChat] = useState([]);
  const [reciever, setReciever] = useState("");
  const [show, setShow] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const msgDisplayRef = useRef();
  const contactDisplayRef = useRef();
  const {
    contactList = [],
    name: selectedUserName = "",
    phoneNum: selectedUserPhoneNo = "",
  } = selectedUser;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const sortedContactList = [...new Set([...pinnedChat, ...contactList])];

  useEffect(() => {
    if (msgDisplayRef.current) {
      msgDisplayRef.current.scrollIntoView({});
    }
  }, [selectedMessages]);

  useEffect(() => {
    if (contactDisplayRef.current && !!addContact) {
      contactDisplayRef.current.scrollIntoView({});
    }
  }, [addContact, sortedContactList]);

  const recieverDetails = metaDataDetails.filter((eachUser) => {
    const { phoneNum = "" } = eachUser;
    return reciever == phoneNum;
  })?.[0];

  console.log("abcd", recieverDetails, metaDataDetails);

  const onChatPinned = (recieverPhoneNo) => {
    if (pinnedChat.indexOf(recieverPhoneNo) == -1) {
      setPinnedChat([...pinnedChat, recieverPhoneNo]);
    } else {
      const newArray = pinnedChat.filter(
        (element) => element !== recieverPhoneNo
      );
      setPinnedChat(newArray);
    }
  };

  const onChatClick = (phoneNo) => {
    setReciever(phoneNo);
    setShowMessages(true);
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
        // mock data to display
        const fromAndToMessages = chatList.filter((eachChat) => {
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
      from_phone: selectedUserPhoneNo,
      to_phone: reciever,
      message: newMessage,
      time: new Date()?.toISOString(),
    };

    axios
      .post("http://localhost:3004/api/user/insertMessages", msgToUpdate)
      .then((response) => {})
      .catch((error) => {})
      .finally(() => {
        const listToUpdate = [...selectedMessages, msgToUpdate];
        setSelectedMessages(listToUpdate);
        dispatch({
          type: "UPDATE_MESSAGES_LIST",
          payload: [...chatList, listToUpdate],
        });
        setNewMessage("");
      });
  };

  const onSaveClick = () => {
    axios
      .put("http://localhost:3004/api/user/chats/updateContactList", {
        phoneNo: selectedUserPhoneNo,
        contactList: [...contactList, addContact],
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
      })
      .catch((error) => {
        const selectedUserDetails = { ...selectedUser };
        selectedUserDetails?.contactList.push(addContact);
        const updateMetaDataDetails = [...metaDataDetails];
        const index = updateMetaDataDetails.findIndex((eachDetail) => {
          return eachDetail.phoneNum == selectedUserPhoneNo;
        });
        if (index != -1) {
          updateMetaDataDetails[index] = selectedUserDetails;
        }
        const newIndex = updateMetaDataDetails.findIndex((eachDetail) => {
          return eachDetail.phoneNum == addContact;
        });
        if (newIndex == -1) {
          updateMetaDataDetails.push({
            phoneNum: addContact,
            name: "NoName",
            password: "1234",
            contactList: [],
          });
        }

        dispatch({
          type: "UPDATE_SELECTEDUSER_DETAILS",
          payload: selectedUserDetails,
        });
        dispatch({
          type: "UPDATE_METADATA_DETAILS",
          payload: updateMetaDataDetails,
        });
      })
      .finally(() => {
        handleClose();
      });
  };

  const onDeleteChat = (phoneNo, e) => {
    e.stopPropagation();
    setReciever("");
    const updatedContactList = contactList.filter((eachNo) => {
      return eachNo != phoneNo;
    });
    console.log(updatedContactList);
    const updatedSelectedUserDetails = {
      ...selectedUser,
      contactList: updatedContactList,
    };

    dispatch({
      type: "UPDATE_SELECTEDUSER_DETAILS",
      payload: updatedSelectedUserDetails,
    });
  };

  console.log("rrrr", reciever, showMessages);

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
            <div className="chat-container">
              <div className="userProfileDisplay">
                <strong>{selectedUserName}</strong> :{" "}
                <span>{selectedUserPhoneNo}</span>
              </div>
              <div className="new-contact">
                <Button variant="outline-secondary" onClick={handleShow}>
                  Add Contact
                </Button>
              </div>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      aria-describedby="emailHelp"
                      placeholder="Enter Phone Number"
                      onChange={(event) => setAddContact(event.target.value)}
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => onSaveClick()}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
              <div className="contactDisplay">
                {sortedContactList.map((eachPhoneNo, index) => {
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
                      onClick={() => onChatClick(eachPhoneNo)}
                      className="namesDisplayStyling"
                      ref={contactDisplayRef}
                    >
                      <div className="each-chat">
                        {selectedName?.name}
                        <div className="pin-chat">
                          {" "}
                          {pinnedChat.indexOf(selectedName.phoneNum) != -1 && (
                            <PushPinIcon />
                          )}
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="secondary"
                              id="dropdown-basic"
                            ></Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  onChatPinned(selectedName.phoneNum);
                                }}
                              >
                                {pinnedChat.indexOf(selectedName.phoneNum) !=
                                -1 ? (
                                  <p>Unpin</p>
                                ) : (
                                  <p>Pin</p>
                                )}
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={(e) =>
                                  onDeleteChat(selectedName.phoneNum, e)
                                }
                              >
                                Delete Chat
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
          {!!reciever && (
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
                  return (
                    <div
                      key={ind}
                      className={
                        from === selectedUserPhoneNo
                          ? "message-right"
                          : "message-left"
                      }
                      ref={msgDisplayRef}
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
                      onClick={() => onMessageSent()}
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
