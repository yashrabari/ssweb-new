import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSendFeedbackMutation } from "../../store/slice/api";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  Row,
  Title,
  IconButton,
  InputGroup,
  Label,
  Button,
} from "../../components/common";
import { Profile } from "../../components/Home";
import OptionMenuSettings from "../../components/common/OptionMenuSettings";
import { logout } from "../../store/actions/auth";
import people from "../../assets/images/people.png";
import SignOut from "../../assets/images/SignOut.png";
import Group86 from "../../assets/images/Group 86.png";
import NotePencil from "../../assets/images/NotePencil.png";
import { MdKeyboardBackspace } from "react-icons/md";
import TextArea from "../../components/common/TextArea";

const Index = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.reducer.auth.user);
  const [sendFeedback] = useSendFeedbackMutation();

  const handleSubmit = () => {
    if (!title || !message) return alert("please enter title and message");
    else {
      sendFeedback({ title: title, message: message })
        .unwrap()
        .then((resp) => {
          setTitle("");
          setMessage("");
          window.alert("Feedback send successfully!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Row
        height="73px"
        padding="24px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Row alignItems="center">
          <MdKeyboardBackspace
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
            size={25}
          />
          <Title fontWeight="650" margin="0px 0px 0px 40px">
            Send Feedback
          </Title>
        </Row>
        <Row>
          <OptionMenuSettings
            options={[
              {
                Icon: people,
                text: "My Buddies",
                onClick: () => {
                  navigate("/home/my-buddies");
                },
              },
              {
                Icon: Group86,
                text: "My transactions",
                onClick: () => {
                  navigate("/home/transactions");
                },
              },
              {
                Icon: NotePencil,
                text: "Send Feedback",
                onClick: () => {
                  navigate("/home/send/feedback");
                },
              },
              {
                Icon: SignOut,
                text: "Logout",
                onClick: () => {
                  dispatch(logout());
                  navigate("/");
                },
              },
            ]}
          />

          <IconButton
            onClick={() => {
              navigate("/home/notifications");
            }}
          >
            <IoNotificationsOutline size={20} />
          </IconButton>
          <Profile user={user} />
        </Row>
      </Row>
      <div style={{ padding: "0px 40px" }}>
        <Row
          alignItems="center"
          justifyContent="flex-start"
          margin="0px 0px 20px 0px"
        >
          <Title fontWeight="650" fontSize="20px">
            {user.email}
          </Title>
        </Row>
        <Row justifyContent="space-between">
          <InputGroup
            label="Title"
            placeholder=""
            value={title}
            width="100vw"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Row>
        <Row>
          <TextArea
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "849px",
            marginTop: "10px",
          }}
        >
          <Button
            width="180px"
            onClick={() => handleSubmit()}
            color="#00A652"
            type="submit"
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
};
export default Index;
