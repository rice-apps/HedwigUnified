import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { IoMdClose, IoMdArrowDropdown } from 'react-icons/io'
import { CgMathPlus } from 'react-icons/cg'
import Modal from 'react-modal'

import { VENDOR_QUERY } from '../../../../graphql/VendorQueries.js'
import { useQuery, gql, useMutation, InMemoryCache } from '@apollo/client'
import { current } from 'immer'

const UPDATE_VENDOR = gql`
  mutation UPDATE_VENDOR($hours: [UpdateOneVendorBusinessHoursInput]!) {
    updateVendor(record: { hours: $hours }, filter: { name: "Cohen House" }) {
      record {
        hours {
          start
          end
        }
      }
    }
  }
`

const EditHoursDashboardWrapper = styled.div`
  height: 90%;
  width: 90%;
  font-size: 3.8vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 8fr;
  font-family: 'Futura', sans-serif;
  justify-items: center;
  overflow: hidden;
`
const EditHoursTitleWrapper = styled.div`
  margin-top: 2.2vh;
  font-weight: 500;
`

const EditHoursRowWrapper = styled.div`
  font-size: 2.8vh;
  overflow-y: scroll;
`
const EditHoursRow = styled.div`
  border-radius: 10px;
  background-color: white;
  width: 70vw;
  padding: 10px;
  margin: 10px 0px;
  height: max-content;
  display: grid;
  justify-items: center;
  grid-template-columns: 1.3fr 1.3fr 42vw 1.8fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'Day Status Hours AddHours';
`

const DayColumn = styled.div`
  grid-area: Day;
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: 2vw;
  align-items: center;
  text-align: left;
`
const StatusColumn = styled.div`
  grid-area: Status;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

const StatusDropdown = styled.select`
  background-color: #3121170d;
  padding: 3px;
  text-align-last: center;
  border-radius: 10px;
  -webkit-appearance: none;
  position: relative;
  padding-right: 19px;
  cursor: pointer;
`

function CreateStatusDropdown (props) {
  const [toggleIsClosed, { data, loading, error }] = useMutation(UPDATE_VENDOR)

  function onChangeIsClosed (value) {
    window.location.reload()
    let inputIsClosed = value === 'OPEN' ? false : true
    // const originalHours = props.vendor_data.getVendor.hours;
    const originalHours = props.currentHours
    const updatedHours = [...originalHours]
    // This index is the index of the day! should reflect what day the user clicks to edit:
    const updatedDay = { ...updatedHours[props.index] }
    const updatedIsClosed = [...updatedDay.isClosed]
    updatedIsClosed[0] = inputIsClosed
    updatedDay.isClosed = updatedIsClosed

    updatedHours[props.index] = updatedDay
    updatedHours.map((day, index) => {
      const dayCopy = { ...updatedHours[index] }
      delete dayCopy['__typename']
      updatedHours[index] = dayCopy
    })

    toggleIsClosed({
      variables: {
        name: 'Cohen House',
        hours: updatedHours
      }
    })

    // update state:
    // props.updateCurrentHours(updatedHours);
  }

  return (
    <StatusColumn>
      {console.log(props.day, props.inputIsClosed[0])}
      {props.inputIsClosed[0] ? (
        <StatusDropdown
          name='storeStatus'
          id='storeStatus'
          onChange={e => onChangeIsClosed(e.target.value)}
        >
          <option value='OPEN'>Open</option>
          <option value='CLOSED' selected>
            Closed
          </option>
        </StatusDropdown>
      ) : (
        <StatusDropdown
          name='storeStatus'
          id='storeStatus'
          onChange={e => onChangeIsClosed(e.target.value)}
        >
          <option value='OPEN' selected>
            Open
          </option>
          <option value='CLOSED'>Closed</option>
        </StatusDropdown>
      )}
      <IoMdArrowDropdown style={{ position: 'absolute', right: '1.0vw' }} />
    </StatusColumn>
  )
}

const HoursColumn = styled.div`
  grid-area: Hours;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  font-size: 2.8vh;
  flex-wrap: wrap;
  padding: 0px 7px;
`
const HoursInterval = styled.div`
  background-color: #f8eae7;
  position: relative;
  border-radius: 10px;
  color: #ea907a;
  margin: 4px 5px;
  border: 2px solid #ea907a;
  /* padding: 5px 1.8vw; */
  padding: 2px 0px;
  width: 19vw;
  height: min-content;
`

const DaysofTheWeek = ['MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT', 'SUN']

function HoursItem (props) {
  const [updateDeleteTime, { data, loading, error }] = useMutation(
    UPDATE_VENDOR
  )

  function deleteStartEndTime () {
    const originalHours = props.currentHours
    const updatedHours = [...originalHours]
    // This index is the index of the day! should reflect what day the user clicks to edit:
    const updatedDay = { ...updatedHours[props.index] }

    const updatedStart = [...updatedDay.start]
    console.log('Start time: ', props.startTime)
    const indexOfStartHour = updatedStart.indexOf(props.startTime)
    if (indexOfStartHour > -1) {
      console.log('updated start before: ', updatedStart)
      updatedStart.splice(indexOfStartHour, 1)
      console.log('updated start after: ', updatedStart)
    }

    const updatedEnd = [...updatedDay.end]
    console.log('End time: ', props.endTime)
    const indexOfEndHour = updatedEnd.indexOf(props.endTime)
    console.log('indexOfEndHour: ', indexOfEndHour)
    if (indexOfEndHour > -1) {
      console.log('updated end before: ', updatedEnd)
      updatedEnd.splice(indexOfEndHour, 1)
      console.log('updated end after: ', updatedEnd)
    }

    updatedDay.start = updatedStart
    updatedDay.end = updatedEnd

    console.log('updated day: ', updatedDay)

    updatedHours[props.index] = updatedDay
    updatedHours.map((day, index) => {
      const dayCopy = { ...updatedHours[index] }
      delete dayCopy['__typename']
      updatedHours[index] = dayCopy
    })

    updateDeleteTime({
      variables: {
        name: 'Cohen House',
        hours: updatedHours
      }
    })

    window.location.reload()
  }

  return (
    <HoursInterval>
      <IoMdClose
        onClick={deleteStartEndTime}
        style={{
          position: 'absolute',
          top: '4',
          right: '4',
          fontSize: '2.2vh',
          cursor: 'pointer'
        }}
      />
      {props.startTime} – {props.endTime}
    </HoursInterval>
  )
}

const AddColumn = styled.div`
  grid-area: AddHours;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AddButton = styled.div`
  border-radius: 30px;
  border: 2px solid #ea907a;
  color: #ea907a;
  cursor: pointer;
  padding: 2px 8px;
  padding-right: 10px;
  font-size: 2.5vh;
  display: flex;
  align-items: center;
`

const AddHourModalWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 0.2fr 1.5fr;
  grid-template-rows: 1.4fr 1fr;
  height: 80%;
  width: 100%;
  position: absolute;
  grid-template-areas:
    'DOTW StartTime ToSpace EndTime'
    'ConfirmSpace ConfirmSpace ConfirmSpace ConfirmSpace';
  align-items: center;
  justify-content: center;
  font-size: 2.8vh;
  padding: 10px 15px;
`

const DayModal = styled.div`
  grid-area: DOTW;
  text-align: right;
`

const TimeModal = styled.input`
  background-color: #f4f3f3;
  border-radius: 10px;
  padding: 6px;
  position: relative;
  display: block;
  margin: 0 auto;
  font-size: 2.5vh;
  border: none;
  text-align: center;
`

const ConfirmButtonWrapper = styled.div`
  grid-area: ConfirmSpace;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ConfirmButton = styled.button`
  color: white;
  background-color: #ea907a;
  border-radius: 70px;
  grid-area: ConfirmSpace;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border: none;
`

function MakeTimeInput (props) {
  const [toggleIsClosed, { data, loading, error }] = useMutation(UPDATE_VENDOR)

  let startTime = null

  function onChangeHourModal (inputTime) {
    if (props.id === 'addedStartTime') {
      startTime = inputTime
    }

    if (props.id === 'addedEndTime') {
      const originalHours = props.currentHours
      const updatedHours = [...originalHours]
      const updatedDay = { ...updatedHours[props.index] }

      const updatedStartTime = updatedDay.start.concat(startTime)
      console.log('start time after ', updatedStartTime)
      updatedDay.start = updatedStartTime

      console.log('end time before: ', updatedDay.end)

      const updatedEndTime = updatedDay.end.concat(inputTime)
      console.log('end time after: ', updatedEndTime)
      updatedDay.end = updatedEndTime

      updatedHours[props.index] = updatedDay
      updatedHours.map((day, index) => {
        const dayCopy = { ...updatedHours[index] }
        delete dayCopy['__typename']
        updatedHours[index] = dayCopy
      })

      toggleIsClosed({
        variables: {
          name: 'Cohen House',
          hours: updatedHours
        }
      })
    }
    // window.location.reload();

    // props.updateCurrentHours(updatedHours);
  }
  // This function formats the time so that it is not in 24h format
  function updateAddedTime (addedTime) {
    const updateHourState = props.setHours
    let halfOfDay = ''
    let formattedHour = ''
    // console.log("addedTime", addedTime, typeof addedTime);
    const addedHours = parseInt(addedTime.split(':')[0])
    const formattedMinute = addedTime.split(':')[1]
    // console.log("Hour", addedHours);
    // console.log("Minutes", addedMinute);
    if (addedHours > 12) {
      halfOfDay = 'p.m.'
      formattedHour = (addedHours - 12).toString()
    } else {
      halfOfDay = 'a.m.'
      formattedHour = addedHours.toString()
    }
    console.log(formattedHour, halfOfDay)
    const formattedAddedTime =
      formattedHour + ':' + formattedMinute + ' ' + halfOfDay
    console.log('Formatted Time', formattedAddedTime)
    // this updates the state of either addedStartTime or addedendtime
    updateHourState(formattedAddedTime)
  }

  return (
    <div>
      <TimeModal
        // onChange={e => onChangeHourModal(e.target.value)}
        onChange={e => updateAddedTime(e.target.value)}
        type='time'
      ></TimeModal>
    </div>
  )
}

function MakeAddHoursButton (props) {
  const [toggleIsClosed, { data, loading, error }] = useMutation(UPDATE_VENDOR)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [addedStartTime, setAddedStartTime] = useState('')
  const [addedEndTime, setAddedEndTime] = useState('')

  function openAddHourModal () {
    setModalIsOpen(true)
  }
  function closeAddHourModal () {
    AddStartTime('')
    AddEndTime('')
    setModalIsOpen(false)
  }

  function AddStartTime (time) {
    setAddedStartTime(time)
  }

  function AddEndTime (time) {
    setAddedEndTime(time)
  }

  function ConfirmOnClick () {
    let timesToAdd = [addedStartTime, addedEndTime]
    console.log(timesToAdd)

    const originalHours = props.currentHours
    const updatedHours = [...originalHours]
    const updatedDay = { ...updatedHours[props.index] }

    const updatedStartTime = updatedDay.start.concat(addedStartTime)
    console.log('start time after ', updatedStartTime)
    updatedDay.start = updatedStartTime

    const updatedEndTime = updatedDay.end.concat(addedEndTime)
    console.log('end time after: ', updatedEndTime)
    updatedDay.end = updatedEndTime

    updatedHours[props.index] = updatedDay
    updatedHours.map((day, index) => {
      const dayCopy = { ...updatedHours[index] }
      delete dayCopy['__typename']
      updatedHours[index] = dayCopy
    })

    toggleIsClosed({
      variables: {
        name: 'Cohen House',
        hours: updatedHours
      }
    })

    window.location.reload()
  }

  return (
    <AddColumn>
      <AddButton onClick={openAddHourModal}>
        <CgMathPlus />
        <div>Add Hours</div>
      </AddButton>
      <Modal
        isOpen={modalIsOpen}
        style={{
          content: {
            backgroundColor: 'white',
            height: '25vh',
            width: '44vw',
            position: 'absolute',
            top: '36%',
            left: '28%',
            border: '3px solid #9D9D9D45',
            borderRadius: '20px'
          }
        }}
      >
        <form>
          <AddHourModalWrapper>
            <DayModal>{props.weekday}</DayModal>
            <MakeTimeInput
              id='addedStartTime'
              index={props.index}
              currentHours={props.currentHours}
              setHours={AddStartTime}
              // updateCurrentHours={props.updateCurrentHours}
            />
            <div tyle={{ textAlign: 'middle' }}> TO </div>
            <MakeTimeInput
              id='addedEndTime'
              index={props.index}
              currentHours={props.currentHours}
              setHours={AddEndTime}
              // updateCurrentHours={props.updateCurrentHours}
            />
            <ConfirmButtonWrapper>
              <ConfirmButton
                onClick={ConfirmOnClick}
                disabled={addedStartTime == '' || addedEndTime == ''}
                type='button'
              >
                Confirm
              </ConfirmButton>
            </ConfirmButtonWrapper>
          </AddHourModalWrapper>

          <IoMdClose
            onClick={closeAddHourModal}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              fontSize: '3vh'
            }}
          />
        </form>
      </Modal>
    </AddColumn>
  )
}

function EditHoursDashboard () {
  // const [currentHours, setCurrentHours] = useState([]);

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: 'Cohen House' }
  })

  if (vendor_loading) {
    return <p>Loading...</p>
  }
  if (vendor_error) {
    return <p>Error...</p>
  }

  const hours = vendor_data.getVendor.hours

  console.log('hours: ', hours)

  // function updateCurrentHours(newHours) {
  //   setCurrentHours(newHours);
  // }

  // console.log(currentHours.length);

  // if (currentHours.length === 0) {
  //   console.log("hours ", hours);
  //   updateCurrentHours(hours);
  //   console.log("current hours in if ", currentHours);
  // }

  // updateCurrentHours(hours);

  function getIndex (day) {
    let dayName =
      day === 'MON'
        ? 'Monday'
        : day === 'TUE'
        ? 'Tuesday'
        : day === 'TUE'
        ? 'Tuesday'
        : day === 'WED'
        ? 'Wednesday'
        : day === 'THURS'
        ? 'Thursday'
        : day === 'FRI'
        ? 'Friday'
        : day === 'SAT'
        ? 'Saturday'
        : day === 'SUN'
        ? 'Sunday'
        : 'N/A'
    return hours.findIndex(obj => obj.day === dayName)
  }

  return (
    <EditHoursDashboardWrapper>
      <EditHoursTitleWrapper>Regular Hours</EditHoursTitleWrapper>
      <EditHoursRowWrapper>
        {DaysofTheWeek.map(day => {
          const index = getIndex(day)
          return (
            <EditHoursRow>
              <DayColumn>{day}</DayColumn>
              {console.log('hours[index]', hours[index])}
              <CreateStatusDropdown
                inputIsClosed={hours[index].isClosed}
                index={index}
                currentHours={hours}
                day={day}
              />
              <HoursColumn>
                {hours[index].start.map((startInput, timeIndex) => {
                  return (
                    <HoursItem
                      index={index}
                      currentHours={hours}
                      startTime={hours[index].start[timeIndex]}
                      endTime={hours[index].end[timeIndex]}
                    ></HoursItem>
                  )
                })}
              </HoursColumn>
              <MakeAddHoursButton
                weekday={day}
                index={index}
                currentHours={hours}
              />
            </EditHoursRow>
          )
        })}
      </EditHoursRowWrapper>
    </EditHoursDashboardWrapper>
  )
}

export default EditHoursDashboard
