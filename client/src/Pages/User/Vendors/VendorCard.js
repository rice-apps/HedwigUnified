import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomAppBar from './BottomAppBar.js'
import curbsidelogo from '../../../images/curbsidelogo.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDoorOpen, faDoorClosed } from '@fortawesome/free-solid-svg-icons'

function VendorCard ({ vendor }) {
  const { name, hours, logoUrl } = vendor

  // const {data : all_vendors, errors: vendor_errors, loading: vendor_loading} = useQuery(GET_ALL_VENDORS);

  const navigate = useNavigate()

  // if (errors) return <h1>lol oops something broke</h1>;
  // if (loading) return <h1>loading... be patient u hoe</h1>

  const handleClick = () => {
    // Go to this particular vendor's detail page
    return navigate(`/eat/${vendor.slug}`, { state: { currentVendor: name } })
  }

  // includes time
  const current_date = new Date()
  const currentDay = current_date.getDay()
  const dayObj = hours[0]
  console.log(dayObj)

  const convertTimeToNum = time => {
    const [timeNum, halfOfDay] = time.split(' ')
    let [hours, minutes] = timeNum.split(':')
    hours = parseInt(hours)
    minutes = parseInt(minutes) / 60
    if (halfOfDay === 'a.m.') {
      return hours + minutes
    } else if (halfOfDay === 'p.m.') {
      return 12 + hours + minutes
    }
  }

  const determineIfClosed = (current_date, dayObj) => {
    if (!dayObj) return
    const currentTime = current_date.getHours() + current_date.getMinutes() / 60
    const startTime = convertTimeToNum(dayObj.start[0])
    const endTime = convertTimeToNum(dayObj.end[0])
    return currentTime <= startTime || currentTime >= endTime
  }

  const closed = determineIfClosed(current_date, dayObj)

  return (
    <>
      <div className='vendorContainer' onClick={() => handleClick()}>
        <div className='vendorHeading'>
          <div className='vendorHeadingText'>
            <h3 className='vendorName'>{name}</h3>
            {/* Case for two start/end times */}
            {dayObj && dayObj.start.length > 1 && (
              <p>
                Hours Open: <br />
                {dayObj.start[0]}
                {' - '}
                {dayObj.end[0]}
                {', '}
                <br />
                {dayObj.start[1]}
                {' - '}
                {dayObj.end[1]}
              </p>
            )}
            {/* Case for one start/end time */}
            {dayObj && dayObj.start.length == 1 && (
              <p>
                Hours Open: {dayObj.start[0]}
                {' - '}
                {dayObj.end[0]}{' '}
              </p>
            )}
            {/* Case for one start/end time */}
            {dayObj && dayObj.start.length == 1 && (
              <p>
                Hours Open: {dayObj.start[0]}{' - '}{dayObj.end[0]}{' '}
              </p>
            )}
            
          </div>
          <div className='vendorHoursIcon'>
            {closed ? (
              <FontAwesomeIcon className='door' icon={faDoorClosed} />
            ) : (
              <FontAwesomeIcon className='door' icon={faDoorOpen} />
            )}
          </div>
        </div>
        <div className='vendorImageContainer'>
          {closed ? (
            <span>
              <p className='closedText'>Closed</p>
            </span>
          ) : null}
          {
            <img
<<<<<<< HEAD
              className={closed ? `vendorImage closed` : `vendorImage`}
              src={curbsidelogo}
=======
              className={closed ? 'vendorImage closed' : 'vendorImage'}
              src={logoUrl}
>>>>>>> 74fffe95b0e5569be1ca8f2a1e93100c1f695251
            />
          }
        </div>
      </div>
      {/* <div style={{ backgroundImage: `url(${vendor.imageURL})` }} className="vendorcard" onClick={handleClick}>
          </div> */}
      {/* <div>
              <ul>
                  <li>Food</li>
                  <li>Drink</li>
                  <li>Snacks</li>
                  <li>Coffee</li>
              </ul>
          </div> */}
    </>
  )
}

export default VendorCard
