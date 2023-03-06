import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import {
  Back,
  Button,
  ButtonBar,
  CheckBox,
  Container,
  InputGroup,
  Label,
  Page,
  ProfileImage,
  Row,
  Title,
} from "../../components/common";
import Select from "react-select";
import { components } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../api";
import putUserProfile from "../../api/putUserProfile";
import { useNavigate } from "react-router-dom";
// import getCategory from "../../api/getCategory";
import { login, logout } from "../../store/actions/auth";
import {
  useUpdateProfileMutation,
  useGetCountriesQuery,
} from "../../store/slice/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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

export default function CreateProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.auth.token);
  const [userID, setuserID] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("");
  // const [category, setCategory] = useState("")
  // const [categoryoptions, setcategoryoptions] = useState([])
  const [verificationPeriod, setVerificationPeriod] = useState("");
  const [upcomingdata, setupcomingdata] = useState([]);
  const [country, setCountry] = useState("");

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
    getUserProfile(token).then((response) => {
      console.log(response.results);
      setupcomingdata(response.results);
      response.results.map((e) => {
        setImageFile(e.profile_picture);
        setFullName(e.name);
        setuserID(e.id);
        setphoneNumber(e.phone_number);
        setUserName(e.email);
        // setCategory(e.category?.length ? { value: e.category[0].id, label: e.category[0].name } : null)
        setVerificationPeriod(
          e.verification_period
            ? { value: e.verification_period, label: e.verification_period }
            : null
        );
      });
    });
    // getCategory(token).then((response) => {
    //   setcategoryoptions(response.results)
    // })
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    // console.log('file...', file)
    if (file.type.split("/")[0] !== "image")
      return alert("This file type is not supported");
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const loggedIn = useSelector((state) => state.reducer.auth.loggedIn);
  useEffect(() => {
    if (loggedIn && imageFile && fullName && verificationPeriod) {
      navigate("/home");
    }
  }, [loggedIn, navigate]);

  const countriesOptions = useMemo(() => {
    if (countries) {
      console.log("country", countries);
      return countries.data.map((country) => ({
        value: country.country,
        label: country.country,
      }));
    }
  }, [countries]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !verificationPeriod)
      return alert("Please fill all fields.");
    console.log(
      imageFile,
      fullName,
      userName,
      location,
      // category,
      verificationPeriod
    );
    const formdata = {
      id: userID,
      user_data: JSON.stringify({
        name: fullName,
        email: userName,
        location: country,
        verification_period: verificationPeriod?.value,
      }),
    };
    if (imageFile) {
      formdata["profile_picture"] = imageFile;
    }
    updateProfile(formdata)
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
        console.log(err);
        window.alert(JSON.stringify(err));
      });
  };
  if (!countriesOptions) {
    return <LoadingSpinner />;
  }

  return (
    <Page>
      <Container
        width="727px"
        margin="100px"
        padding="70px"
        borderRadius="20px"
      >
        <Back onClick={handleLogout} />
        <Title>Create Profile</Title>

        <form onSubmit={onSubmit}>
          <ProfileImage
            imagePreview={imagePreview ? imagePreview : imageFile}
            handleImage={handleImage}
          />
          {upcomingdata.map((item) => {
            return (
              <>
                <InputGroup
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <InputGroup
                  disabled="true"
                  label="Email"
                  placeholder="Enter your email"
                  value={item.email}
                  onChange={(e) => setUserName(e.target.value)}
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
                  menuPosition="left"
                  placeholder='Select the category'
                  value={category}
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
                    value={verificationPeriod}
                    styles={customStyles}
                    onChange={(e) => {
                      console.log(e);
                      setVerificationPeriod(e);
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
                    Save
                  </Button>
                </ButtonBar>
              </>
            );
          })}
        </form>
      </Container>
    </Page>
  );
}
