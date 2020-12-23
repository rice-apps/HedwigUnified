import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomAppBar from './BottomAppBar.js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IoIosClose } from 'react-icons/io'

function VendorCard ({ vendor }) {
  const { name, hours, logoUrl } = vendor
  const [statusDetail, setStatusDetail] = useState(false)
  // const {data : all_vendors, errors: vendor_errors, loading: vendor_loading} = useQuery(GET_ALL_VENDORS);

  const navigate = useNavigate()

  // if (errors) return <h1>lol oops something broke</h1>;
  // if (loading) return <h1>loading... be patient u hoe</h1>
  
  // open status text
   const openStatusText = {
    "openning":" OPENNING ",
    "kitchenClosed":" KITCHEN CLOSED ",
    "closed": " CLOSED "
  }

  // includes time
  const current_date = new Date()
  const currentDay = current_date.getDay()
  // temporary fix:
  // const currentDay = 1
  const dayObj = hours[currentDay]
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

  const startTimes = hours[currentDay].start
  const endTimes = hours[currentDay].end

  const times = []
  for (let i = 0; i < startTimes.length; i++) {
    times.push([startTimes[i], endTimes[i]])
  }

  const determineIfClosed = (current_date, dayObj) => {
    if (!dayObj) return
    const currentTime = current_date.getHours() + current_date.getMinutes() / 60;
    for(let i=0; i < dayObj.start.length; i++){
      const startTime = convertTimeToNum(dayObj.start[i]);
      const endTime = convertTimeToNum(dayObj.end[i]);
      if (currentTime >= startTime && currentTime <= endTime - 0.25){
        return {status:"openning"}
      }else if(currentTime > endTime-0.25 && currentTime <= endTime){
        return {status:"kitchenClosed", nextClose: dayObj.end[i]}
      }else if(currentTime < startTime){
        return {status:"closed", nextOpen: dayObj.start[i]}
      }
    }
    return {status:"closed", nextOpen: dayObj.start[0]}
  }

  const handleClickStatus = ()=>{
    setStatusDetail(!statusDetail);
  }

  const openStatus = determineIfClosed(current_date, dayObj);

  const handleClick = () => {
    if(openStatus.status==="openning"){
      // Go to this particular vendor's detail page
      return navigate(`/eat/${vendor.slug}`, { state: { currentVendor: name } })
    }else{
      handleClickStatus()
    }
    
  }

  const showStatusDetail = (openStatus, vendorName)=>{
    if(openStatus.status==="kitchenClosed"){
      return (
        <div className = "detailWrapper" > 
          <div className="detailBox">
            <div  className="closeIcon"> <IoIosClose size="12%" onClick={()=>handleClickStatus()}/></div>
            <div className="detailText">
            <h1>Kitchen Closed</h1>
            <p> {vendorName} is no longer accepting orders </p>
            <p>Orders placed before {openStatus.nextClose} can be picked up as scheduled</p>
            </div>
            
          </div>
          
        </div>
      )
    }else if(openStatus.status==="closed"){
      return (
        <div className = "detailWrapper" >
          <div className="detailBox">
            <div  className="closeIcon"> <IoIosClose size="12%" onClick={()=>handleClickStatus()}/></div>
            <div className="detailText">
            <h1>Closed</h1>
            <p> {vendorName} will be openning at {openStatus.nextOpen}</p>
            </div>
          </div>
        </div>
      )
    }
  }


  return (
    // UNCOMMENT BELOW FOR PRODUCTION:
      // <div className={closed ? 'vendorContainer vendorDisabled' : 'vendorContainer'} onClick={() => handleClick()}>
        <div className='vendorContainer' onClick={() => handleClick()}>
          <div className='vendorImageContainer'>
            <img
                className={openStatus.status==="openning" ? 'vendorImage':'vendorImage closed'}
                src={logoUrl}
            />
          </div>
        <div className='vendorHeading'>
          <div className='vendorHeadingText'>
            <h3 className='vendorName'>{name}</h3>
            {/* Case for two start/end times */}
            {dayObj && dayObj.start.length > 1 && (
              <p>
                {' '}
                Hours Open:{' '}
                {times.map(time => {
                  return (
                    <span>
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
            <button className= {"statusIcon "+openStatus.status}> 
              {openStatusText[openStatus.status]} 
            </button>
          </div>
        </div>
      </div>
  )
}

export default VendorCard
