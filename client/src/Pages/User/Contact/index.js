import { useState } from 'react'
import './contact.css'
import { css, jsx } from '@emotion/react'
import { userProfile } from '../../../apollo'
import { gql, useQuery, useMutation } from '@apollo/client'
import { TextField } from '@material-ui/core'
import { useNavigate, Navigate } from 'react-router-dom'
import { centerCenter } from '../../../Styles/flex'

const ADD_PHONE = gql`
  mutation($name: String!, $phone: String!, $netid: String!) {
    userUpdateOne(
      record: { name: $name, phone: $phone }
      filter: { netid: $netid }
    ) {
      record {
        name
        phone
      }

      recordId
    }
  }
`

const sStorage = window.localStorage

function ContactForm () {
  const user = userProfile()
  const userName =
    sStorage.getItem('first name') + ' ' + sStorage.getItem('last name')
    const firstName = sStorage.getItem('first name')
  const navigate = useNavigate()
  const [phone, setPhone] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const record = {
    name: userName,
    netid: user.netid,
    phone: phone,
    token: user.token,
    recentUpdate: user.recentUpdate,
    type: user.type,
    vendor: user.vendor,
    isAdmin: user.isAdmin
  }
  const [addPhone, { loading, error, data }] = useMutation(ADD_PHONE)

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  if (confirmed) {
    localStorage.setItem('phone', phone)
    addPhone({ variables: { name: userName, phone: phone, netid: user.netid } })
    return <Navigate to='/launch' />
  }

  return (
    <div id='main-div'>
      <div id='elem-div'>

     
      <div id='greeting-container' className='texts'>
        <p className='greetings'>Hello,</p>
        <p className='greetings'>{firstName}!</p>
      </div>
        <p id="instruction">
          Let's set up your profile with us. We'll need your phone number to send you updates on your order status.
        </p>
      <div className='tel-container'>
        <TextField
          type='tel'
          placeholder='Phone number:'
          id='tel'
          margin='dense'
          fullWidth='true'
          inputProps={{style: {fontSize: '0.7rem'}}}
          onChange={e => setPhone(e.target.value)}
        />
      </div>
      <div id='btn-container'>
      <div
        className='confirm-btn'
        onClick={() => {
          if (phone && phone.length === 10) {
            setConfirmed(true)
          }
        }}
      >
        Confirm
      </div>
      </div>
      </div>
    </div>
  )
}

export default ContactForm
