import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Title, IconButton, Paragraph } from "../../components/common";
import { NotificationContainer } from "../../components/common/Notifications";
import { Profile } from "../../components/Home";
import { ReactComponent as Logo } from "../../assets/images/Logo.svg";
import { Grid } from "@mui/material";
import OptionMenuSettings from "../../components/common/OptionMenuSettings";
import { logout } from "../../store/actions/auth";
import people from "../../assets/images/people.png";
import SignOut from "../../assets/images/SignOut.png";
import Group86 from "../../assets/images/Group 86.png";
import NotePencil from "../../assets/images/NotePencil.png";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  height: ${(props) => props.height};
  padding: ${(props) => props.padding};
  width: ${(props) => props.width};
  margin: ${(props) => props.margin};
  ${(props) => props.link && "cursor:pointer;"}
`;

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.reducer.auth.user);
  const data = [
    {
      name: "Afracon Million gorge",
      summary:
        "From Uk and willing to move on to other country for making name industry",
      time: "10:48 pm",
    },
    {
      name: "Buildgates Rockie",
      summary: "From Uk and willing to move industry",
      time: "10:48 pm",
    },
    {
      name: "Davison Elon",
      summary: "From Uk and willing to move on to other name industry",
      time: "10:48 pm",
    },
    {
      name: "Leo orge Marker paul",
      summary:
        "From Uk and willing to move on to other country for making name industryLeo orge Marker paul ",
      time: "10:48 pm",
    },
  ];
  return (
    <>
      <Row
        width="100%"
        height="73px"
        padding="24px 0"
        alignItems="center"
        justifyContent="space-between"
        className="flex_column"
      >
        <div>
          <Title>Notifications</Title>
        </div>

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

          <IconButton backgroundColor="#00A652">
            <IoNotificationsOutline color="white" size={20} />
          </IconButton>
          <Profile user={user} />
        </Row>
      </Row>
      <Row justifyContent="space-between" width="100%">
        <NotificationContainer width="100%" height="auto">
          {data.map((item) => {
            return (
              <>
                <Grid
                  container
                  flexDirection="row"
                  alignItems="center"
                  height="100%"
                  padding="10px"
                >
                  <Grid item lg={0.7} paddingLeft="10px">
                    <Logo width="41px" height="44px" />
                  </Grid>
                  <Grid item lg={2.3}>
                    <Paragraph
                      textAlign="justify"
                      color="black"
                      fontSize="20px"
                    >
                      {item.name}
                    </Paragraph>
                  </Grid>
                  <Grid item lg={8.5}>
                    <Paragraph
                      textAlign="justify"
                      color="black"
                      width="100%"
                      fontSize="20px"
                    >
                      {item.summary}
                    </Paragraph>
                  </Grid>
                  <Grid item lg={0.5}>
                    <Paragraph
                      whiteSpace="nowrap"
                      width="100%"
                      textAlign="justify"
                      fontSize="12px"
                      margin="0 30px 0 0"
                    >
                      {item.time}
                    </Paragraph>
                  </Grid>
                </Grid>
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                    width: "100%",
                    height: "2px",
                  }}
                />
              </>
            );
          })}
        </NotificationContainer>
      </Row>
    </>
  );
};

export default Notifications;
