import { useState } from 'react'
import './contact.css'
import { css, jsx } from '@emotion/react'
import { userProfile } from '../../../apollo'
import { gql, useQuery, useMutation } from '@apollo/client'
import { TextField } from '@material-ui/core'
import { useNavigate, Navigate } from 'react-router-dom'

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

function normalizeInput(value, previousValue){
  // return nothing if no value
  if (!value) return value; 

  // only allows 0-9 inputs
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length; 

  if (!previousValue || value.length > previousValue.length) {

    // returns: "x", "xx", "xxx"
    if (cvLength < 4) return currentValue; 

    // returns: "xxx", "xxx-x", "xxx-xx", "xxx-xxx",
    if (cvLength < 7) return `${currentValue.slice(0, 3)}-${currentValue.slice(3)}`; 

    // returns: "xxx-xxx-", xxx-xxx-x", "xxx-xxx-xx", "xxx-xxx-xxx", "xxx-xxx-xxxx"
    return `${currentValue.slice(0, 3)}-${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`; 
  }
};



function ContactForm () {
<<<<<<< HEAD
  const user = userProfile()
  const userName =
    sStorage.getItem('first name') + ' ' + sStorage.getItem('last name')
    const firstName = sStorage.getItem('first name')
  const navigate = useNavigate()
=======
  const user = JSON.parse(localStorage.getItem('userProfile'))
  const navigate = useNavigate()
  const userName = user.name
>>>>>>> 9580908c5ea5b32dfe81a52032d6261a6ac76322
  const [phone, setPhone] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [format, setFormat] = useState(null)
  const [errorState, setErrorState] = useState(false)
  function handleChange(target ) {  
    setPhone(target.value.replace(/[^\d]/g, '')); 
    setFormat(prevState => (normalizeInput(target.value, prevState)));
    setErrorState(false);
  };
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
  const [addPhone, { loading, error }] = useMutation(ADD_PHONE)


  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  if (confirmed) {
<<<<<<< HEAD
    localStorage.setItem('phone', phone)
=======
    Object.assign(user, {phone: phone.replaceAll("-","")})
    localStorage.setItem('userProfile', JSON.stringify(user))
    console.log('USER', JSON.parse(localStorage.getItem('userProfile')))
>>>>>>> 9580908c5ea5b32dfe81a52032d6261a6ac76322
    addPhone({ variables: { name: userName, phone: phone.replaceAll("-",""), netid: user.netid } })
    return <Navigate to='/launch' />
  }

  return (
    <div id='main-div'>
      <div id='elem-div'>

     
      <div id='greeting-container'>
        <p className='greetings'>Hello,</p>
<<<<<<< HEAD
        <p className='greetings'>{firstName}!</p>
=======
        <p className='greetings'>{userName}!</p>
>>>>>>> 9580908c5ea5b32dfe81a52032d6261a6ac76322
      </div>
        <p id="instruction" >
          Let's set up your profile with us. We'll need your phone number to send you updates on your order status.
        </p>
      <div className='tel-container'>
        <TextField
          type='tel'
          placeholder='Phone number:'
          id='tel'
          margin='dense'
          inputProps={{style: {fontSize: '0.7rem', fontFamily: 'Proxima Nova'}}}
          value = {format === null? "" : format}
          error={errorState}
          fullWidth = {true}
          onChange={e => {handleChange(e.target)}}
        />
      </div>
      <div id='btn-container'>
      <div
        className='confirm-btn'
        onClick={(event) => {
          if (phone && phone.length === 10) {
            setConfirmed(true)
          }else{setErrorState(true)}
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
