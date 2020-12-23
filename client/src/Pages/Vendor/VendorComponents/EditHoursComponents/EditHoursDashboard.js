import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";
import { CgMathPlus } from "react-icons/cg";
import Modal from "react-modal";

const EditHoursDashboardWrapper = styled.div`
  height: 90%;
  width: 90%;
  font-size: 3.8vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 8fr;
  font-family: "Futura", sans-serif;
  justify-items: center;
`;
const EditHoursTitleWrapper = styled.div`
  margin-top: 2.2vh;
  font-weight: 500;
`;

const EditHoursRowWrapper = styled.div`
  font-size: 2.8vh;
  overflow: scroll;
`;
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
  grid-template-areas: "Day Status Hours AddHours";
`;

const DayColumn = styled.div`
  grid-area: Day;
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: 2vw;
  align-items: center;
  text-align: left;
`;
const StatusColumn = styled.div`
  grid-area: Status;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const StatusDropdown = styled.select`
  background-color: #3121170d;
  padding: 3px;
  text-align-last: center;
  border-radius: 10px;
  -webkit-appearance: none;
  position: relative;
  padding-right: 19px;
`;

function CreateStatusDropdown() {
  return (
    <StatusColumn>
      <StatusDropdown name="storeStatus" id="storeStatus">
        <option value="OPEN">Open</option>
        <option value="CLOSED">Closed</option>
      </StatusDropdown>
      <IoMdArrowDropdown style={{ position: "absolute", right: "1.1vw" }} />
    </StatusColumn>
  );
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
`;
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
`;

const DaysofTheWeek = ["MON", "TUE", "WED", "THURS", "FRI", "SAT", "SUN"];
function HoursItem(props) {
  return (
    <HoursInterval>
      <IoMdClose
        style={{
          position: "absolute",
          top: "4",
          right: "4",
          fontSize: "2.2vh"
        }}
      />
      {props.startTime} – {props.endTime}
    </HoursInterval>
  );
}

const AddColumn = styled.div`
  grid-area: AddHours;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
`;

const AddHourModalWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 0.2fr 1.5fr;
  grid-template-rows: 1.4fr 1fr;
  height:80%;
  width:100%;
  position:absolute;
  grid-template-areas:
    "DOTW StartTime ToSpace EndTime"
    "Confirm Confirm Confirm Confirm";
  align-items: center;
  justify-content: center;
  font-size: 2.8vh;
  padding:10px 15px;
`;

const DayModal = styled.div`
  grid-area: DOTW;
  text-align: right;
`;

const TimeModal = styled.input`
  background-color: #f4f3f3;
  border-radius: 10px;
  padding: 6px;
  position: relative;
  display: block;
  margin: 0 auto;
  font-size:2.5vh;
  border: none;
  text-align: center;
  
`;

function MakeTimeInput(props) {
    let side = props.side
  return (
    <div>
      <TimeModal type="time"></TimeModal>
    </div>
  );
}

function MakeAddHoursButton(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openAddHourModal () {
      setModalIsOpen(true)
  }
  function closeAddHourModal () {
      setModalIsOpen(false)
  }
  return (
    <AddColumn>
      <AddButton onClick={openAddHourModal}>
        <CgMathPlus />
        <div >Add Hours</div>
      </AddButton>
      <Modal
        isOpen={modalIsOpen}
        style={{
          content: {
            backgroundColor: "white",
            height: "25vh",
            width: "44vw",
            position: "absolute",
            top: "36%",
            left: "28%",
            border: "3px solid #9D9D9D45",
            borderRadius: "20px"
          }
        }}
      >
          <form>
        <AddHourModalWrapper>
          <DayModal>{props.weekday}</DayModal>
          <MakeTimeInput id="addedStartTime"/>
          <div tyle={{textAlign:"middle"}}> TO </div>
          <MakeTimeInput id="addedEndTime"/>
          
        </AddHourModalWrapper>
        <IoMdClose onClick={closeAddHourModal} style={{position:"absolute", top:"15px", right:"15px", fontSize:"3vh"}}/>
        </form>
      </Modal>
    </AddColumn>
  );
}

function EditHoursDashboard() {
  return (
    <EditHoursDashboardWrapper>
      <EditHoursTitleWrapper>Regular Hours</EditHoursTitleWrapper>
      <EditHoursRowWrapper>
        {DaysofTheWeek.map(day => {
          return (
            <EditHoursRow>
              <DayColumn>{day}</DayColumn>
              <CreateStatusDropdown />
              <HoursColumn>
                <HoursItem startTime="7:00 AM" endTime="12:00 PM"></HoursItem>
                <HoursItem startTime="1:00 PM" endTime="6:00 PM"></HoursItem>
                <HoursItem startTime="8:00 PM" endTime="11:00 PM"></HoursItem>
              </HoursColumn>
              <MakeAddHoursButton weekday={day} />
            </EditHoursRow>
          );
        })}
      </EditHoursRowWrapper>
    </EditHoursDashboardWrapper>
  );
}

export default EditHoursDashboard;
