import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAddCardMutation } from "../../store/slice/api";
import { IoNotificationsOutline } from "react-icons/io5";
import {
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

export const PaymentForm = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.reducer.auth.user);
  const stripe = useStripe();
  const elements = useElements();
  const [addCard] = useAddCardMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: card,
      billing_details: {
        name: `${firstName} ${lastName}`,
        address: {
          line1: address,
          city: city,
          postal_code: zipcode,
          state: state,
        },
      },
    });
    if (error) {
      console.log("[error]", error);
      alert(error.message);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      addCard(paymentMethod?.id)
        .unwrap()
        .then((resp) => {
          console.log("success", resp);
          navigate(-1);
        })
        .catch((error) => {
          console.log("error", error);
          alert(JSON.stringify(error));
        });
      // ... SEND to your API server to process payment intent
    }
  };

  return (
    <>
      <Row
        height="73px"
        padding="24px"
        alignItems="center"
        justifyContent="space-between"
        className="flex_column"
      >
        <Row alignItems="center">
          <MdKeyboardBackspace
            style={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
            size={25}
          />
          <Title fontWeight="650" margin="0px 0px 0px 40px">
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
      <div style={{ padding: "0px 0px" }}>
        <Row
          alignItems="center"
          justifyContent="flex-start"
          margin="0px 0px 20px 0px"
        >
          <Title fontWeight="650" fontSize="20px">
            Add Payment Method
          </Title>
        </Row>
        <form onSubmit={handleSubmit}>
          <Row justifyContent="space-between" className="flex_column">
            <InputGroup
              label="Address"
              placeholder="23 Westwood St."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <InputGroup
              label="First Name"
              placeholder="Enter your your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Row>
          <Row justifyContent="space-between" className="flex_column">
            <InputGroup
              label="City"
              placeholder="Gainesville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <InputGroup
              label="Last Name"
              placeholder="Enter your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Row>
          <Row justifyContent="space-between" className="flex_column">
            <InputGroup
              label="State"
              placeholder="Florida"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "8px 0",
              }}
            >
              <Label>Card Number</Label>
              <div
                id="card-number-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 8,
                  border: "1px solid",
                  borderColor: "#292D3233",
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  padding: "0 14px",
                  // width: "92%",
                  height: 75,
                }}
              >
                <div style={{ width: "100%" }}>
                  <CardNumberElement
                    onFocus={() => {
                      document.querySelector(
                        "#card-number-container"
                      ).style.transition = "0.25s";
                      document.querySelector(
                        "#card-number-container"
                      ).style.borderColor = "#00A652";
                    }}
                    onBlur={() => {
                      document.querySelector(
                        "#card-number-container"
                      ).style.borderColor = "#292D3233";
                    }}
                  />
                </div>
              </div>
            </div>
          </Row>
          <Row justifyContent="space-between" className="flex_column">
            <InputGroup
              label="ZIP"
              placeholder="12345"
              hintText="12345"
              type={"tel"}
              inputMask={"99999"}
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
            <Row width="100%" padding="0px" justifyContent="space-between">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "8px 0",
                  width: "48.5%",
                }}
              >
                <Label>Card Expiration Date </Label>
                <div
                  id="card-expiry-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8,
                    border: "solid 1px #292D3233",
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    padding: "0 14px",
                    height: 75,
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <CardExpiryElement
                      onFocus={() => {
                        document.querySelector(
                          "#card-expiry-container"
                        ).style.transition = "0.25s";
                        document.querySelector(
                          "#card-expiry-container"
                        ).style.borderColor = "#00A652";
                      }}
                      onBlur={() => {
                        document.querySelector(
                          "#card-expiry-container"
                        ).style.borderColor = "#292D3233";
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "8px 0",
                  width: "48.5%",
                }}
              >
                <Label>CVC</Label>
                <div
                  id="card-cvc-container"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8,
                    border: "solid 1px #292D3233",
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    padding: "0 14px",
                    height: 75,
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <CardCvcElement
                      onFocus={() => {
                        document.querySelector(
                          "#card-cvc-container"
                        ).style.transition = "0.25s";
                        document.querySelector(
                          "#card-cvc-container"
                        ).style.borderColor = "#00A652";
                      }}
                      onBlur={() => {
                        document.querySelector(
                          "#card-cvc-container"
                        ).style.borderColor = "#292D3233";
                      }}
                    />
                  </div>
                </div>
              </div>
            </Row>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button color="#00A652" type="submit">
              Update
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
