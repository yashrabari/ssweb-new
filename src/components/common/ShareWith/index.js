import React, { useState, useMemo, useEffect } from 'react'
import { Box } from "@mui/material"
import styled from "styled-components"
import Button from '../Button'
import Select from 'react-select';
import { useGetBuddiesQuery } from '../../../store/slice/api'
import Close from '../../../assets/images/close_icon.svg'
import Avatar from '../../../assets/images/avatar.png'
import { useSelector } from 'react-redux';

const Text = styled.span`
  font-family: "TT Commons";
  font-style: 'normal';
  font-size: 16px;
  font-weight: ${props => props.fontWeight || 500};
  color: black;
  line-height: 30px;
  margin-bottom:0
`
const Heading = styled.span`
  font-family: "TT Commons";
  font-style: 'normal';
  font-size: 20px;
  color: black;
  margin: auto 0;
  font-weight: 600;
  line-height: 30px
`

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    boxSizing: 'border-box',
    borderColor: '#eef3f7',
    backgroundColor: '#f5f8fa',
    borderRadius: '0px',
    paddingLeft: 5,
    height: '50px',
    fontSize: '1.15rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: '0.2s ease-in-out',
    border: '1px solid rgba(235, 235, 235, 0.42)',
    color: '#E0E0E0',

    '&:hover': {
      borderColor: '#eef3f7',
      backgroundColor: '#00A65',
    },

    '&:focus': {
      outline: 'none',
      backgroundColor: '#eef3f7',
    },
  }),

  placeholder: (provided, state) => ({
    ...provided,
    color: '#999db7',
    fontWeight: 'light',
    fontSize: '16px'
  }),

  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'black' : state.isFocused ? 'black' : 'black',
    backgroundColor: state.isSelected ? 'white' : state.isFocused ? 'white' : 'white',
    cursor: 'pointer',
    transition: '.2s ease-in-out',
    margin: 0,
    borderColor: 'white',
    boxShadow: 'rgba(10,6,5,0)',
    borderRadius: '0px',
  }),
  menu: (provided, state) => ({
    margin: 0,
    marginTop: '0px',
    marginBottom: '0px',
    border: 'none',
    borderWidth: 'none',
    outline: '0px solid transparent',
    boxShadow: '0 5px 15px 5px #f5f5f5',
  }),

  singleValue: (provided, state) => ({
    ...provided,
    color: '#5e6278',
    border: '0'
  })
}


const ShareWith = ({details}) => {
  const [isAddButtonShown, setIsAddButtonShown] = useState(false)
  const [selectedBuddies, setSelectedBuddies] = useState([])

  const user = useSelector(state => state.reducer.auth.user)

  const { data: myBuddies } = useGetBuddiesQuery()

  useEffect(() => {
    setIsAddButtonShown(false)
    setSelectedBuddies([])
  }, [details])
  

  const buddies = useMemo(() => {
    if (!Boolean(myBuddies?.length)) return []
    return myBuddies.filter((bud) => (!Boolean(details?.sharedWith?.length)) || details?.sharedWith.every((user) => user.id !== bud.id))
            .map((bud) => ({ value: bud.id, label: bud.buddydetail.username, image: bud.buddydetail.profile_picture }))
  }, [myBuddies, details.sharedWith])

  const filteredBuddies = useMemo(() => {
    if (!Boolean(selectedBuddies.length)) return buddies
    return buddies.filter((bud) => selectedBuddies.every((selected) => bud.value !== selected.value))
  }, [buddies, selectedBuddies])

  const selectBuddy = (selectedOptions) => {
    setSelectedBuddies([...selectedBuddies, selectedOptions])
  }

  return (
    <Box width='100%' height='70vh' sx={{ boxShadow: '0.5px 0.5px 0.5px #f5f5f5', borderRadius: '15px', paddingX: '20px', paddingY: '10px', border: '1px solid #f5f5f5', backgroundColor: 'white', marginTop: '10px', overflowY: 'auto' }}>
      <Heading>Details</Heading>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }} />
      <Text fontWeight='600'>Uploaded on: 12/03/2022</Text>
      <Box sx={{ marginTop: '10px' }}>
        <Text fontWeight='600'>Shared with</Text>
        {details.sharedWith.length
          ? details.sharedWith.map((member) => <Member name={member.buddydetail.username} profilePicture={member.buddydetail.profile_picture} />)
          : <Member name='Only Me' profilePicture={user.imageUrl || user.profile_picture} />
        }
      </Box>
      {Boolean(isAddButtonShown && filteredBuddies) &&
        <div style={{ marginTop: '20px' }}>
          <Select
            styles={customSelectStyles}
            closeMenuOnSelect={false}
            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, SingleValue: () => null }}
            placeholder='Add Buddies'
            onChange={selectBuddy}
            formatOptionLabel={(buddy) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden' }}>
                  {buddy.image
                    ? <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={buddy.image} alt='Profile picture' />
                    : <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={Avatar} alt='Profile picture' />
                  }
                </div>
                <Text>{buddy.label}</Text>
              </div>
            )}
            options={filteredBuddies}
          />
        </div>
      }
      {selectedBuddies &&
        selectedBuddies.map((selectedBuddies) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }} className="country-option">
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden' }}>
                {selectedBuddies.image
                  ? <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={selectedBuddies.image} alt='Profile picture' />
                  : <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={Avatar} alt='Profile picture' />
                }
              </div>
              <Text>{selectedBuddies.label}</Text>
            </div>
          )
        })
      }

      <Button
        width="150px"
        height="46px"
        color="#00A652"
        margin='20px 0 0 0'
        onClick={() => setIsAddButtonShown(true)}
      >
        {isAddButtonShown ? 'Add' : '+ Add Buddies'}
      </Button>
    </Box>
  )
}

const Member = ({name, profilePicture}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden' }}>
          {profilePicture
            ? <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={profilePicture} />
            : <img style={{ width: "100%", height: '100%', objectFit: 'cover', objectPosition: 'center' }} src={Avatar} />
          }
        </Box>
        <Text>{name}</Text>
      </Box>
      {name !== 'Only Me' && <img style={{ width: '20px', height: '20px', cursor: 'pointer' }} src={Close} />}
    </Box>
  )
}

export default ShareWith