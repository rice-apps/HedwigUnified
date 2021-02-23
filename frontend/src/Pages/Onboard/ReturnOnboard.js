import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

import { GRAPHQL_URL } from '../../config'

function ReturnOnboard () {
  const searchParams = new URLSearchParams(window.location.search)
  const [result, setResult] = useState(
    <div>
      <div>
        Something went wrong. You must <Link to='/onboard'>sign up here</Link>{' '}
        with your Square account to see this page.
      </div>
    </div>
  )

  const mutation = `mutation SetTokens($vendorName: String!, $slug: String!, $code: String!) {
    setupSquareTokens(vendorName: $vendorName, slug: $slug, code: $code)
  }`

  useEffect(() => {
    async function checkWithWorker () {
      let changedResult = (
        <div>
          <div>
            Sorry, but an unknown error has occurred. Please go{' '}
            <Link to='/onboard'>here</Link> to sign up again.
          </div>
        </div>
      )

      if (window.location.search === '') {
        changedResult = (
          <div>
            <div>
              Sorry, you must <Link to='/onboard'>sign up here</Link> with your
              Square account to see this page.
            </div>
          </div>
        )
      } else if (Cookies.get('authState') !== searchParams.get('state')) {
        changedResult = (
          <div>
            <div>
              Sorry, your authorization was invalid. Please try again by{' '}
              <Link to='/onboard'>returning to the sign up page here</Link>.
            </div>
          </div>
        )
      } else if (searchParams.has('error')) {
        changedResult = (
          <div>
            <div>
              Sorry! Signup failed with code ${searchParams.get('error')} for
              reason ${searchParams.get('error_description')}. If you believe
              this is a mistake,{' '}
              <Link to='/onboard'>please sign up again here</Link>.
            </div>
          </div>
        )
      } else if (searchParams.has('code')) {
        changedResult = <div>Loading...</div>

        const workerResponse = await window.fetch(GRAPHQL_URL, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            query: mutation,
            variables: {
              vendorName: Cookies.get('merchantName'),
              slug: Cookies.get('slug'),
              code: searchParams.get('code')
            }
          })
        })

        if (workerResponse.status === 200) {
          changedResult = (
            <div>
              <div>
                Thanks for signing up with Hedwig! Your vendor page will be
                ready shortly.
              </div>
            </div>
          )
        } else if (workerResponse.status === 405) {
          changedResult = (
            <div>
              <div>
                Please don't attempt to use anything other than POST. Go back to{' '}
                <Link to='/onboard'>the onboarding endpoint</Link>.
              </div>
            </div>
          )
        } else if (workerResponse.status === 400) {
          changedResult = (
            <div>
              <div>
                Your access code is invalid. Please attempt{' '}
                <Link to='/onboard'>reauthorization here</Link>.
              </div>
            </div>
          )
        }
      }

      setResult(changedResult)
    }

    checkWithWorker()
  }, [])

  return result
}

export default ReturnOnboard
