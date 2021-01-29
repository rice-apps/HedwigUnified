import './ProfilePane.css'
import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { FaBars, FaTimes, FaChevronRight } from 'react-icons/fa'
import { TextField } from '@material-ui/core'
import gql from 'graphql-tag.macro'
import styled from 'styled-components/macro'

const logoutURL = 'https://idp.rice.edu/idp/profile/cas/logout'

const SignOutButton = styled.div`
  border: 1px solid #5a595326;
  background-color: #db6142;
  font-family: 'avenirbook';
  color: white;
  font-size: 3vh;
  align-self: flex-end;
  margin-bottom: 5vh;
  border-radius: 30px;
  height: 8vh;
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
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

const getLinks = () => {
  const links = [
    { icon: 'hands-helping', content: 'Help', path: '/help' },
    {
      icon: 'question-circle',
      content: 'About the Creators',
      path: '/about_us'
    },
    {
      icon: 'question-circle',
      content: 'About RiceApps',
      path: 'https://riceapps.org/'
    },

    {
      icon: 'paper-plane',
      content: 'Feedback',
      path:
        'https://docs.google.com/forms/d/e/1FAIpQLSetekjRuZWNc5MB1hwQW_ihNeH07PfAzJzJX2BuLZHM78T7GA/viewform'
    }
  ]

  return links
}

function ProfilePane ({ updateLogin }) {
  const [showProfile, setShowProfile] = useState(false)

  const [phone, setPhone] = useState(null)
  const [editing, setEditing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const [
    editPhone,
    { loading: phone_loading, error: phone_error }
  ] = useMutation(EDIT_PHONE)

  if (phone_error) return <p> {phone_error.message} </p>
  if (phone_loading) return <p> (Phone) Waiting... </p>

  const user = JSON.parse(localStorage.getItem('userProfile'))
  const links = getLinks(user)

  if (confirmed) {
    localStorage.setItem('phone', phone)
    localStorage.setItem(
      'userProfile',
      JSON.stringify(Object.assign(user, { phone: phone }))
    )
    editPhone({
      variables: { name: user.name, phone: phone, netid: user.netid }
    })
    window.location.reload(false)
  }

  function handleLogoutClick () {
    updateLogin(false)
    window.open(logoutURL, '_self')
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
            <h1 className='welcometext'>
              Hello, <br /> {user.name.split(' ')[0]} <br />
            </h1>
            <h1 className='phonetext'>
              {editing ? (
                <TextField
                  type='telinput'
                  id='telinput'
                  onChange={e => setPhone(e.target.value)}
                />
              ) : (
                <>
                  ({user.phone.substring(0, 3)}) {user.phone.substring(3, 6)}-
                  {user.phone.substring(6)}
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
              <div
                className='contentcard'
                onClick={() => window.open(link.path, '_self')}
              >
                <div className='contenttitle'>{link.content}</div>

                <FaChevronRight
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open(link.path, '_self')}
                />
              </div>
            ))}
          </div>

          {/* Footer: SignOut */}
          <div className='profilefooter'>
            <SignOutButton onClick={handleLogoutClick}>Log Out</SignOutButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePane
