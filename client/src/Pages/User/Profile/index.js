import React from 'react'
import './index.css'
import { gql, useQuery, useApolloClient } from '@apollo/client'
import './fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

let logoutURL = 'https://idp.rice.edu/idp/profile/cas/logout'

function handleLogoutClick () {
  localStorage.removeItem('token')
  window.open(logoutURL, '_self')
}

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
`

const getLinks = user => {
  // Missing help path, feedback form, and edit phone number page
  let links = [
    { icon: 'envelope', content: user.netid, path: '' },

    { icon: 'phone', content: user.phone, path: '' },

    { icon: 'receipt', content: 'Past Orders', path: 'user/orders' },

    { icon: 'star-and-crescent', content: 'Loyalty Programs', path: '' },

    { icon: 'hands-helping', content: 'Help', path: '' },

    {
      icon: 'question-circle',
      content: 'About',
      path: 'https://riceapps.org/'
    },

    { icon: 'paper-plane', content: 'Feedback', path: '' }
  ]

  return links
}

const Profile = () => {
  const { data, loading, error } = useQuery(GET_USER_INFO)

  if (error) return <p>Error!</p>
  if (loading) return <p>Waiting...</p>
  if (!data) return <p> work pls </p>

  let { user } = data
  const links = getLinks(user)

  return (
    <div class='background'>
      {/* Header: My Profile */}
      <div class='profileheader'>
        <button class='backarrow' onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={['fas', 'arrow-left']} />
        </button>
        <h1 class='profilename'>My Profile</h1>
      </div>

      {/* Body: Welcome */}
      <div class='welcomebody'>
        <h1 class='welcometext'> Welcome,</h1>
        <h1 class='nametext'>
          {' '}
          {user.name} <FontAwesomeIcon icon={['fas', 'edit']} />{' '}
        </h1>
      </div>

      {/* Body: Links;;; should map through each of the links up top and create a box */}
      <div class='contentbody'>
        {links.map(link => (
          <div class='contentcard'>
            <div class='contenticon'>
              {' '}
              <FontAwesomeIcon icon={['fas', link.icon]} />
            </div>
            <p class='contenttitle'>{link.content}</p>
            {/* Checks if path exists, if not, then don't put an arrow */}
            {link.path ? (
              <button
                class='contentarrow'
                onClick={() => window.open(link.path, '_self')}
              >
                <FontAwesomeIcon icon={['fas', 'chevron-right']} />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Footer: SignOut */}
      <div class='profilefooter'>
        <button class='signoutbutton' onClick={handleLogoutClick}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Profile
