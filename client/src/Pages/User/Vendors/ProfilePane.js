import './ProfilePane.css'
import { gql, useQuery, useApolloClient } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

const logoutURL = 'https://idp.rice.edu/idp/profile/cas/logout'

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
  const links = [
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

function ProfilePane () {
  const [showProfile, setShowProfile] = useState(false)

  const { data, loading, error } = useQuery(GET_USER_INFO)

  if (error) return <p>Error!</p>
  if (loading) return <p>Waiting...</p>
  if (!data) return <p> work pls </p>

  const { user } = data
  const links = getLinks(user)

  return (
    <>
      <FaBars
        onClick={() => {
          setShowProfile(!showProfile)
          console.log(showProfile)
        }}
        style={{
          position: 'fixed',
          left: '22px',
          verticalAlign: 'middle',
          height: '4.5vh',
          width: '4.5vh',
          top: '2.5vh',
          zIndex: '2'
        }}
      />
      <div className={showProfile ? 'profilepane-active' : 'profilepane'}>
        <div className='background'>
          <div className='close'>
            <FaTimes
              onClick={() => {
                setShowProfile(!showProfile)
                console.log(showProfile)
              }}
            />
          </div>
          
          {/* Body: Welcome */}
          <div className='welcomebody'>
            <h1 className='welcometext'> Hello, <br/> {user.name} <br/> </h1>
            <h1 className='phonetext'>
              ({user.phone.substring(0, 3)}) {' '} {user.phone.substring(3, 6)} 
              {'-'} {user.phone.substring(6)} 
            </h1>
          </div>

          {/* Body: Links;;; should map through each of the links up top and create a box */}
          <div className='contentbody'>
            {links.map(link => (
              <div className='contentcard'>
                <p className='contenttitle'>{link.content}</p>
                {/* Checks if path exists, if not, then don't put an arrow */}
                {link.path ? (
                  <button
                    className='contentarrow'
                    onClick={() => window.open(link.path, '_self')}
                  >
                    <FontAwesomeIcon icon={['fas', 'chevron-right']} />
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Footer: SignOut */}
          <div className='profilefooter'>
            <button className='signoutbutton' onClick={handleLogoutClick}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePane
