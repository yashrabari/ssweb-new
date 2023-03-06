import React, { useState, useEffect, useRef, useMemo } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { components } from "react-select";
import { ReactComponent as Logo } from "../../assets/images/Logo.svg";
import {
  Button,
  ButtonBar,
  Container,
  IconButton,
  InputGroup,
  LogoContainer,
  Paragraph,
  Title,
  Label,
  CheckBox,
  Image,
} from "../../components/common";
import OptionMenuSettings from "../../components/common/OptionMenuSettings";
import people from "../../assets/images/people.png";
import SignOut from "../../assets/images/SignOut.png";
import Group86 from "../../assets/images/Group 86.png";
import NotePencil from "../../assets/images/NotePencil.png";
import { Profile } from "../../components/Home";
import { logout } from "../../store/actions/auth";
import { getUserProfile } from "../../api";
// import getCategory from "../../api/getCategory";
import { login } from "../../store/actions/auth";
import {
  useGetCountriesQuery,
  useUpdateProfileMutation,
} from "../../store/slice/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import styled from "styled-components";
import useWindowSize from "../../utils/hook/useWindowSize";
import { Box } from "@mui/material";
import { Stack } from "react-bootstrap";

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

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <CheckBox
          text={props.label}
          onChange={() => null}
          checked={props.isSelected}
        />
      </components.Option>
    </div>
  );
};

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.reducer.auth.user);
  const token = useSelector((state) => state.reducer.auth.token);
  const [userID, setuserID] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  // const [category, setCategory] = useState("")
  const [phoneNumber, setphoneNumber] = useState("");
  // const [categoryoptions, setcategoryoptions] = useState([])
  const [verificationPeriod, setVerificationPeriod] = useState("");
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [upcomingdata, setupcomingdata] = useState([]);
  const [country, setCountry] = useState("");
  const profilePicRef = useRef(null);
  const [updateProfile] = useUpdateProfileMutation();
  const {
    data: countries,
    isLoading: isCountriesLoading,
    isSuccess: countriesSuccessfullyLoaded,
  } = useGetCountriesQuery();
  const verificationperiodoptions = [
    { value: "One Week", label: "One Week", color: "#00B8D9", isFixed: true },
    { value: "Two Week", label: "Two Week", color: "#0052CC", isFixed: true },
    { value: "One Month", label: "One Month", color: "#5243AA", isFixed: true },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderRadius: "10px",
      borderColor: "#292D3233",
      height: "80px",
      padding: "0px 6px",
      fontfamily: "TT Commons",
      fontSize: "16px",
      lineHeight: "26px",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        borderColor: "#00A652",
      },
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
      "&:hover": {
        backgroundColor: "#00A652",
      },
    }),
    placeholder: (defaultStyles) => ({
      ...defaultStyles,
      fontFamily: "TT Commons",
      fontSize: "18px",
    }),
  };
  useEffect(() => {
    // getCategory(token).then((response) => {
    //     let categories = response.results
    //     setcategoryoptions(categories)
    // })
    getUserProfile(token).then((res) => {
      setupcomingdata(res.results);
      res.results.map((e) => {
        console.log("profile...", e, e.verification_period);
        setFullName(e.name);
        setProfilePic(e.profile_picture);
        setProfilePicUrl(e.profile_picture);
        setuserID(e.id);
        setphoneNumber(e.phone_number);
        setCountry(e.location);
        setUserName(e.username);
        setEmail(e.email);
        // setCategory({ value: e.category[0].id, label: e.category[0].name })
        setVerificationPeriod(e.verification_period);
      });
    });
  }, []);

  useEffect(() => {
    getUserProfile(token).then((res) => {
      const data = res.results[0];
      if (data) {
        if (
          fullName != data.name ||
          userName != data.username ||
          profilePic != data.profile_picture ||
          location != data.location ||
          verificationPeriod != data.verification_period
        ) {
          setIsProfileEdit(true);
        } else {
          setIsProfileEdit(false);
        }
      }
    });
  }, [fullName, userName, location, verificationPeriod]);

  const countriesOptions = useMemo(() => {
    if (countries) {
      return countries.data.map((country) => ({
        value: country.country,
        label: country.country,
      }));
    }
  }, [countries]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    // console.log('file...', file)
    if (file.type.split("/")[0] !== "image")
      return alert("This file type is not supported");

    setProfilePic(file);
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (e) => {
      setProfilePicUrl(e.target.result);
    });
    fileReader.readAsDataURL(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isProfileEdit) return;
    if (!fullName) return alert("Please enter full name.");
    // if (!category) return alert('Please select a category.')
    if (!verificationPeriod) return alert("Please select verification period.");

    let dataToSubmit = {
      id: userID,
      user_data: JSON.stringify({
        name: fullName,
        username: userName,
        phone_number: phoneNumber,
        email,
        location: country,
        verification_period: verificationPeriod.name
          ? verificationPeriod.name
          : verificationPeriod,
      }),
    };
    if (profilePic !== profilePicUrl) {
      dataToSubmit["profile_picture"] = profilePic;
    }
    updateProfile(dataToSubmit)
      .unwrap()
      .then((response) => {
        dispatch(
          login({
            user: {
              response,
              token: token,
            },
          })
        );
        navigate("/home");
      })
      .catch((err) => {
        alert(JSON.stringify(err.data));
      });
  };

  const { width } = useWindowSize();

  if (!countriesOptions) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        width="100%"
        height="73px"
        padding="24px 0"
        className="mb-5"
      >
        <div>
          <Paragraph margin="0 8px 0 0" color="#000">
            Welcome, 👋
          </Paragraph>
          <Title style={{ textAlign: "left" }}>
            {user?.name ? user?.name : "Antor P."}
          </Title>
        </div>

        <div style={{ display: "flex" }}>
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
        </div>
      </div>
      <Container margin="100px" padding="70px" borderRadius="20px">
        <form style={{ width: width < 600 && "100%" }} onSubmit={onSubmit}>
          {upcomingdata.map((item, index) => {
            return (
              <div key={index}>
                <input
                  ref={profilePicRef}
                  type="file"
                  multiple={false}
                  accept="image/*"
                  hidden={true}
                  onChange={handleImage}
                />
                <InputGroup
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <InputGroup
                  label="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <InputGroup
                  disabled={true}
                  label="Email"
                  placeholder="Enter your email"
                  value={item.email}
                />

                {countriesOptions && (
                  <>
                    <Row justifyContent="space-between">
                      <Label>Location</Label>
                    </Row>
                    <Select
                      menuPosition="left"
                      placeholder="Select the location"
                      value={countriesOptions.find(
                        (el) => el.value === country
                      )}
                      styles={customStyles}
                      onChange={(e) => {
                        setCountry(e.value);
                      }}
                      options={countriesOptions}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      components={{ Option }}
                    />
                  </>
                )}
                {/* <Row justifyContent="space-between">
                                    <Label>Category</Label>
                                </Row>
                                <Select
                                    defaultValue={category}
                                    menuPosition="left"
                                    placeholder='Select the category'
                                    value={{ value: category.value, label: category.label }}
                                    styles={customStyles}
                                    onChange={(e) => {
                                        setCategory(e)
                                    }}
                                    options={categoryoptions.map((cat, index) => {
                                        return ({
                                            label: cat.name,
                                            value: cat.id,
                                            key: index
                                        })
                                    })}
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    components={{
                                        Option
                                    }}
                                /> */}
                <div
                  style={{
                    display: "block",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Row justifyContent="space-between">
                    <Label>Verification Period</Label>
                  </Row>
                  <Select
                    placeholder="Select the verification period"
                    value={verificationperiodoptions.find(
                      (el) => el.value === verificationPeriod
                    )}
                    styles={customStyles}
                    onChange={(e) => {
                      console.log(e);
                      setVerificationPeriod(e.value);
                    }}
                    options={verificationperiodoptions}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                  />
                </div>
                <ButtonBar>
                  <Button color="#00A652" type="submit">
                    {isProfileEdit ? "Save" : "Edit"}
                  </Button>
                </ButtonBar>
              </div>
            );
          })}
        </form>
        <LogoContainer
          backgroundColor="#ebebeb6b"
          onClick={() => profilePicRef.current.click()}
        >
          {profilePicUrl || user?.imageUrl ? (
            <Image
              width="50px"
              height="44px"
              borderRadius="5px"
              margin="0 0 0 0"
              objectFit="cover"
              src={profilePicUrl || user?.imageUrl}
              alt="Profile"
            />
          ) : (
            <Logo />
          )}
        </LogoContainer>
      </Container>
    </>
  );
}
