import {
  SQUARE_CONNECTION_BASE_URL,
  SQUARE_CLIENT_ID,
  HEDWIG_VENDOR_PERMISSIONS
} from '../../config'

import Cookies from 'js-cookie'
import crypto from 'crypto'
import { useState } from 'react'

const getOAuthLink = () => {
  const date = new Date()
  const unixTime = date.getTime()
  const authState = crypto
    .createHash('md5')
    .update(unixTime.toString())
    .digest('hex')

  Cookies.set('authState', authState, {
    expires: new Date(unixTime + 60 * 1000)
  })

  return `${SQUARE_CONNECTION_BASE_URL}oauth2/authorize?client_id=${SQUARE_CLIENT_ID}&scope=${HEDWIG_VENDOR_PERMISSIONS.join(
    '+'
  )}&state=${authState}&session=${process.env.NODE_ENV !== 'production'}`
}

function Onboard () {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        Cookies.set('merchantName', name, {
          expires: new Date(new Date().getTime() + 5 * 60 * 1000)
        })
        Cookies.set('slug', slug, {
          expires: new Date(new Date().getTime() + 5 * 60 * 1000)
        })
        window.open(getOAuthLink(name, slug), '_self')
      }}
    >
      <label>
        Merchant Name:
        <input
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Slug:
        <input
          type='text'
          value={slug}
          onChange={e =>
            setSlug(e.target.value.toLowerCase().replace(/\s+/g, ''))}
        />
      </label>
      <input type='submit' value='Grant Access' />
    </form>
  )
}

export default Onboard
