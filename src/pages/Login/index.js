import React from "react";
import styled from "styled-components";
import { ReactComponent as Logo } from "../../assets/images/Logo.svg";
import {
  // Button,
  ButtonBar,
  CheckBox,
  Container,
  CustomLink,
  Divider,
  // Image,
  InputGroup,
  LogoContainer,
  Page,
  Paragraph,
  Title,
} from "../../components/common";
import { useState } from "react";
import {
  appleImg,
  emailImg,
  facebookImg,
  googleImg,
  passwordImg,
} from "../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { login, resetPassword } from "../../store/actions/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { gapi } from "gapi-script";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import postgoogleLogin from "../../api/postgoogleLogin";
import postfacebookLogin from "../../api/postfacebookLogin";
import { postLogin, postResetPassword } from "../../api";
import SocialLogin from "../../store/actions/auth/SoicalLogin";
import {
  passwordReseted,
  requestResetPassword,
  setResetPasswordError,
} from "../../store/slice/mainSlice";
import AppleSignin from "react-apple-signin-auth";
import { useLoginWithAppleMutation } from "../../store/slice/api";
import { useGoogleLogin } from "@react-oauth/google";
import useWindowSize from "./../../utils/hook/useWindowSize";

const Image = styled.img`
  @media (max-width: 900px) {
    width: 20px;
  }
`;
const Button = styled.button`
  width: ${(props) => props.width ?? "154px"};
  height: ${(props) => props.height ?? "60px"};
  background: ${(props) => props.color};
  border-radius: ${(props) => props.borderRadius ?? "5px"};
  ${(props) => props.border && "border: 1px solid #000000;"}

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) => props.textColor ?? "#ffffff"};
  border: 1px solid rgba(0, 0, 0, 0.05);

  font-family: "TT Commons";
  font-size: 18px;
  font-weight: 600;

  margin: ${(props) => props.margin ?? "8px"};

  cursor: pointer;

  @media (max-width: 1200px) {
    width: 150px;
    height: 50px;
    font-size: 17px;
  }
  @media (max-width: 900px) {
    width: 120px;
    height: 45px;
    font-size: 15px;
  }
  @media (max-width: 600px) {
    width: 80px;
    height: 40px;
    font-size: 12px;
    margin: 0 4px;
  }
  @media (max-width: 400px) {
    width: 70px;
    height: 37px;
    font-size: 11px;
  }
`;
export default function Login() {
  const [error, seterror] = useState([]);
  const [validateEmail, setValidateEmail] = useState(false);

  const [loginWithApple] = useLoginWithAppleMutation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   function start() {
  //     gapi.client.init({
  //       clientId: '920161152373-u95bboqe5r1m45b5654gdgidipfete75.apps.googleusercontent.com',
  //       scope: 'email',
  //     });
  //   }
  //   gapi.load('client:auth2', start);

  // }, [])

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    postLogin(email, password)
      .then((response) => {
        navigate("/2fa");
      })
      .catch((error) => {
        console.log("error: ", error);
        seterror(error.response.data);
      });
  };

  const handleForgotPassword = async () => {
    navigate("/send-email");
  };

  const HandleSucsess = (googledata) => {
    postgoogleLogin(googledata.access_token)
      .then((response) => {
        dispatch(
          SocialLogin({
            user: {
              ...googledata.profileObj,
              key: response.token,
            },
          })
        );
        navigate("/home");
      })
      .catch((err) => {
        console.log("err", err);
        alert(
          err.response
            ? err.response.data
              ? err.response.data.non_field_errors ??
                JSON.stringify(err.response.data)
              : JSON.stringify(err.response)
            : err.message
        );
      });
  };

  // const loginWithGoogle = useGoogleLogin({
  //   onSuccess: (tokenResponse) => HandleSucsess(tokenResponse),
  //   onError: (err) => {
  //     HandleFailure(err);
  //   },
  // });

  const HandleFailure = (googleres) => {
    console.log("ERROR::", googleres);
  };

  const HandleFacbookLogin = (facebookdata) => {
    // console.log('facebookdata...', facebookdata);
    if (facebookdata.status === "unknown" || facebookdata.error) return;
    postfacebookLogin(facebookdata.accessToken, facebookdata.id)
      .then((response) => {
        dispatch(
          SocialLogin({
            user: {
              ...response.user,
              key: response.token,
            },
          })
        );
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.response
            ? err.response.data
              ? err.response.data.non_field_errors ??
                JSON.stringify(err.response.data)
              : JSON.stringify(err.response)
            : err.message
        );
      });
  };

  const HandleAppleLogin = ({ authorization: { code, id_token } }) => {
    loginWithApple({ access_token: code, id_token })
      .unwrap()
      .then((res) => {
        console.log("loginWithAppleRes...", res);
        dispatch(
          SocialLogin({
            user: {
              ...res.user,
              key: res.token,
            },
          })
        );
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.data
            ? err.data.non_field_errors
              ? JSON.stringify(err.data.non_field_errors)
              : JSON.stringify(err.data)
            : "Some error occurred"
        );
      });
  };

  const loggedIn = useSelector(
    (state) => state.reducer.auth && state.reducer.auth.loggedIn
  );
  useEffect(() => {
    if (loggedIn) {
      navigate("/home");
    }
  }, [loggedIn, navigate]);

  const { width } = useWindowSize();

  return (
    <Page justifyContent="flex-start">
      <Container margin="100px auto" padding="70px" borderRadius="20px">
        <Title margin="30px">Log In</Title>
        <form
          onSubmit={onSubmit}
          style={{
            width: width < 600 && "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <InputGroup
            label="Email"
            placeholder="Enter your email here"
            imageSrc={emailImg}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <InputGroup
            label="Password"
            placeholder="Enter your password here"
            hintText="Forgot Password?"
            onHintClick={handleForgotPassword}
            imageSrc={passwordImg}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <CheckBox
            text="Remember me"
            checked={remember}
            onChange={() => setRemember((v) => !v)}
          />

          {error.non_field_errors && (
            <Paragraph color="#FF5F5F">{error.non_field_errors[0]}</Paragraph>
          )}
          {validateEmail && (
            <Paragraph color="#FF5F5F">Please Enter a valid Email</Paragraph>
          )}
          {(error.username || error.password) && (
            <Paragraph color="#FF5F5F">Fields cannot be empty</Paragraph>
          )}

          <ButtonBar>
            <Button color="#00A652" type="submit" onSubmit={onSubmit}>
              Log in
            </Button>
          </ButtonBar>
        </form>

        <Divider>Or log in with</Divider>
        <ButtonBar>
          <Button
            // onClick={() => loginWithGoogle()}
            style={{
              backgroundColor: "white",
              color: "black",
              textColor: "#000",
            }}
          >
            <Image
              margin="8px -14px 0 -15px"
              width="80px"
              src={googleImg}
              alt="Google logo"
            />
            Google
          </Button>

          <FacebookLogin
            appId="1083826272167616"
            callback={HandleFacbookLogin}
            render={(renderProps) => (
              <Button
                onClick={renderProps.onClick}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  textColor: "#000",
                }}
              >
                <Image width="26px" src={facebookImg} alt="Facebook logo" />{" "}
                Facebook
              </Button>
            )}
          />
          <AppleSignin
            authOptions={{
              clientId: "com.crowdbotics.storeandsharevault.service",
              scope: "email name",
              redirectURI: `${window.location.origin}/login`,
              state: "state",
              nonce: "nonce",
              usePopup: true,
            }} // REQUIRED
            noDefaultStyle={false}
            onSuccess={HandleAppleLogin}
            onError={({ error }) =>
              error !== "popup_closed_by_user" &&
              alert(`Apple SignIn Error: \n ${error}`)
            }
            skipScript={false}
            render={(props) => (
              <Button {...props} color="#fff" width="154px" textColor="#000">
                <Image
                  margin="4px -10px 0 -15px"
                  width="70px"
                  src={appleImg}
                  alt="Apple logo"
                />{" "}
                Apple
              </Button>
            )}
          />
        </ButtonBar>

        <Paragraph>
          Don't have an account?{" "}
          <CustomLink to="/signup">
            <Paragraph bold>Sign Up</Paragraph>
          </CustomLink>
        </Paragraph>
        <LogoContainer>
          <Logo />
        </LogoContainer>
      </Container>
    </Page>
  );
}
