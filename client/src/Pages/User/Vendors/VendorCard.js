import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoIosClose } from "react-icons/io";

export const convertTimeToNum = (time) => {
  const [timeNum, halfOfDay] = time.split(" ");
  let [hours, minutes] = timeNum.split(":");
  hours = parseInt(hours);
  minutes = parseInt(minutes) / 60;
  if ((halfOfDay === "a.m.") & (hours === 12)) {
    return minutes;
  } else if (halfOfDay === "a.m." || (halfOfDay === "p.m.") & (hours === 12)) {
    return hours + minutes;
  } else if (halfOfDay === "p.m.") {
    return 12 + hours + minutes;
  }
};

function VendorCard({ vendor }) {
  const { name, hours, logoUrl } = vendor;
  const [statusDetail, setStatusDetail] = useState(false);
  // const {data : all_vendors, errors: vendor_errors, loading: vendor_loading} = useQuery(GET_ALL_VENDORS);

  // make testMode true if you want the store to be open
  const testMode = false;

  const navigate = useNavigate();

  // if (errors) return <h1>lol oops something broke</h1>;
  // if (loading) return <h1>loading... be patient u hoe</h1>

  // open status text
  const openStatusText = {
    openning: " OPEN ",
    kitchenClosed: " KITCHEN CLOSED ",
    closed: " CLOSED ",
  };

  // includes time
  const current_date = new Date();

  // ---------------------------------------------------------------
  // NEW Changes: standardize to central time
  let currentHour = 0;
  let currentDay = 0;
  let currentMinute = 0;
  // Central time is UTC -6
  const offset = -6;
  const utcHour = current_date.getUTCHours();

  if (utcHour < 6) {
    currentHour = 24 + utcHour + offset;
  } else {
    currentHour = utcHour + offset;
  }

  // Day adjusts based on hour in UTC time
  if (testMode) {
    currentDay = 1;
  } else if (utcHour <= 6 && currentDay === 0) {
    currentDay = 6;
  } else if (utcHour <= 6) {
    currentDay = current_date.getUTCDay() - 1;
  } else {
    currentDay = current_date.getUTCDay();
  }

  // Minutes is same
  currentMinute = current_date.getUTCMinutes();
  // ---------------------------------------------------------------

  // const currentDay = testMode ? 1 : current_date.getDay();
  const dayObj = hours[currentDay];
  console.log(dayObj);

  const startTimes = hours[currentDay].start;
  const endTimes = hours[currentDay].end;

  const times = [];
  for (let i = 0; i < startTimes.length; i++) {
    times.push([startTimes[i], endTimes[i]]);
  }

  const determineIfClosed = (current_date, dayObj) => {
    if (!dayObj) return;
    // PLAY AROUND WITH CURRENTTIME FOR TESTING PURPOSES
    const currentTime = testMode ? 9 : currentHour + currentMinute / 60;
    for (let i = 0; i < dayObj.start.length; i++) {
      const startTime = convertTimeToNum(dayObj.start[i]);
      console.log(i, startTime);
      const endTime = convertTimeToNum(dayObj.end[i]);
      if (currentTime >= startTime && currentTime <= endTime - 0.25) {
        return { status: "openning" };
      } else if (currentTime > endTime - 0.25 && currentTime <= endTime) {
        return { status: "kitchenClosed", nextClose: dayObj.end[i] };
      } else if (currentTime < startTime) {
        return { status: "closed", nextOpen: dayObj.start[i], restOfDay: true };
      }
    }
    return { status: "closed", nextOpen: dayObj.start[0], restOfDay: false };
  };

  const handleClickStatus = () => {
    setStatusDetail(!statusDetail);
  };

  const openStatus = determineIfClosed(current_date, dayObj);
  console.log("openStatus", openStatus);
  const handleClick = () => {
    if (openStatus.status === "openning") {
      // Go to this particular vendor's detail page
      return navigate(`/eat/${vendor.slug}`, {
        state: { currentVendor: name },
      });
    } else {
      handleClickStatus();
    }
  };

  const showStatusDetail = () => {
    if (openStatus.status === "kitchenClosed" && statusDetail) {
      console.log("Status Detail", statusDetail);
      return (
        <div className="detailWrapper">
          <div className="detailBox">
            <div className="closeIcon">
              {" "}
              <IoIosClose size="12%" onClick={() => handleClickStatus()} />
            </div>
            <div className="detailText">
              <h1>Kitchen Closed</h1>
              <p> {name} is no longer accepting orders </p>
              <p>
                Orders placed before {openStatus.nextClose} can be picked up as
                scheduled
              </p>
            </div>
          </div>
        </div>
      );
    } else if (openStatus.status === "closed" && statusDetail) {
      return (
        <div className="detailWrapper">
          <div className="detailBox">
            <div className="closeIcon">
              {" "}
              <IoIosClose size="12%" onClick={() => handleClickStatus()} />
            </div>
            <div className="detailText">
              <h1>Closed</h1>
              {openStatus.restOfDay ? (
                <p>
                  {" "}
                  {name} will be opening at {openStatus.nextOpen}
                </p>
              ) : (
                <p> {name} is closed for the day! </p>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="vendorContainer" onClick={() => handleClick()}>
      {showStatusDetail()}
      <div className="vendorImageContainer">
        <img
          className={
            openStatus.status === "openning"
              ? "vendorImage"
              : "vendorImage closed"
          }
          src={logoUrl}
        />
      </div>
      <div className="vendorHeading">
        <div className="vendorHeadingText">
          <h3 className="vendorName">{name}</h3>
          {/* Case for two start/end times */}
          {dayObj && dayObj.start.length >= 1 && (
            <p>
              {" "}
              Hours Open:{" "}
              {times.map((time) => {
                return (
                  <span>
                    <br />
                    {time[0]}
                    {" - "}
                    {time[1]}
                  </span>
                );
              })}
            </p>
          )}
        </div>
        <div className="vendorHoursIcon">
          <button className={"statusIcon " + openStatus.status}>
            {openStatusText[openStatus.status]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorCard;
