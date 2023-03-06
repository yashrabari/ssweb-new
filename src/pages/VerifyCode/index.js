import React, { useEffect } from "react";
import {
  Back,
  Button,
  ButtonBar,
  Container,
  Image,
  Page,
  Paragraph,
  Title,
} from "../../components/common";
import ReactCodeInput from "react-code-input";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./index.css";

import { verifyOtp } from "../../networks/auth";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";


export default function VerifyCode({ twofactor, imageSrc, title }) {
  const navigate = useNavigate();

  const { loginFunction } = useContext(AuthContext)

  const location = useLocation()
  const [code, setCode] = useState("");
  const [error, seterror] = useState("");
  const [userId, setUserId] = useState(null)


  const handleResend = async () => {


  };
  useEffect(() => {
    setUserId(location.state.userId)

  }, [navigate]);


  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ id: userId, otp: code })
      if (!res.success) return seterror(res.message)
      loginFunction(res.token)
      navigate('/home')
    } catch (err) {
      seterror(err)
    }
  };

  return (
    <Page>
      <Container
        width="927px"
        margin="100px"
        padding="70px"
        borderRadius="20px"
      >
        <Back back="back" />

        <Title margin="46px 0 0">{title}</Title>
        <Image src={imageSrc} />
        <Paragraph>
          We've sent a 6 digit PIN to your phone number. Please put the PIN
          below to continue
        </Paragraph>

        <ReactCodeInput
          type="text"
          className="number_input"
          fields={6}
          inputStyle={{
            border: "1px solid rgba(41, 45, 50, 0.2)",
            fontFamily: "TT Commons",
            textAlign: "center",
          }}
          onChange={(code) => setCode(code)}
        />
        {error && <Paragraph color="#FF5F5F">{error}</Paragraph>}
        <ButtonBar>
          <Button color="#00A652" onClick={handleVerifyOtp}>
            Submit
          </Button>
        </ButtonBar>
        <Paragraph bold link color="#292D32" onClick={handleResend}>
          Resend Code?
        </Paragraph>
      </Container>
    </Page>
  );
}
