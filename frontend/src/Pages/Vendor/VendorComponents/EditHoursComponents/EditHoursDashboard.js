import { useState } from 'react'
import { IoMdClose, IoMdArrowDropdown } from 'react-icons/io'
import { CgMathPlus } from 'react-icons/cg'
import Modal from 'react-modal'
import { VENDOR_QUERY } from '../../../../graphql/VendorQueries.js'
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag.macro'
import moment from 'moment'
import { LoadingPage } from './../../../../components/LoadingComponents'
import {
  EditHoursDashboardWrapper,
  EditHoursTitleWrapper,
  EditHoursRowWrapper,
  CloseNowButton,
  EditHoursRow,
  DayColumn,
  StatusColumn,
  StatusDropdown,
  HoursColumn,
  HoursInterval,
  AddColumn,
  AddButton,
  AddHourModalWrapper,
  DayModal,
  TimeModal,
  ConfirmButtonWrapper,
  ConfirmButton
} from './EditHours.styles'

const UPDATE_VENDOR = gql`
  mutation UPDATE_VENDOR($hours: [UpdateOneVendorBusinessHoursInput]!, $name: String!) {
    updateVendor(record: { hours: $hours }, filter: { name: $name }) {
      record {
        hours {
          start
          end
        }
      }
    }
  }
`

function CreateStatusDropdown (props) {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const [toggleIsClosed] = useMutation(UPDATE_VENDOR)

  async function onChangeIsClosed (value) {
    window.location.reload()
    const inputIsClosed = value !== 'OPEN'
    // const originalHours = props.vendor_data.getVendor.hours;
    const originalHours = props.currentHours
    const updatedHours = [...originalHours]
    // This index is the index of the day! should reflect what day the user clicks to edit:
    const updatedDay = { ...updatedHours[props.index] }
    // const updatedIsClosed = [...updatedDay.isClosed]
    // updatedIsClosed[0] = inputIsClosed
    updatedDay.isClosed = inputIsClosed

    updatedHours[props.index] = updatedDay
    updatedHours.map((day, index) => {
      const dayCopy = { ...updatedHours[index] }
      delete dayCopy.__typename
      updatedHours[index] = dayCopy
    })

    await toggleIsClosed({
      variables: {
        name: currentUser.vendor[0],
        hours: updatedHours
      }
    })

    // update state:
    // props.updateCurrentHours(updatedHours);
  }

  return (
    <StatusColumn>
      {console.log(props.day, props.inputIsClosed)}
      {props.inputIsClosed ? (
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
    </StatusColumn>
  )
}

const DaysofTheWeek = ['MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT', 'SUN']

function HoursItem (props) {
  const [updateDeleteTime] = useMutation(UPDATE_VENDOR)
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))

  async function deleteStartEndTime () {
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
      delete dayCopy.__typename
      updatedHours[index] = dayCopy
    })

    await updateDeleteTime({
      variables: {
        name: currentUser.vendor[0],
        hours: updatedHours
      }
    })

    window.location.reload()
  }

  return (
    <HoursInterval isClosed={props.isClosed}>
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

// FUTURE MVP, safari does not support input type of time so we have to code it ourselves

function MakeTimeInput (props) {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const [toggleIsClosed] = useMutation(UPDATE_VENDOR)

  const startTime = null

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
    } else if (addedHours === 12) {
      halfOfDay = 'p.m.'
      formattedHour = '12'
    } else if (addedHours === 0) {
      halfOfDay = 'a.m.'
      formattedHour = '12'
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
      />
    </div>
  )
}

function MakeAddHoursButton (props) {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const [toggleIsClosed] = useMutation(UPDATE_VENDOR)

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

  async function ConfirmOnClick () {
    const timesToAdd = [addedStartTime, addedEndTime]
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
      delete dayCopy.__typename
      updatedHours[index] = dayCopy
    })

    await toggleIsClosed({
      variables: {
        name: currentUser.vendor[0],
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
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const [toggleIsClosed] = useMutation(UPDATE_VENDOR)

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: currentUser.vendor[0] }
  })

  if (vendor_loading) {
    return <LoadingPage />
  }
  if (vendor_error) {
    return <p>Error...</p>
  }

  const hours = vendor_data.getVendor.hours

  console.log('hours: ', hours)

  function getIndex (day) {
    const dayName =
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

  async function closeOnClick () {
    const currentDay = moment().format('dddd')
    console.log('current day ', currentDay)
    const index = hours.findIndex(obj => obj.day === currentDay)
    console.log('index ', index)

    const originalHours = hours
    const updatedHours = [...originalHours]
    // This index is the index of the day! should reflect what day the user clicks to edit:
    const updatedDay = { ...updatedHours[index] }

    updatedDay.isClosed = true

    updatedHours[index] = updatedDay
    updatedHours.map((day, index) => {
      const dayCopy = { ...updatedHours[index] }
      delete dayCopy.__typename
      updatedHours[index] = dayCopy
    })

    console.log('updated day ', updatedDay)

    await toggleIsClosed({
      variables: {
        name: currentUser.vendor[0],
        hours: updatedHours
      }
    })
    window.location.reload()
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
                      isClosed={hours[index].isClosed}
                      index={index}
                      currentHours={hours}
                      startTime={hours[index].start[timeIndex]}
                      endTime={hours[index].end[timeIndex]}
                    />
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
      <CloseNowButton onClick={closeOnClick}>Close Now</CloseNowButton>
    </EditHoursDashboardWrapper>
  )
}

export default EditHoursDashboard
