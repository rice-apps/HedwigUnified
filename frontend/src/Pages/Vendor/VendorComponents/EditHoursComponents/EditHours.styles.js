import styled from 'styled-components/macro'

export const EditHoursDashboardWrapper = styled.div`
  height: 98%;
  width: 90%;
  font-size: 3.6vh;
  display: grid;
  font-weight: 500;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 8fr 1fr;
  justify-items: center;
  overflow: hidden;
`
export const EditHoursTitleWrapper = styled.div`
  margin-top: 2.2vh;
  font-weight: 600;
`

export const EditHoursRowWrapper = styled.div`
  font-size: 2.8vh;
  overflow-y: scroll;
`

export const CloseNowButton = styled.button`
  border: 2px solid #ea907a;
  border-radius: 40px;
  color: #ea907a;
  font-size: 2.5vh;
  padding: 2px 5px;
  background-color: white;
  height: 6vh;
  width: 12vw;
  font-weight: 600;
  margin-top: 1.8vh;
`
export const EditHoursRow = styled.div`
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

export const DayColumn = styled.div`
  grid-area: Day;
  width: 100%;
  font-weight: 600;
  height: 100%;
  display: flex;
  margin-left: 2vw;
  align-items: center;
  text-align: left;
`
export const StatusColumn = styled.div`
  grid-area: Status;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

export const StatusDropdown = styled.select`
  background-color: #3121170d;
  padding: 0.5vh;
  width:12vh;
  text-align-last: center;
  border-radius: 10px;
  font-size: 2.4vh;
  position: relative;
  cursor: pointer;
  font-weight: 500;
`
export const HoursColumn = styled.div`
  grid-area: Hours;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  font-size: 2.8vh;
  flex-wrap: wrap;
  padding: 0px 7px;
`
export const HoursInterval = styled.div`
  background-color: ${props => (props.isClosed ? '#FFF7F5' : '#f8eae7')};
  opacity: ${props => (props.isClosed ? '0.6' : '1')};
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
export const AddColumn = styled.div`
  grid-area: AddHours;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const AddButton = styled.div`
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

export const AddHourModalWrapper = styled.div`
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

export const DayModal = styled.div`
  grid-area: DOTW;
  text-align: right;
`

export const TimeModal = styled.input`
  background-color: #f4f3f3;
  border-radius: 10px;
  padding: 6px;
  position: relative;
  display: block;
  margin: 0 auto;
  font-size: 2.5vh;
  border: none;
  width: 10vw;
  height: 6vh;
  text-align: center;
`

export const ConfirmButtonWrapper = styled.div`
  grid-area: ConfirmSpace;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ConfirmButton = styled.button`
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
