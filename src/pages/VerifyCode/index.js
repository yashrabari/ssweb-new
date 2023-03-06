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
import { useDispatch, useSelector } from "react-redux";
import { login, Twofactorverification } from "../../store/actions/auth";
import {
  post2fa,
  postResetPasswordResend,
  postResetPasswordVerify,
} from "../../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  passwordReseted,
  requestResetPassword,
  setResetPasswordError,
} from "../../store/slice/mainSlice";
import {
  useSetNewPasswordMutation,
  useVerifyOtpMutation,
} from "../../store/slice/api";
import "./index.css";

export default function VerifyCode({ twofactor, imageSrc, title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = useSelector((state) => state.reducer.resetPassword.email);
  const signUp = useSelector((state) => state.reducer.auth.signUp);

  const [code, setCode] = useState("");
  const [error, seterror] = useState("");

  const [verifyOtp] = useVerifyOtpMutation();

  const handleResend = async () => {
    dispatch(requestResetPassword());
    try {
      await postResetPasswordResend(email);
      dispatch(passwordReseted());
    } catch (error) {
      dispatch(setResetPasswordError(error));
    }
  };
  const loggedIn = useSelector((state) => state.reducer.auth.loggedIn);
  useEffect(() => {
    if (loggedIn) {
      navigate("/home");
    }
  }, [loggedIn, navigate]);

  // const handleVerify = async () => {
  //   if (newPassword !== confirmNewPassword) {
  //     setConfirmPasswordError(true)
  //     return
  //   }

  //   // if (twofactor) {
  //     setConfirmPasswordError(false)

  //     verifyOtp(code).unwrap().then((response) => {
  //       if (response.token) {
  //         dispatch(Twofactorverification(response));
  //         if (signUp) {
  //           navigate('/create-profile')
  //         } else {
  //           dispatch(login({
  //             user: response
  //           }))
  //           navigate('/home')
  //         }
  //       }
  //       else {
  //         seterror(response.message);
  //       }

  //     }).catch((error) => {
  //       console.log('err', error);
  //     })

  //     // post2fa(code).then((response) => {
  //     //   if (response.token) {
  //     //     dispatch(Twofactorverification(response));
  //     //     if (signUp) {
  //     //       navigate('/create-profile')
  //     //     } else {
  //     //       dispatch(login({
  //     //         user: response
  //     //       }))
  //     //       navigate('/home')
  //     //     }
  //     //   }
  //     //   else {
  //     //     seterror(response.message);
  //     //   }
  //     // })
  //   // }

  //   if (twofactor === false) {

  //     addNewPassword(confirmNewPassword).unwrap().then((data) => {
  //       if (data.data.message == "Successfully resetted user password.") {
  //         navigate("/login")
  //       } else {
  //         dispatch(setResetPasswordError(error.message))
  //         setResetPasswordScreen(false)
  //         navigate("/verify-forgot-password")
  //       }

  //     }).catch((error) => {
  //       console.log('err dodo', error);
  //     })

  //     // const data = await postResetPasswordVerify(email, code, confirmNewPassword);
  //     // console.log('data...', data);
  //     // console.log(data.data.message)
  //     // if (data.data.message == "Successfully resetted user password.") {
  //     //   navigate("/login")
  //     // } else {
  //     //   dispatch(setResetPasswordError(error.message))
  //     //   setResetPasswordScreen(false)
  //     //   navigate("/verify-forgot-password")
  //     // }
  //   }
  // }

  const handleVerifyOtp = () => {
    if (twofactor) {
      post2fa(code).then((response) => {
        if (response.token) {
          dispatch(Twofactorverification(response));
          dispatch(login({ user: response }));
          navigate("/home");
        } else {
          seterror(response.message);
        }
      });
    } else {
      verifyOtp({ code, email })
        .unwrap()
        .then((response) => {
          // changes
          if (response.message) {
            navigate("/change-password");
          } else {
            seterror(response.message);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
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
