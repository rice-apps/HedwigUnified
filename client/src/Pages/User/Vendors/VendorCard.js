import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { IoIosClose } from 'react-icons/io'
import {AiOutlineInfoCircle} from 'react-icons/ai'
import './vendor.css'

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
  // DEBUGGING
  // const { name, hours, logoUrl, phone, email, pickupInstruction } = vendor
  const { name, hours, logoUrl, phone, email } = vendor
  const pickupInstruction = "Enter campus from Rice Entrance #2. Turn left at the stop sign and park in Founder’s Court Lot."
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
  const startTimes = hours[currentDay].start
  const endTimes = hours[currentDay].end

  const times = []
  for (let i = 0; i < startTimes.length; i++) {
    times.push([startTimes[i], endTimes[i]])
  }

  const determineIfClosed = (current_date, dayObj) => {
    if (!dayObj) return
    // PLAY AROUND WITH CURRENTTIME FOR TESTING PURPOSES
    // DEBUGGING
    return { status: 'openning' };
    const currentTime = testMode
      ? 9
      : current_date.getHours() + current_date.getMinutes() / 60
    for (let i = 0; i < dayObj.start.length; i++) {
      const startTime = convertTimeToNum(dayObj.start[i])
      const endTime = convertTimeToNum(dayObj.end[i])
      if (currentTime >= startTime && currentTime <= endTime - 0.25) {
        return { status: 'openning' }
      } else if (currentTime > endTime - 0.25 && currentTime <= endTime) {
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
      return navigate(`/eat/${vendor.slug}`, { state: { currentVendor: name } })
    } else {
      handleClickStatus()
    }
  }

  const showInfoDetail = () =>{ 
    if(showInfo){ 
      return (
        <div className='detailWrapper'>
          <div className='detailBox'>
          <div className='closeIcon'>
              <IoIosClose size='12%' onClick={() => handleClickInfo()} />
            </div>
            <div className='detailText'>
              <h1 style={{fontWeight:'bold'}}>{name}</h1>
              <div className='detailContact'>{phone}</div>
              <div className='detailContact'>{email}</div>
            </div>
            <div className='detailText infoText'>
              {dayObj && (
                <p className='dayHour'>
                  {' '}
                  {dayObj.day}{' '}
                  {times.lengt&&<div>Closed for the day</div>}
                    
                  {times.map(time => {
                    return (
                      <span key={time[0]}>
                        <br />
                        {time[0]}
                        {' - '}
                        {time[1]}
                      </span>
                    )
                  })}
                 </p>
              )}
              {pickupInstruction && (
                <p>
                <span className='instructionTitle'>Pick Up Instructions:</span>
                {(pickupInstruction.split('. ').map(text => {
                  return( 
                    <p className='instructionText' key={text}>{text}</p>
                  )
                } 
                ))}
                </p>
              )}
                
              
            </div>
          </div>
        </div>
      )
    }
  }

  const showStatusDetail = () => {
    if(showInfo === true){return}
    if (openStatus.status === 'kitchenClosed' && statusDetail) {
      return (
        <div className='detailWrapper'>
          <div className='detailBox'>
            <div className='closeIcon'>
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

  const handleClickInfo = () => { 
    setShowInfo(!showInfo);
  }

  return (
    <div className='vendorContainer'>
      {showStatusDetail()}
      {showInfoDetail()}
      <div className='vendorImageContainer' onClick={()=>handleClick()}>
        <img
          className={
            openStatus.status === 'openning'
              ? 'vendorImage'
              : 'vendorImage closed'
          }
          src={logoUrl}
        />
      </div>
      <div className='vendorHeading' >
        <div className='vendorHeadingText'onClick={()=>handleClick()}>
          <div className='vendorName'>{name}</div>
        </div>
          <button className={'statusIcon ' + openStatus.status}onClick={()=>handleClick()} >
            {openStatusText[openStatus.status]}
          </button>
        <AiOutlineInfoCircle className='infoIcon' onClick={()=>handleClickInfo()} />
      </div>
    </div>
  )
}

export default VendorCard
