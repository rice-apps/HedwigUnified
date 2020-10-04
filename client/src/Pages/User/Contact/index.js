import React from 'react'
import './contact.css'
import { css, jsx } from '@emotion/core'
import { userProfile } from '../../../apollo'
import { gql, useQuery } from '@apollo/client'
import { TextField } from '@material-ui/core';
import { useNavigate, Navigate } from 'react-router-dom'
import { centerCenter } from '../../../Styles/flex';

const GET_USER_INFO = gql`
query GetUserInfo {
  user @client {
    _id
    recentUpdate
    name
    netid 
    phone
  }
}
`;

function ContactForm({authenticationData}) {
  const user = userProfile()[0];
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_USER_INFO);
  
  console.log(authenticationData)
  if (user.length == 0 && authenticationData==null) {
    return <Navigate to='/login' />
  }
  console.log(user);

  if (loading) {
    return <p>loading...</p>
  }
  if (error) {
    return <p>Error.</p>
  }
  
  return (
    <div>
      <div id="header-container" className="texts">
        <h2 className="center-header">Hedwig</h2>
      </div>
      <div id="greeting-container" className="texts">
        <h3>Hello, (name place holder)!</h3>
      </div>
      <div id="text-container" className="texts">
        <p>In order to send you timely updates on 
          your order status, please tell us your phone number.
        </p>
      </div>
      <div class="tel-container"> 
        <TextField type="tel" label="phone number" id="tel"></TextField>
      </div>
      <div variant="outlined" class="confirm-btn">confirm</div>
    </div>
  );
}

export default ContactForm;