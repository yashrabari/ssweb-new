import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  CustomLink,
  IconButton,
  InputGroup,
  OptionsMenu,
  Paragraph,
  Title,
} from "../../../../components/common";
import {
  IoEllipsisHorizontalOutline,
  IoNotificationsOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import {
  AddOns,
  FileCount,
  HomeContainer,
  NewFile,
  NewFolder,
  Profile,
} from "../../../../components/Home";
import FolderContainer from "./FolderContainer";
import Modal from "@mui/material/Modal";
import { filesbg, spaceImg } from "../../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import folder from "../../../../assets/images/folder.png";
import people from "../../../../assets/images/people.png";
import SignOut from "../../../../assets/images/SignOut.png";
import Group86 from "../../../../assets/images/Group 86.png";
import NotePencil from "../../../../assets/images/NotePencil.png";
import { Box } from "@mui/material";
import getFilesCount from "../../../../api/getFilesCount";
import postUploadFiles from "../../../../api/postUploadFiles";
import getFiles from "../../../../api/getFiles";
import moment from "moment";
import { useModal } from "../../../../context/modal-context";
import StorageFullModal from "./StorageFullModal";
import { useNavigate } from "react-router-dom";
import OptionMenuSettings from "../../../../components/common/OptionMenuSettings";
import { logout } from "../../../../store/actions/auth";
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFoldersQuery,
  useGetMyProfileQuery,
  useGetStorageQuery,
} from "../../../../store/slice/api";
import { truncateString } from "../../../../utils/functions";
import { ReactComponent as CrossOutline } from "../../../../assets/images/CrossOutline.svg";
import { PieChart } from "react-minimal-pie-chart";
import { getProfile } from "../../../../store/slice/mainSlice";
import FolderRenameModal from "../../../../components/FolderRenameModal";
import styled from "styled-components";

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.justifyContent};
  height: ${(props) => props.height ?? "100%"};
  /* overflow: ${(props) => props.overflow ?? "auto"}; */
  /* flex-basis: ${(props) => props.width}; */
  width: ${(props) => props.width ?? "0"};
  flex-grow: 0;
  flex-shrink: 0;
  padding: ${(props) => props.padding ?? "0"};
  margin: ${(props) => props.margin ?? "0"};
  box-sizing: border-box;
  ${(props) =>
    props.hideScrollBar ? "::-webkit-scrollbar {display: none;}" : ""};
`;

const Image = styled.img`
  width: ${(props) => props.width ?? "-webkit-fill-available"};
  height: ${(props) => props.height};
  object-fit: ${(props) => props.objectFit ?? "contain"};
  margin: ${(props) => props.margin ?? "5px"};
  border-radius: ${(props) => props.borderRadius};

  @media (max-width: 1200px) {
    width: -webkit-fill-available;
  }
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  height: ${(props) => props.height};
  padding: ${(props) => props.padding};
  width: ${(props) => props.width};
  margin: ${(props) => props.margin};
  gap: ${(props) => props.gap};
  ${(props) => props.link && "cursor:pointer;"}/* @media (max-width:400px) {
    width: 245px !important;
  } */
`;

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setopen] = useState(false);
  const { setModal } = useModal();
  const [field, setfield] = useState("");
  const [isRenameModalOpen, toggleRenameModal] = useState(false);
  const [folderToRename, setFolderToRename] = useState({});
  const [pdfcount, setpdfcount] = useState(0);
  const [pngcount, setpngcount] = useState(0);
  const [jpegCount, setJpegCount] = useState(0);
  const [otherFilesCount, setOtherFilesCount] = useState(0);
  const [FilesData, setFilesData] = useState([]);
  const token = useSelector((state) => state.reducer.auth.token);
  const user = useSelector((state) => state.reducer.auth.user);
  const [deleteFolder] = useDeleteFolderMutation();
  const {
    data: myProfile,
    isLoading,
    isSuccess,
    error,
  } = useGetMyProfileQuery();
  const {
    data: storage,
    isLoading: isStorageLoading,
    refetch: getStorage,
  } = useGetStorageQuery();
  const [createFolder] = useCreateFolderMutation();
  const { data: folders } = useGetFoldersQuery();
  const allFolders = folders?.results ? folders.results : [];

  useEffect(() => {
    if (isSuccess && !isLoading && myProfile.results) {
      const user = myProfile.results[0];
      if (user.name && user.verification_period) {
        dispatch(getProfile(user));
      } else {
        navigate("/create-profile");
      }
    }
  }, [isLoading, isSuccess]);

  const HandleCreateFolder = () => {
    createFolder(field)
      .unwrap()
      .then(() => {
        setopen(false);
        setfield("");
      })
      .catch(() => {
        setopen(false);
        setfield("");
      });
  };

  useEffect(() => {
    getFilesCount(token).then((response) => {
      response.result.map((item) => {
        if (item.extension === "application/pdf") {
          setpdfcount(item.count);
        } else if (item.extension === "image/png") {
          setpngcount(item.count);
        } else if (item.extension === "image/jpeg") {
          setJpegCount(item.count);
        }
      });
      setOtherFilesCount(
        response.result.reduce((total, current) => {
          if (
            current.extension === "application/pdf" ||
            current.extension === "image/png" ||
            current.extension === "image/jpeg"
          )
            return total;
          return total ? total + current.count : current.count;
        }, 0)
      );
    });
    getFiles(token).then((response) => {
      setFilesData(response.results);
    });
  }, []);
  const style = {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    height: "369px",
    width: "669px",
    left: "50%",
    top: "50%",
    borderRadius: "20px",
    backgroundColor: "white",
    outline: "none",
    boxShadow: 30,
    p: "45px 15px 25px 15px",
  };
  const Folders = allFolders.slice(0, 5);
  const ThreeFilesRecords = FilesData.slice(0, 3);
  const fileCountData = [
    { color: "#DFF9EC", count: pdfcount ? pdfcount : 0, type: "PDF Files" },
    { color: "#FDF1CD", count: pngcount ? pngcount : 0, type: "PNG Files" },
    { color: "#FEEBE1", count: jpegCount, type: "JPEG Files" },
    { color: "#E3EEFF", count: otherFilesCount, type: "Other Files" },
  ];
  const postFile = (fileToUpload) => {
    postUploadFiles(token, fileToUpload)
      .then((response) => {
        console.log("file upload response...", response);
        if (response.message === "Your storage is full.") {
          setModal(<StorageFullModal navigate={navigate} />);
        } else {
          getFiles(token).then((response) => {
            getStorage();
            setFilesData(response.results);
            dispatch(getProfile(myProfile.results[0]));
          });
        }
      })
      .catch((error) => {
        console.log("file upload error...", error);
      });
  };

  const renameFolder = (folder) => {
    setFolderToRename(folder);
    toggleRenameModal(true);
  };

  console.log("user...", user);
  return (
    <>
      <Row
        width="100%"
        height="100%"
        padding="24px 0"
        alignItems="center"
        justifyContent="space-between"
        className="flex_column"
      >
        <div className="welcome_flex">
          <Paragraph color="#000">Welcome, 👋</Paragraph>
          <Title className="title">
            {user?.name ? user?.name : "Antor P."}
          </Title>
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

      <Row
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        gap="20px"
        className="column_1"
      >
        <Column width="70%" className="width-100 h-unset">
          <Row
            className="grid_file"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            gap="10px"
          >
            {fileCountData.map((value, index) => (
              <FileCount
                key={index}
                color={value.color}
                count={value.count}
                type={value.type}
              />
            ))}
          </Row>

          <Row
            justifyContent="space-between"
            width="100%"
            gap="20px"
            className="column_2"
          >
            <HomeContainer
              title="Uploaded Folders"
              width="60%"
              height="349px"
              className="width-100-2"
              onViewAll={() => navigate("/home/documents")}
            >
              <Box
                width="100%"
                height="auto"
                sx={{ display: "flex", flexWrap: "wrap" }}
              >
                {Folders.map((item, index) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <div
                        onClick={() => navigate(`documents/folder/${item.id}`)}
                      >
                        <FolderContainer
                          key={index}
                          width="130px"
                          height="95px"
                          flexDirection="column"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          padding="10px"
                          margin="10px"
                          borderRadius="7px"
                        >
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#ffeeea",
                              }}
                            >
                              <img
                                width="20px"
                                height="20px"
                                src={folder}
                                style={{
                                  paddingTop: "10px",
                                  paddingLeft: "10px",
                                }}
                              />
                            </div>
                          </div>
                          <Title fontSize="10px" margin="10px 0px 0px 3px">
                            {item.name}
                          </Title>
                          <Paragraph fontSize="12px" margin="3px 0px 0px 3px">
                            {item.files.length} file
                          </Paragraph>
                        </FolderContainer>
                      </div>
                      <OptionsMenu
                        color="rgba(0, 0, 0, 0.4)"
                        orientation="horizontal"
                        options={[
                          {
                            text: "Open",
                            onClick: () => {
                              navigate(`documents/folder/${item.id}`);
                            },
                          },
                          {
                            text: "Rename",
                            onClick: () => {
                              renameFolder(item);
                            },
                          },
                          {
                            text: "Delete",
                            onClick: () => {
                              deleteFolder(item.id);
                            },
                          },
                          { text: "Make a Copy", onClick: () => {} },
                        ]}
                        position="absolute"
                      />
                    </div>
                  );
                })}
              </Box>
              {/* <Box width='100%' height='auto' sx={{ display: 'flex' }}>
                {TwoRecords.map((item) => {
                  return (
                    <FolderContainer
                      width='130px'
                      height='95px'
                      flexDirection='column'
                      justifyContent='flex-start'
                      alignItems='flex-start'
                      padding='10px'
                      margin='4px 0px 0px 15px'
                      borderRadius='7px'
                    >
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%', backgroundColor: '#ffeeea'
                        }} >
                          <img width="20px" height="20px" src={folder} style={{
                            paddingTop: '10px', paddingLeft: '10px'
                          }} />
                        </div>
                        <IoEllipsisHorizontalOutline color="rgba(0, 0, 0, 0.4)" />
                      </div>
                      <Title fontSize='10px' margin='10px 0px 0px 3px'>{item.name}</Title>
                      <Paragraph fontSize='12px' margin='3px 0px 0px 3px'>{item.files.length} file</Paragraph>
                    </FolderContainer>
                  )
                })}
              </Box> */}
              <NewFolder onChange="" setopen={setopen} />
            </HomeContainer>

            <HomeContainer
              title="Uploaded Files"
              className="width-100-2"
              width="40%"
              height="349px"
            >
              {ThreeFilesRecords.map((item, i) => {
                return (
                  <div key={i}>
                    <FolderContainer
                      width="40%"
                      height="40px"
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      padding="10px"
                      borderRadius="0px"
                      onClick={() => window.open(item.file)}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div width="100%" style={{ display: "flex" }}>
                          <div
                            style={{
                              width: "55px",
                              height: "40px",
                              borderRadius: "9px",
                              backgroundColor: "rgba(0, 166, 82, 0.1)",
                            }}
                          >
                            <IoDocumentTextOutline
                              style={{ padding: "10px" }}
                              color="#00A652"
                              size="23px"
                              width="20px"
                              height="20px"
                            />
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: "40px",
                              margin: "0px 0px 0px 10px",
                              display: "flex",
                              alignItems: "flex-start",
                              flexDirection: "column",
                            }}
                          >
                            <Title fontSize="13px">
                              {truncateString(item.name, 20)}
                            </Title>
                            <Paragraph fontSize="13px">
                              Uploaded on :{" "}
                              {moment(item.uploaded_on).format("L")}{" "}
                            </Paragraph>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            margin: "0px 10px 0px 0px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IoEllipsisHorizontalOutline color="rgba(0, 0, 0, 0.4)" />
                        </div>
                      </div>
                    </FolderContainer>
                    <div
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                        width: "100%",
                        height: "1px",
                      }}
                    />
                  </div>
                );
              })}
              <NewFile>
                <label
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  + Upload new File
                  <input
                    type="file"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    onChange={(e) => {
                      postFile(e.target.files[0]);
                    }}
                  />
                </label>
              </NewFile>
            </HomeContainer>
          </Row>

          <Row justifyContent="space-between" gap="20px" className="column_2">
            <HomeContainer
              width="40%"
              height="100%"
              padding="10px"
              justifyContent="space-around"
            >
              <Image width="110px" src={spaceImg} />

              <Paragraph
                bold
                fontSize="22px"
                color="#000"
                margin="10px 0 10px 0"
              >
                Get More Space
                <br />
                for your files
              </Paragraph>

              <CustomLink to="/subscriptions">
                <AddOns>Check Add-ons</AddOns>
              </CustomLink>
            </HomeContainer>

            <HomeContainer
              width="60%"
              style={{
                backgroundImage: `url(${filesbg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            >
              <HomeContainer
                width="100%"
                height="351px"
                alignItems="flex-start"
                justifyContent="center"
                style={{
                  backgroundColor: "#0000009C",
                  margin: 0,
                  padding: "0 32px",
                }}
              >
                <Title
                  textAlign="left"
                  fontSize="26px"
                  lineHeight=""
                  style={{ width: "100%", color: "#FFFFFF" }}
                  whiteSpace="wrap"
                >
                  Keep your Files Secured and share with the person you want
                </Title>
                <Title
                  textAlign="left"
                  fontSize="14px"
                  fontWeight="400"
                  style={{
                    width: "95%",
                    color: "#FFFFFFCC",
                    lineHeight: "20px",
                    marginTop: "10px",
                  }}
                  whiteSpace="wrap"
                >
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal
                </Title>
                <Title
                  textAlign="left"
                  fontSize="16px"
                  fontWeight="600"
                  style={{
                    color: "#FFFFFF",
                    lineHeight: "26px",
                    marginTop: "15px",
                  }}
                >
                  Explore now
                </Title>
              </HomeContainer>
            </HomeContainer>
          </Row>
        </Column>

        <Column width="30%" className="width-100 h-unset">
          <HomeContainer
            width="93%"
            height="290px"
            alignItems="start"
            padding="20px"
            className="width-100"
          >
            <Title fontSize="22px">Storage Capacity</Title>
            <PieChart
              viewBoxSize={[154, 154]}
              center={[77, 77]}
              totalValue={storage && storage.results[0].storage}
              data={[
                {
                  title: "Used",
                  value: `${storage && storage.results[0].storage_left}`,
                  color: "#FBBC05",
                },
                {
                  title: "Free Space",
                  value: `${
                    storage &&
                    storage.results[0].storage - storage.results[0].storage_left
                  }`,
                  color: "#1877f2",
                },
              ]}
              labelPosition={90}
              label={({ x, y, dx, dy, dataEntry }) => {
                return (
                  <g fill="#fff">
                    <circle
                      cx={x + dx}
                      cy={y + dy}
                      r={12}
                      fill="white"
                      style={{
                        stroke: "black",
                        strokeWidth: "1",
                        strokeOpacity: "0.1",
                      }}
                    ></circle>
                    <text
                      x={x}
                      y={y}
                      dx={dx}
                      dy={dy}
                      fill="#000"
                      text-anchor="middle"
                      dominant-baseline="central"
                      style={{
                        fontWeight: 600,
                        fontSize: "10px",
                        textAlign: "center",
                        textAnchor: "center",
                        fontFamily: "TT Commons",
                      }}
                    >{`${Math.round(dataEntry.value)}%`}</text>
                  </g>
                );
              }}
            />
            <Row
              alignItems="center"
              justifyContent="space-between"
              width="226px"
            >
              <Row alignItems="center">
                <div
                  style={{
                    backgroundColor: "#FBBC05",
                    height: 12,
                    width: 12,
                    borderRadius: 100,
                    marginRight: 4,
                  }}
                />
                <Title fontSize="12px" fontWeight="400">
                  Used
                </Title>
              </Row>
              <Row alignItems="center">
                <div
                  style={{
                    backgroundColor: "#1877F2",
                    height: 12,
                    width: 12,
                    borderRadius: 100,
                    marginRight: 4,
                  }}
                />
                <Title fontSize="12px" fontWeight="400">
                  Free Space
                </Title>
              </Row>
            </Row>
          </HomeContainer>

          <HomeContainer
            className="width-100"
            width="93%"
            height="546px"
            title="Recent Activity"
          >
            {/* Recent activities renders here */}
          </HomeContainer>
        </Column>
      </Row>
      <Modal
        open={open}
        onClose={() => setopen(false)}
        keepMounted
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box style={style} className="modal">
          <Title fontSize="1.7rem" fontWeight="700" margin="16px auto 0 25px">
            Create New Folder
          </Title>
          <CrossOutline
            style={{
              position: "absolute",
              right: 20,
              top: 10,
              cursor: "pointer",
            }}
            onClick={() => setopen(false)}
          />
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 3,
              m: 3,
              borderRadius: "20px",
            }}
          >
            <InputGroup
              width="545px"
              label="Title"
              placeholder="Type here"
              value={field}
              onChange={(e) => setfield(e.target.value)}
            />

            <Row justifyContent="flex-end">
              <Button
                width="151px"
                height="50px"
                color="#00A652"
                onClick={HandleCreateFolder}
              >
                Create
              </Button>
            </Row>
          </Box>
        </Box>
      </Modal>

      <FolderRenameModal
        open={isRenameModalOpen}
        close={() => {
          toggleRenameModal(false);
          setFolderToRename({});
        }}
        folder={folderToRename}
      />
    </>
  );
}
