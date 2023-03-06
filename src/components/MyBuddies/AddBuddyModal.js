import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import styled from "styled-components"
import { postAddBuddy } from "../../api"
import getBuddy from "../../api/getBudddy"
import { useModal } from "../../context/modal-context"
import { addBuddy } from "../../store/actions/Buddies"
import {
  Button,
  Column,
  InputGroup,
  Paragraph,
  Row,
  Select,
  Title
} from "../common"
import AlertModal from "../common/AlertModal"

const Container = styled.div`
  width: 621px;
  background: #f5f5f5;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
  padding: 20px;
`

export default function AddBuddyModal({ addBuddies, store }) {
  const { unSetModal } = useModal()
  const [email, setEmail] = useState("")
  const [Errors, setErrors] = useState('')
  const [relation, setRelation] = useState("")
  const [memberType, setMemberType] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const addBuddyError = store.getState()?.buddies?.error
      const addBuddySuccess = store.getState()?.buddies?.success
      setError(addBuddyError)
      setSuccess(addBuddySuccess)
    })
    return unsubscribe
  }, [store])
  const handleSubmit = () => {
    // console.log('Buddy...:', {email, relationship: relation});
    const formdata = { email, relationship: relation }
    if (memberType) {
      formdata['member_type'] = memberType === "General member" ? 1 : 2
    }
    addBuddies(formdata).unwrap()
      .then((res) => {
        store.dispatch(addBuddy())
        unSetModal()
      })
      .catch((err) => {
        console.error(err)
        if (err.response.data.email) {
          alert(err.response.data.email[0])
        }
        if (err.response.data.relationship) {
          alert(err.response.data.relationship[0])
        }
      })
  }

  return (
    <Column
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      height=""
    >
      <Title fontWeight="700" margin="16px 0">
        Add New Buddy
      </Title>
      <Container>
        <InputGroup
          label="Email of the buddy"
          placeholder="Enter your buddies Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Select
          label="Select relationship"
          placeholder="Select the relationship"
          options={["Marriage partner", "Power of attorney", "other"]}
          value={relation}
          onChange={e => setRelation(e.target.value)}
          margin="0 0 8px"
        />
        <Select
          label="Select member type"
          placeholder="Select member type"
          options={["General member", "Sub prime"]}
          value={memberType}
          onChange={e => setMemberType(e.target.value)}
          margin="8px 0"
        />
      </Container>
      {error && (
        <Paragraph width="" color="#FF5F5F">
          Unable to add buddy
        </Paragraph>
      )}
      {success && (
        <Paragraph width="" color="#00A652">
          Buddy added successfully
        </Paragraph>
      )}
      {Errors === 'Enter a valid email address.' && (
        <Paragraph width="" color="#FF5F5F">
          {Errors}
        </Paragraph>
      )}
      {Errors === 'This field may not be blank.' && (
        <Paragraph width="" color="#FF5F5F">
          Email cannot be blank
        </Paragraph>
      )}
      <Row justifyContent="flex-end">
        <Button
          width="151px"
          height="50px"
          color="#FBBC05"
          onClick={handleSubmit}
        >
          Send Invite Link
        </Button>
        <Button
          width="151px"
          height="50px"
          color="#00A652"
          onClick={handleSubmit}
        >
          Add Buddy
        </Button>
      </Row>
    </Column>
  )
}
