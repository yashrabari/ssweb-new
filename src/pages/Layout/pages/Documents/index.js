import React, { useState, useEffect } from "react";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  InputGroup,
  OptionsMenu,
  Paragraph,
  // Row,
  Title,
} from "../../../../components/common";
import { logout } from "../../../../store/actions/auth";
import people from "../../../../assets/images/people.png";
import SignOut from "../../../../assets/images/SignOut.png";
import Group86 from "../../../../assets/images/Group 86.png";
import NotePencil from "../../../../assets/images/NotePencil.png";
import OptionMenuSettings from "../../../../components/common/OptionMenuSettings";
import BackTransactions from "../../../TransactionsPaymentHistory/BackTransactions";
import folder from "../../../../assets/images/folder.png";
import File from "../../../../assets/images/file.svg";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import FolderContainer from "../Home/FolderContainer";
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFoldersQuery,
} from "../../../../store/slice/api";
import Modal from "@mui/material/Modal";
import FolderOpen from "../../../../assets/images/FolderOpen.svg";
import Pencil from "../../../../assets/images/Pencil.svg";
import Trash from "../../../../assets/images/Trash.svg";
import Copy from "../../../../assets/images/Copy.svg";
import { ReactComponent as CrossOutline } from "../../../../assets/images/CrossOutline.svg";
import FolderRenameModal from "../../../../components/FolderRenameModal";
import ShareWith from "../../../../components/common/ShareWith";

import styled from "styled-components";
import useWindowSize from "../../../../utils/hook/useWindowSize";

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

export default function Documents() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isRenameModalOpen, toggleRenameModal] = useState(false);
  const [folderToRename, setFolderToRename] = useState({});

  const [field, setField] = useState("");
  const [deleteFolder] = useDeleteFolderMutation();
  const token = useSelector((state) => state.reducer.auth.token);

  const [createFolder] = useCreateFolderMutation();
  const { data: folders } = useGetFoldersQuery();
  const allFolders = folders?.results ? folders.results : [];

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

  const renameFolder = (folder) => {
    setFolderToRename(folder);
    toggleRenameModal(true);
  };

  const HandleCreateFolder = () => {
    createFolder(field)
      .unwrap()
      .then(() => {
        setOpen(false);
        setField("");
      })
      .catch(() => {
        setOpen(false);
        setField("");
      });
  };

  const { width } = useWindowSize();

  return (
    <>
      <Row
        width="100%"
        height="73px"
        padding="24px 0"
        alignItems="center"
        justifyContent="space-between"
      >
        <BackTransactions />
        <Title margin={width > 600 ? "8px 0px 0px 80px" : "8px 0px 0px 60px"}>
          Uploaded Folders
        </Title>

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
      {!Boolean(allFolders.length) && (
        <Row justifyContent="flex-end">
          <Button
            width="287px"
            height="46px"
            color="#00A652"
            onClick={() => setOpen(true)}
          >
            + Create New Folder
          </Button>
        </Row>
      )}
      {!Boolean(allFolders.length) ? (
        <>
          <Row height="100vh">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                marginTop: width <= 600 && "-40px",
              }}
            >
              <div style={{ width: "160px", height: "160px" }}>
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  src={File}
                />
              </div>
              <div className="text-center">
                <h1
                  style={{
                    fontFamily: "TT Commons",
                    fontWeight: 400,
                    fontSize: "24px",
                    marginTop: "30px",
                  }}
                >
                  Uploaded file will be displayed here
                </h1>
              </div>
            </div>
          </Row>
        </>
      ) : (
        <Row justifyContent="space-between">
          <div>
            <Box
              width="100%"
              height="auto"
              sx={{ display: "flex", flexWrap: "wrap" }}
            >
              {allFolders?.map((item, index) => {
                return (
                  <div style={{ position: "relative" }}>
                    <div
                      onClick={() =>
                        navigate(`/home/documents/folder/${item.id}`)
                      }
                    >
                      <FolderContainer
                        key={index}
                        width="274px"
                        height="173px"
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
                        <Title
                          fontSize="22px"
                          margin="20px 0px 0px 3px"
                          lineHeight="38px"
                          fontWeight="600"
                          fontFamily="TT Commons"
                        >
                          {item.name}
                        </Title>
                        <Paragraph fontSize="16px" margin="10px 0px 0px 3px">
                          {item.files.length} file
                        </Paragraph>{" "}
                      </FolderContainer>
                    </div>
                    <OptionsMenu
                      color="rgba(0, 0, 0, 0.4)"
                      orientation="horizontal"
                      options={[
                        {
                          text: "Open",
                          onClick: () => {
                            navigate(`/home/documents/folder/${item.id}`);
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
          </div>
          <Row justifyContent="flex-end">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button
                width="300px"
                height="46px"
                color="#00A652"
                margin="0"
                onClick={() => setOpen(true)}
              >
                + Create New Folder
              </Button>
              {/* <Row>
              <ShareWith />
            </Row> */}
            </div>
          </Row>
        </Row>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        keepMounted
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box style={style} className="modal">
          <Title fontWeight="700" margin="16px auto 0 25px">
            Create New Folder
          </Title>
          <CrossOutline
            style={{
              width: width < 600 && "30px",
              height: width < 600 && "30px",
              position: "absolute",
              right: 20,
              top: 10,
              cursor: "pointer",
            }}
            onClick={() => setOpen(false)}
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
              onChange={(e) => setField(e.target.value)}
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
