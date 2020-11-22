import React from 'react';

import { useState } from 'react'
import './contact.css'
import { css, jsx } from '@emotion/core'
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

function ContactForm() {
  const user = userProfile()
  const userName =
    sStorage.getItem('first name') + ' ' + sStorage.getItem('last name')
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
    return <Navigate to='/eat' />
  }

  return (
    <div>
      <div id='header-container' className='texts'>
        <h2 className='center-header'>Hedwig</h2>
      </div>
      <div id='greeting-container' className='texts'>
        <h3>Hello, {userName}!</h3>
      </div>
      <div id='text-container' className='texts'>
        <p>
          In order to send you timely updates on your order status, please tell
          us your phone number.
        </p>
      </div>
      <div className='tel-container'>
        <TextField
          type='tel'
          label='phone number:'
          id='tel'
          margin='dense'
          onChange={e => setPhone(e.target.value)}
        />
      </div>
      <div
        variant='outlined'
        className='confirm-btn'
        onClick={() => {
          if (phone && phone.length == 10) {
            setConfirmed(true)
          }
        }}
      >
        confirm
      </div>
    </div>
  )
}

export default ContactForm
