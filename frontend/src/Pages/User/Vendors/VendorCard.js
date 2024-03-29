import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './vendor.css'
import { IoIosClose } from 'react-icons/io'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import MoreInfo from './MoreInfo'

export const convertTimeToNum = time => {
  const [timeNum, halfOfDay] = time.split(' ')
  let [hours, minutes] = timeNum.split(':')
  hours = parseInt(hours)
  minutes = parseInt(minutes) / 60
  if ((halfOfDay === 'a.m.') & (hours === 12)) {
    return minutes
  } else if (halfOfDay === 'a.m.' || (halfOfDay === 'p.m.') & (hours === 12)) {
    return hours + minutes
  } else if (halfOfDay === 'p.m.') {
    return 12 + hours + minutes
  }
}

function VendorCard ({ vendor }) {
  const {
    name,
    hours,
    logoUrl,
    facebook,
    phone,
    cutoffTime,
    pickupInstruction,
    email,
    orderOpeningTime
  } = vendor

  const [statusDetail, setStatusDetail] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  // const {data : all_vendors, errors: vendor_errors, loading: vendor_loading} = useQuery(GET_ALL_VENDORS);

  // make testMode true if you want the store to be open
  const testMode = false

  const navigate = useNavigate()

  // if (errors) return <h1>lol oops something broke</h1>;
  // if (loading) return <h1>loading... be patient u hoe</h1>

  // open status text
  const openStatusText = {
    openning: ' OPEN ',
    kitchenClosed: ' KITCHEN CLOSED ',
    closed: ' CLOSED '
  }

  // includes time
  const current_date = new Date()
  const currentDay = testMode ? 1 : current_date.getDay()
  const dayObj = hours[currentDay]
  console.log(dayObj)

  const startTimes = hours[currentDay].start
  const endTimes = hours[currentDay].end

  const times = []
  for (let i = 0; i < startTimes.length; i++) {
    times.push([startTimes[i], endTimes[i]])
  }

  const handleClickInfo = () => {
    setShowInfo(!showInfo)
  }

  const determineIfClosed = (current_date, dayObj) => {
    if (!dayObj) return
    // PLAY AROUND WITH CURRENTTIME FOR TESTING PURPOSES
    if (dayObj.isClosed === true) {
      return { status: 'closed' }
    }
    const currentTime = testMode
      ? 9
      : current_date.getHours() + current_date.getMinutes() / 60
    for (let i = 0; i < dayObj.start.length; i++) {
      const startTime = convertTimeToNum(dayObj.start[i])
      const endTime = convertTimeToNum(dayObj.end[i])

      if (orderOpeningTime !== null) {
        if (
          currentTime >= convertTimeToNum(orderOpeningTime) &&
          currentTime <= startTime
        ) {
          return { status: 'openning' }
        }
      }

      if (
        currentTime >= startTime &&
        currentTime <= endTime - cutoffTime / 60
      ) {
        return { status: 'openning' }
      } else if (
        currentTime > endTime - cutoffTime / 60 &&
        currentTime <= endTime
      ) {
        return { status: 'kitchenClosed', nextClose: dayObj.end[i] }
      } else if (currentTime < startTime) {
        return { status: 'closed', nextOpen: dayObj.start[i], restOfDay: true }
      }
    }
    return { status: 'closed', nextOpen: dayObj.start[0], restOfDay: false }
  }

  const handleClickStatus = () => {
    setStatusDetail(!statusDetail)
  }

  const openStatus = determineIfClosed(current_date, dayObj)
  const handleClick = () => {
    if (openStatus.status === 'openning') {
      // Go to this particular vendor's detail page
      return navigate(`/eat/${vendor.slug}`, {
        state: { currentVendor: name, slug: vendor.slug }
      })
    } else {
      handleClickStatus()
    }
  }

  const showStatusDetail = () => {
    if (openStatus.status === 'kitchenClosed' && statusDetail) {
      return (
        <div className='detailWrapper'>
          <div className='detailBox'>
            <div className='closeIcon'>
              {' '}
              <IoIosClose size='12%' onClick={() => handleClickStatus()} />
            </div>
            <div className='detailText'>
              <h1>Kitchen Closed</h1>
              <p> {name} is no longer accepting orders </p>
              <p>
                Orders placed before {openStatus.nextClose} can be picked up as
                scheduled
              </p>
            </div>
          </div>
        </div>
      )
    } else if (openStatus.status === 'closed' && statusDetail) {
      return (
        <div className='detailWrapper'>
          <div className='detailBox'>
            <div className='closeIcon'>
              {' '}
              <IoIosClose size='12%' onClick={() => handleClickStatus()} />
            </div>
            <div className='detailText'>
              <h1>Closed</h1>
              {openStatus.restOfDay ? (
                <p>
                  {' '}
                  {name} will be opening at {openStatus.nextOpen}
                </p>
              ) : (
                <p> {name} is closed for the day! </p>
              )}
            </div>
          </div>
        </div>
      )
    }
  }
  console.log(hours)
  return (
    <div className='vendorContainer'>
      {showStatusDetail()}
      <div className='vendorImageContainer' onClick={() => handleClick()}>
        <img
          className={
            openStatus.status === 'openning'
              ? 'vendorImage'
              : 'vendorImage closed'
          }
          src={logoUrl}
        />
      </div>
      <div className='vendorHeading'>
        <div className='vendorHeadingText' onClick={() => handleClick()}>
          <h3 className='vendorName'>{name}</h3>
          {/* Case for two start/end times */}
          {dayObj && dayObj.start.length >= 1 && (
            <p>
              {' '}
              Hours Open:{' '}
              {times.map(time => {
                return (
                  <span key={time}>
                    <br />
                    {time[0]}
                    {' - '}
                    {time[1]}
                  </span>
                )
              })}
            </p>
          )}
        </div>
        <div className='vendorHoursIcon'>
          <button
            className={'statusIcon ' + openStatus.status}
            onClick={() => handleClick()}
          >
            {openStatusText[openStatus.status]}
          </button>
          <AiOutlineInfoCircle
            onClick={() => handleClickInfo()}
            style={{ marginRight: '1.2vh', fontSize: '2.3vh' }}
          />
        </div>
      </div>
      {showInfo && <MoreInfo {...vendor} changeStatus={setShowInfo} />}
    </div>
  )
}

export default VendorCard
