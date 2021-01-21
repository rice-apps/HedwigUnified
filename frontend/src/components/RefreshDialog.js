import React from 'react'
import styled from 'styled-components'
import firebase from 'firebase/app'
import { Button } from '../Pages/User/AlmostThere'
import moment from 'moment'

export const DialogPage = styled.div`
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const DialogWindow = styled.div`
  text-align: center;
  background-color: white;
  position: relative;
  padding: 5px 8px;
  width: 15rem;
  height: auto;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 0px rgb(185, 185, 185);
  border: rgb(218, 218, 218) 0.5px solid;
`

export const CloseIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 0.35rem 0.35rem 0 0;
`

export const DialogText = styled.p`
  margin: 10px 0px 20px 0px;
  font-size: 0.83rem;
  line-height: 1.1rem;
`

export const DialogHeader = styled.h1`
  margin-bottom: 0;
  color: #ea907a;
`

export const RefreshDialog = ({display, changeTimeoutStatus, timeoutCountDown, updateToken}) => {
  const handleRefreshClick = () => {
    const user = firebase.auth().currentUser
    if (!user) {
      // cannot find the current user
      // force re-login
      // not in the router so directly reloads window
      console.log('please log in again')
      window.location.reload()
    }
    const refreshResult = user.getIdTokenResult(true)
    timeoutCountDown(40 * 60 * 1000, refreshResult.token)
    localStorage.setItem('expireTime', moment().add(40, 'minute'))
  }

  return (
    display ? 
    <DialogPage>
      <DialogWindow>
        <DialogHeader>Alert</DialogHeader>
        <DialogText>Your session will expire soon. 
          Click on the button below to refresh. 
        </DialogText>
        <Button onClick={handleRefreshClick}>Refresh</Button>
      </DialogWindow>
    </DialogPage>
    : null
  )
}
