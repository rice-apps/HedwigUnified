import React, {useState} from 'react'
import './contact.css'
import { css, jsx } from '@emotion/core'
import { userProfile } from '../../../apollo'
import { gql, useQuery, useMutation } from '@apollo/client'
import { TextField } from '@material-ui/core';
import { useNavigate, Navigate } from 'react-router-dom'
import { centerCenter } from '../../../Styles/flex';

const GET_USER_INFO = gql`
query GetUserInfo($_id: String!) {
  user @client (_id: $_id) {
    _id
    recentUpdate
    name
    netid 
    phone
  }
}
`;

const AUTHENTICATE_USER = gql`
  mutation AuthenticateMutation($ticket: String!) {
    authenticateUser(ticket: $ticket) {
      _id
      netid
      token
      recentUpdate
      phone
    }
  }
`
function ContactForm() {
  const user = userProfile();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [
    authenticateUser,
    { data: authenticationData, loading, error }
  ] = useMutation(AUTHENTICATE_USER, { variables: { ticket: user.ticket } })
  // const { data, loading, error } = useQuery(GET_USER_INFO, 
  //   {variables: {_id: user._id}
  // });
  
  if (userProfile().length == 0) {
    return <Navigate to='/login' />
  }

  if (confirmed) {
    return <Navigate to='/' />
  }

  if (loading) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>Error.</p>
  }
  // console.log(authenticationData);
  // console.log(authenticateUser);
  // authenticateUser({variables: {ticket: user.ticket}})
  
  // console.log(authenticationData);
  return (
    <div>
      <div id="header-container" className="texts">
        <h2 className="center-header">Hedwig</h2>
      </div>
      <div id="greeting-container" className="texts">
        <h3>Hello, {user.netid}!</h3>
      </div>
      <div id="text-container" className="texts">
        <p>In order to send you timely updates on 
          your order status, please tell us your phone number.
        </p>
      </div>
      <div class="tel-container"> 
        <TextField type="tel" label="phone number" id="tel" onChange={e => {
          console.log(e.target); setPhone(e.target.value)}}></TextField>
      </div>
      <div variant="outlined" class="confirm-btn" onClick={() => {
        if (phone.length == 10) {
          setConfirmed(true);
        }
      }}>confirm</div>
    </div>
  );
}

export default ContactForm;