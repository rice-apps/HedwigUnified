import './fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const logoutURL = 'https://idp.rice.edu/idp/profile/cas/logout'

const getLinks = user => {
  const links = [
    { icon: 'phone', content: user.phone, path: '' },

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

function Profile ({ updateLogin }) {
  // const { data, loading, error } = useQuery(GET_USER_INFO)

  // if (error) return <p>Error!</p>
  // if (loading) return <p>Waiting...</p>
  // if (!data) return <p> work pls </p>

  // const { user } = data

  const user = JSON.parse(localStorage.getItem('userProfile'))
  const links = getLinks(user)

  function handleLogoutClick () {
    updateLogin(false)
    window.open(logoutURL, '_self')
  }

  return (
    <div className='profilepane'>
      <div className='background'>
        {/* Body: Welcome */}
        <div className='welcomebody'>
          <h1 className='welcometext'> Welcome, {user.name} </h1>
        </div>

        {/* Body: Links;;; should map through each of the links up top and create a box */}
        <div className='contentbody'>
          {links.map(link => (
            <div className='contentcard'>
              <div className='contenticon'>
                {' '}
                <FontAwesomeIcon icon={['fas', link.icon]} />
              </div>
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
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
