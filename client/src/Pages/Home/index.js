import React from 'react';
import { useEffect } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'

import PortalCard from './PortalCard'
/**
 * This simply fetches from our cache whether a recent update has occurred
 * TODO: CREATE FRAGMENTS / PLACE TO STORE ALL OF THESE SINCE THIS ONE IS ALSO IN ROUTES.JS
 */
const GET_RECENT_UPDATE = gql`
  query GetRecentUpdate {
    user @client {
      recentUpdate
    }
  }
`

/**
 * Updates the user object field of recentUpdate
 */
const SEEN_RECENT_UPDATE = gql`
  mutation SeenRecentUpdate {
    userUpdateOne(record: { recentUpdate: false }) {
      recordId
    }
  }
`

function Home() {
  // Check for recent update from cache
  const { data: storeData } = useQuery(GET_RECENT_UPDATE)
  const { recentUpdate } = storeData.user

  // Need to be able to update recentUpdate field on the user when they dismiss
  const [seenRecentUpdate] = useMutation(SEEN_RECENT_UPDATE)

  // Add toast
  const { addToast } = useToasts()

  useEffect(() => {
    if (recentUpdate) {
      const message = 'Recent Update Message.'
      addToast(message, {
        appearance: 'info',
        onDismiss: () => seenRecentUpdate()
      })
    }
  }, [addToast, recentUpdate, seenRecentUpdate])

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        position: 'relative',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBFBFB'
      }}
    >
      <div style={{ display: 'inline-block', color: '#272D2D' }}>
        <h3>Home Screen</h3>
        <PortalCard />
      </div>
    </div>
  )
}

export default Home
