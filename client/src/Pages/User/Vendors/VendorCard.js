import React, { Fragment, } from 'react'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDoorOpen,
  faDoorClosed,
} from '@fortawesome/free-solid-svg-icons'

function VendorCard ({ vendor }) {
    const { name, hours, logoUrl } = vendor
  
    // const {data : all_vendors, errors: vendor_errors, loading: vendor_loading} = useQuery(GET_ALL_VENDORS);
  
    const navigate = useNavigate()
    
    // if (errors) return <h1>lol oops something broke</h1>;
    // if (loading) return <h1>loading... be patient u hoe</h1>
  
    const handleClick = () => {
      // Go to this particular vendor's detail page
      return navigate(`/eat/${vendor.slug}`)
    }

    // includes time
    const current_date = new Date();
    const currentDay = current_date.getDay();
    const dayObj = hours[0];
   
     
    const determineIfClosed = (current_date, dayObj) =>{
        if (!dayObj) return;
        console.log(
        "CURREDATEHOURS", current_date.getHours())
        console.log("DAYOBJ", dayObj.start);
        return current_date.getHours() < dayObj.end;
    } 
    
    const closed = determineIfClosed(current_date, dayObj); 
    console.log("CLOSED", closed);

    return (
      <Fragment>
        <div className='vendorContainer' onClick={() => handleClick()}>
          <div className='vendorHeading'>
            <div className='vendorHeadingText'>
              <h3 className='vendorName'>{name}</h3>
              {dayObj && <p>Hours Open: {dayObj.start}-{dayObj.end} </p>}
              {dayObj && console.log(dayObj.start, dayObj.end)}
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
            {closed ? <span><p className="closedText">Closed</p></span>: null}
            {<img
              className={closed ? `vendorImage closed` : `vendorImage`}
              src={logoUrl}
            />}
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
      </Fragment>
    )
  }

export default VendorCard