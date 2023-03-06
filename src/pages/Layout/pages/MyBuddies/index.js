import React, { useMemo } from "react";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { useSelector, useStore, useDispatch } from "react-redux";
import {
  Button,
  CheckBox,
  IconButton,
  Image,
  OptionsMenu,
  Paragraph,
  // Row,
  Title,
} from "../../../../components/common";
import {
  AddBuddyModal,
  Table,
  TableBodyRow,
  TableHeadRow,
} from "../../../../components/MyBuddies";
import { useModal } from "../../../../context/modal-context";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../store/actions/auth";
import people from "../../../../assets/images/people.png";
import SignOut from "../../../../assets/images/SignOut.png";
import Group86 from "../../../../assets/images/Group 86.png";
import NotePencil from "../../../../assets/images/NotePencil.png";
import OptionMenuSettings from "../../../../components/common/OptionMenuSettings";
import AlertModal from "../../../../components/common/AlertModal";
import {
  useAddBuddyMutation,
  useDeleteBuddyMutation,
  useGetBuddiesQuery,
  useGetMyProfileQuery,
} from "../../../../store/slice/api";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

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

export default function MyBuddies() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.auth.token);
  const [buddies, setbuddies] = useState([]);
  const store = useStore();
  const { setModal } = useModal();
  const [selectedBuddies, setSelectedBuddies] = useState({});
  const [checkBox, setCheckBox] = useState(false);

  const {
    data: myProfile,
    isLoading: isProfileLoading,
    isSuccess: isProfileSuccessfullyLoaded,
  } = useGetMyProfileQuery();
  const {
    data: myBuddies,
    isLoading: loadingBuddies,
    isSuccess: buddiesSuccessfullyLoaded,
  } = useGetBuddiesQuery();
  const [addBuddy] = useAddBuddyMutation();
  const [deleteBuddy] = useDeleteBuddyMutation();

  const userProfile = useMemo(() => {
    if (myProfile?.results) {
      return myProfile.results[0];
    }
    return null;
  }, [myProfile]);

  useEffect(() => {
    setbuddies(myBuddies);
  }, [myBuddies]);

  useEffect(() => {
    const initialSelectedBuddies = {};
    buddies.forEach(({ id }) => {
      initialSelectedBuddies[id] = false;
    });
    setSelectedBuddies({});
  }, [setSelectedBuddies]);

  // const checkAllBuddiesSelected = () => {
  //   const values = Object.values(selectedBuddies)
  //   for (const value of values) {
  //     if (!value) return false
  //   }
  //   return true
  // }

  const toggleAllBuddies = () => {
    const allBuddies = {};
    buddies.forEach(({ id }) => {
      allBuddies[id] = checkBox;
    });
    setSelectedBuddies(allBuddies);
  };

  useEffect(() => {
    toggleAllBuddies();
  }, [checkBox]);

  const toggleBuddy = (id) => {
    setSelectedBuddies((currentSelectedBuddies) => {
      return {
        ...currentSelectedBuddies,
        [id]: !currentSelectedBuddies[id],
      };
    });
  };
  const HandleDelete = (id) => {
    deleteBuddy(id)
      .unwrap()
      .then()
      .catch((err) => {
        console.log(err);
        alert(JSON.stringify(err));
      });
  };

  const addNewBuddy = () => {
    if (userProfile?.subscription?.status === "active" || buddies.length < 2) {
      setModal(<AddBuddyModal addBuddies={addBuddy} store={store} />);
    } else {
      setModal(
        <AlertModal
          message={"Please Subscribe for adding more buddies ☺️"}
          buttonText={"Subscribe"}
          onSubmit={() => {
            navigate("/subscriptions");
          }}
        />
      );
    }
  };

  return (
    <>
      <Row
        width="100% !important"
        height="73px"
        padding="24px 0"
        alignItems="center"
        justifyContent="space-between"
        className="pb-0"
      >
        <Title>My Buddies</Title>

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
            <IoNotificationsOutline />
          </IconButton>
        </Row>
      </Row>

      {Boolean(isProfileLoading || loadingBuddies) ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            margin="24px 0 12px"
            className="mt-0"
          >
            <Paragraph bold fontSize="24px" color="#000">
              All Buddies
            </Paragraph>
            <Button
              width="151px"
              height="46px"
              color="#00A652"
              onClick={addNewBuddy}
            >
              + Add new Buddy
            </Button>
          </Row>
          <div className="table_responsive">
            <Table>
              <thead>
                <TableHeadRow>
                  <th>
                    <CheckBox
                      checked={checkBox}
                      onChange={() => setCheckBox(!checkBox)}
                    />
                  </th>
                  <th>Contact Name</th>
                  <th>Relation</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Member Type</th>
                </TableHeadRow>
              </thead>
              <tbody>
                {buddies?.map((item, index) => (
                  <TableBodyRow key={index}>
                    <td>
                      <CheckBox
                        checked={selectedBuddies[item.id] === true}
                        onChange={() => toggleBuddy(item.id)}
                      />
                    </td>
                    <td>
                      <Row alignItems="center">
                        {item.profile_picture && (
                          <Image
                            width="36px"
                            height="36px"
                            borderRadius="50%"
                            objectFit="cover"
                            src={item.profile_picture}
                            alt="Person"
                          />
                        )}
                        {item.buddydetail ? item.buddydetail.username : "N/A"}
                      </Row>
                    </td>
                    <td>{item.relationship ?? "N/A"}</td>
                    <td>
                      {item.buddydetail ? item.buddydetail.phone_number : "N/A"}
                    </td>
                    <td>{item.email ?? "N/A"}</td>
                    <td>
                      {item.member_type === 1
                        ? "General member"
                        : "Sub prime" ?? "N/A"}
                    </td>
                    <td>
                      <OptionsMenu
                        options={[
                          { text: "Promote SubPrime", onClick: () => {} },
                          {
                            text: "Delete",
                            onClick: () => {
                              HandleDelete(item.id);
                            },
                          },
                        ]}
                      />
                    </td>
                  </TableBodyRow>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
