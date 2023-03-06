import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import { Button, InputGroup, Row, Title } from "./common";
import { ReactComponent as CrossOutline } from "../assets/images/CrossOutline.svg";
import { useRenameFolderMutation } from "../store/slice/api";
import useWindowSize from "../utils/hook/useWindowSize";

const FolderRenameModal = ({ open, close, folder }) => {
  const [folderName, setFolderName] = useState("");
  const [renameFolder] = useRenameFolderMutation();

  console.log(folder);

  useEffect(() => {
    setFolderName(folder.name);
  }, [folder]);

  const RenameFolder = () => {
    if (!folderName) return alert("Please enter a folder name");
    renameFolder({ ...folder, name: folderName })
      .unwrap()
      .then(() => {
        setFolderName("");
        close();
      })
      .catch(() => {
        setFolderName("");
        close();
      });
  };

  const { width } = useWindowSize();

  return (
    <Modal
      open={open}
      onClose={close}
      keepMounted
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          height: width < 600 ? "auto" : "369px",
          maxWidth: "669px",
          width: "100%",
          left: "50%",
          top: "50%",
          borderRadius: "20px",
          backgroundColor: "white",
          outline: "none",
          boxShadow: 30,
          p: "45px 15px 25px 15px",
        }}
      >
        <Title fontWeight="700" margin="16px 0">
          Rename Folder
        </Title>
        <CrossOutline
          style={{
            position: "absolute",
            right: 20,
            top: 10,
            cursor: "pointer",
            width: width < 600 && "30px",
            height: width < 600 && "30px",
          }}
          onClick={close}
        />
        <Box
          sx={{ backgroundColor: "#f5f5f5", p: 3, m: 3, borderRadius: "20px" }}
        >
          <InputGroup
            width="545px"
            label="Title"
            placeholder="Type here"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <Row margin="0 auto" justifyContent="center">
            <Button color="#00A652" onClick={RenameFolder}>
              Rename
            </Button>
          </Row>
        </Box>
      </Box>
    </Modal>
  );
};

export default FolderRenameModal;
