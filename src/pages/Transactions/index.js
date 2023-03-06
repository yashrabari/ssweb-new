import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  //   Row,
  Title,
  IconButton,
  Paragraph,
  Button,
  OptionsMenu,
} from "../../components/common";
import { Profile } from "../../components/Home";
import BackTransactions from "../TransactionsPaymentHistory/BackTransactions/index";
import { Table, TableBodyRow } from "../../components/MyBuddies";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OptionMenuSettings from "../../components/common/OptionMenuSettings";
import { logout } from "../../store/actions/auth";
import people from "../../assets/images/people.png";
import SignOut from "../../assets/images/SignOut.png";
import Group86 from "../../assets/images/Group 86.png";
import NotePencil from "../../assets/images/NotePencil.png";
import {
  useDeleteCardMutation,
  useGetAllCardsQuery,
  useMarkAsPrimaryMutation,
} from "../../store/slice/api";
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
const Transactions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.reducer.auth.user);
  const token = useSelector((state) => state.reducer.auth.token);
  const { data: allCards, error, isLoading, isSuccess } = useGetAllCardsQuery();
  const [deleteCard] = useDeleteCardMutation();
  const [markAsPrimary] = useMarkAsPrimaryMutation();
  console.log("allCardsData...", allCards, error, isLoading, isSuccess, token);

  return (
    <>
      <Row
        width="100%"
        height="auto"
        padding="24px 0px 0px 0px"
        alignItems="center"
        justifyContent="space-between"
        className="flex_column"
      >
        <Row justifyContent="space-between">
          <BackTransactions />
          <Title fontWeight="650" margin="14px 0px 0px 60px">
            My Transactions
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
      <Row justifyContent="space-between" alignItems="center">
        <Paragraph bold fontSize="24px" color="#000">
          Saved Cards
        </Paragraph>
        <Button
          margin="8px 0px 8px 0px "
          width="200px"
          height="46px"
          color="#00A652"
          onClick={() => {
            navigate("/home/transactions/addPaymentMethod");
          }}
        >
          + Add Payment Method
        </Button>
      </Row>
      <Table>
        <tbody>
          {allCards &&
            allCards.data &&
            allCards.data.map((item, index) => (
              <TableBodyRow key={index}>
                <td>
                  <Grid
                    item
                    lg={2.5}
                    fontWeight="400"
                    fontFamily="TT Commons"
                    color="#000000"
                    paddingLeft="15px"
                    fontSize="16px"
                  >
                    {item.card.brand.toUpperCase()}
                    {item.metadata && item.metadata.default === "True" && (
                      <span
                        style={{
                          marginLeft: "20px",
                          border: "1px solid #4aa25c",
                          color: "#4aa25c",
                          fontFamily: "TT Commons",
                          padding: "2px 5px",
                          borderRadius: "5px",
                        }}
                      >
                        Primary
                      </span>
                    )}
                  </Grid>
                </td>
                <td>
                  <Grid
                    item
                    lg={9}
                    fontWeight="400"
                    fontFamily="TT Commons"
                    color="#000000"
                    paddingLeft="15px"
                    fontSize="16px"
                  >
                    **** **** **** {item.card.last4}
                  </Grid>
                </td>
                <td>
                  <Grid item lg={0.5}>
                    <OptionsMenu
                      options={[
                        {
                          text: "Mark as primary",
                          onClick: () => {
                            markAsPrimary(item.id);
                          },
                        },
                        {
                          text: "Delete",
                          onClick: () => {
                            deleteCard(item.id);
                          },
                        },
                      ]}
                    />
                  </Grid>
                </td>
              </TableBodyRow>
            ))}
        </tbody>
      </Table>
      <Row justifyContent="flex-start" alignItems="center">
        <Button
          margin="8px 0px 0px 0px "
          width="300px"
          height="46px"
          color="#00A652"
          onClick={() => {
            navigate("/home/transactions/payment-history");
          }}
        >
          View Payment History
        </Button>
        <Button
          margin="8px 0px 0px 8px "
          width="300px"
          height="46px"
          color="#FBBC05"
          onClick={() => {
            navigate("/subscriptions");
          }}
        >
          View Subscription Offers
        </Button>
      </Row>
    </>
  );
};

export default Transactions;
