import './ProfilePane.css'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { TextField } from '@material-ui/core'

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

const EDIT_PHONE = gql`
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

const getLinks = user => {
  const links = [
    { icon: 'hands-helping', content: 'Help', path: '/help' },

    {
      icon: 'question-circle',
      content: 'About',
      path: 'https://riceapps.org/'
    },

    { 
      icon: 'paper-plane', 
      content: 'Feedback', 
      path: 'https://docs.google.com/forms/d/e/1FAIpQLSetekjRuZWNc5MB1hwQW_ihNeH07PfAzJzJX2BuLZHM78T7GA/viewform'
    }
  ]

  return links
}

function ProfilePane () {
  const [showProfile, setShowProfile] = useState(false)

  const [phone, setPhone] = useState(null)
  const [editing, setEditing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const { data, loading, error } = useQuery(GET_USER_INFO)

  const [editPhone, { loading: phone_loading, error: phone_error, data: phone_data }] = useMutation(EDIT_PHONE)

  if (error) return <p>Error!</p>
  if (loading) return <p>Waiting...</p>
  if (!data) return <p> work pls </p>

  if (phone_error) return <p> {phone_error.message} </p>
  if (phone_loading) return <p> (Phone) Waiting... </p>

  
  const { user } = data
  const links = getLinks(user)

  if (confirmed) {
    localStorage.setItem('phone', phone)
    editPhone({ variables: { name: user.name, phone: phone, netid: user.netid } })
    window.location.reload(false)
  }

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
          color: '#474747',
          verticalAlign: 'middle',
          fontSize: '2.8vh',
          top: '2.8vh',
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
              {editing ? (
                <TextField
                  type='telinput'
                  id='telinput'
                  onChange={e => setPhone(e.target.value)}
                />
              ) : (
                <>
                  ({user.phone.substring(0, 3)}) {' '} {user.phone.substring(3, 6)} 
                  {'-'}{user.phone.substring(6)} 
                </>
              )}
            
              {editing ? (
                <button
                  className='phoneconfirm'
                  onClick={() => {
                    if (phone && phone.length === 10) {
                      setEditing(false)
                      setConfirmed(true)
                    }
                  }}
                >
                  <FontAwesomeIcon icon={['fas', 'check']} />
                </button>
              ) : (
                <button
                  className='phoneedit'
                  onClick={() => {
                    setEditing(true)
                  }}
                >
                  <FontAwesomeIcon icon={['fas', 'edit']} />
                </button>
              )}
              
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
