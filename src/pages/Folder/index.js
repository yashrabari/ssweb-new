import React, { useState, useMemo, useRef } from "react"
import { IoDocumentTextOutline, IoNotificationsOutline, IoMusicalNoteOutline, IoImageOutline, IoDocumentOutline } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { Column, IconButton, OptionsMenu, Paragraph, Row, Title } from "../../components/common"
import { logout } from "../../store/actions/auth"
import people from "../../assets/images/people.png"
import files from "../../assets/images/files.png"
import SignOut from "../../assets/images/SignOut.png"
import Group86 from "../../assets/images/Group 86.png"
import NotePencil from "../../assets/images/NotePencil.png"
import OptionMenuSettings from "../../components/common/OptionMenuSettings"
import { useDispatch } from "react-redux"
import BackTransactions from "../TransactionsPaymentHistory/BackTransactions"
import { Box } from "@mui/material"
import FolderContainer from "../Layout/pages/Home/FolderContainer"
import { truncateString } from "../../utils/functions"
import { useDeleteFileMutation, useGetBuddiesQuery, useGetFolderDetailsQuery, useUploadFilesMutation } from "../../store/slice/api"
import { NewFile } from "../../components/Home"
import ShareWith from "../../components/common/ShareWith"

export default function Folder() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams();
  const inputFile = useRef(null)

  const [selectedFileId, setSelectedFileId] = useState()

  const [uploadFiles, {isLoading: isFileUploading}] = useUploadFilesMutation();
  const [deleteFile] = useDeleteFileMutation();
  const { data: getBuddiesResponse } = useGetBuddiesQuery();
  const { data: folder, isLoading, isSuccess, error } = useGetFolderDetailsQuery(params.id)
  console.log('files of folder...', folder, isLoading, isSuccess, error);

  const buddies = Boolean(getBuddiesResponse?.length) ? getBuddiesResponse : []

  const addRandomPortion = (array1, array2) => {
    for (var i = 0; i < array2.length; i++) {
      var sliceLength = Math.floor(Math.random() * (array1.length - 1));
      var start = Math.floor(Math.random() * (array1.length - sliceLength));
      var end = start + sliceLength;
      var sharedWith = array1.slice(start, end);
      array2[i].sharedWith = sharedWith;
    }
    return array2;
  }

  const folderDetails = useMemo(() => {
    if (!folder?.files) return ({})
    return {
      ...folder,
      files: addRandomPortion(buddies, Object.assign([], folder.files.map((file) => ({...file}))))
    }
  }, [folder])

  if (isLoading) {
    return null;
  }

  const makeFileCopy = async (item) => {
    console.log('file to copy', item);
    // uploadFiles({file, folderId: folder.id});
  }

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
        <Title margin='0px 0px 0px 80px'>Folders {'>'} {folder.name}</Title>
        <Row>
          <OptionMenuSettings
            options={[
              { Icon: people, text: "My Buddies", onClick: () => { navigate('/home/my-buddies') } },
              { Icon: Group86, text: "My transactions", onClick: () => { navigate('/home/transactions') } },
              { Icon: NotePencil, text: "Send Feedback", onClick: () => { navigate('/home/send/feedback')} },
              {
                Icon: SignOut, text: "Logout", onClick: () => {
                  dispatch(logout())
                  navigate("/")
                }
              }
            ]}
          />
          <IconButton onClick={() => { navigate('/home/notifications') }}>
            <IoNotificationsOutline />
          </IconButton>
        </Row>
      </Row>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <Box width='85%' height='auto' sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {Boolean(folderDetails.files.length) &&
            folderDetails.files.map((item, index) => {
              return (
                <FolderContainer
                  key={index}
                  width='150px'
                  height='150px'
                  flexDirection='column'
                  justifyContent='flex-start'
                  alignItems='flex-start'
                  padding='10px'
                  margin='10px'
                  borderRadius='15px'
                  isSelected={selectedFileId === item.id}
                  onClick={() => setSelectedFileId(item.id)}
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <OptionsMenu
                      color="rgba(0, 0, 0, 0.4)"
                      orientation="horizontal"
                      options={[
                        { text: "Open", onClick: () => { window.open(item.file) } },
                        { text: "Rename", onClick: () => { } },
                        { text: "Delete", onClick: () => { deleteFile(item.id) } },
                        { text: "Make a Copy", onClick: () => { makeFileCopy(item)} }
                      ]}
                    />
                  </div>
                  <Column justifyContent={'flex-end'}>
                    <Row alignItems={'center'} margin='0px 0px 15px'>
                      {
                        item.extension.includes('application')
                          ? <IoDocumentTextOutline color='#00A652' size='18px' />
                          : item.extension.includes('image')
                            ? <IoImageOutline color='#FF5F5F' size='18px' />
                            : item.extension.includes('music')
                              ? <IoMusicalNoteOutline color='#1877F2' size='18px' />
                              : <IoDocumentOutline color='#00A652' size='18px' />
                      }
                      <Title fontSize='10px' margin='0px 10px'>{truncateString(item.name)}</Title>
                    </Row>
                  </Column>
                </FolderContainer>
              )
            })
          }
          {isFileUploading
            ? <FileLoading />
            : <>
                {!Boolean(folderDetails.files.length) &&
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80vh' }}>
                    <img src={files} height={'240px'} width={'240px'} />
                    <Paragraph margin={'10px 0px'}>Drop files here</Paragraph>
                  </div>
                }
              </>
          }
        </Box>
        <Row justifyContent='flex-end'>
            <div style={{display:'flex', flexDirection:'column'}}>
              <NewFile onClick={() => inputFile.current.click()} position={'static'} width='300px'>
                + Upload new File
                <input type="file" onClick={(e) => { e.target.value = null }} onChange={(e) => { uploadFiles({ file: e.target.files[0], folderId: folderDetails.id }).unwrap().then(res => console.log('upload file', res)) }} ref={inputFile} style={{ display: 'none' }} />
              </NewFile>
              {Boolean(selectedFileId) &&
                <Row>
                  <ShareWith details={folderDetails.files.find((file) => file.id === selectedFileId)} />
                </Row>
              }
            </div>
          </Row>
      </div>
    </>
  )
}

const FileLoading = () => {
  return (
    <FolderContainer
      width='150px'
      height='150px'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      padding='10px'
      margin='10px'
      borderRadius='15px'
    >
      <div style={{ display: 'flex', alignItems: 'center', }}>
        <IoDocumentOutline color='#00A652' size='18px' />
        <Title fontSize='12px' margin='0px 10px'>Uploading...</Title>
      </div>
    </FolderContainer>
  )
}
