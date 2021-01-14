import { BsDisplay } from 'react-icons/bs'
import './App.css'
import { useState } from 'react'
import { RefreshDialog } from './components/refreshDialog'
import { RoutesComponent } from './components/Routes'
import moment from 'moment'

function App () {
  const [loggedIn, setLoggedIn] = useState(false)
  const [timeoutStatus, setTimeoutStatus] = useState(false)
  let timer = null

  // get the initial login status from localStorage
  // If both token and sessionExpire time is there, set loggedIn to true
  const currentToken = localStorage.getItem('idToken')
  const expTime = moment(localStorage.getItem('expireTime'))

  if (currentToken && !loggedIn) {
    setLoggedIn(true)
    if (!expTime && !timeoutStatus) {
      setTimeoutStatus(true)
    }
  }

  const timeoutCountDown = (time, token) => {
    setTimeoutStatus(false)
    if (token) {
      localStorage.setItem('idToken', token)
    }
    timer = setTimeout(() => {console.log('timeout!'); setTimeoutStatus(true)}, time)
  }

  const changeLoginStatus = (status, time) => {
    setLoggedIn(status)
    // If the user just logged in, timeoutSatus is false;
    // If the uesr logged out, timeoutStatus is also false
    setTimeoutStatus(false)
    if (status) {
      // If login is true, set the timer
      timeoutCountDown(time)
    } else {
      console.log('logout, stopping timer')
      // If the user logged out, clear the timer
      localStorage.removeItem('userProfile')
      localStorage.removeItem('idToken')
      localStorage.removeItem('expireTime')
      clearTimeout(timer)
    }
  }
  
  const changeTimeoutStatus = (status) => {
    setTimeoutStatus(status)
  }

  return (
    <>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0,
     user-scalable=0'
      />
      {/* <Header /> */}
      <RoutesComponent loginCallBack={changeLoginStatus} />
      <RefreshDialog display={timeoutStatus} changeTimeoutStatus={changeTimeoutStatus} timeoutCountDown={timeoutCountDown}/>
    </>
  )
}

export default App
