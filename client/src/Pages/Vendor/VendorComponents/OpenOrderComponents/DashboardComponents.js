import React from 'react'
import styled from 'styled-components'


const OrderDashboardWrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;

  overflow: hidden;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 45px auto;
  grid-template-areas:
    'NewOrderTitle AcceptedOrderTitle ReadyOrderTitle'
    'NewOrderSpace AcceptedOrderSpace ReadyOrderSpace';
`

const GeneralTitleWrapper = styled.div`
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px 10px;
`

const NewOrderTitleWrapper = styled(GeneralTitleWrapper)`
  grid-area: NewOrderTitle;
  background-color: #ea907a;
`
const AcceptedOrderTitleWrapper = styled(GeneralTitleWrapper)`
  grid-area: AcceptedOrderTitle;
  background-color: #ef942a;
`

const ReadyOrderTitleWrapper = styled(GeneralTitleWrapper)`
  grid-area: ReadyOrderTitle;
  background-color: #90c6b1;
`

const GeneralSpaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f7f7f7;
  grid-auto-flow: column;
  width: 99%;
  height: 100%;
  position: relative;
  overflow: auto;
`

const NewOrderSpaceWrapper = styled(GeneralSpaceWrapper)`
  grid-area: NewOrderSpace;
  /* background-color: #FAFAFA; */
  /* background-color: red; */
  border-right: 1px solid #adadad;
`
const AcceptedOrderSpaceWrapper = styled(GeneralSpaceWrapper)`
  grid-area: AcceptedOrderSpace;
  /* background-color: #FAFAFA; */
  /* background-color: yellow; */
  border-right: 1px solid #adadad;
`

const ReadyOrderSpaceWrapper = styled(GeneralSpaceWrapper)`
  grid-area: ReadyOrderSpace;
  /* background-color: #fafafa; */
`

const TitleTextWrapper = styled.div`
  font-size: 23px;
  margin-top: 2px;
  color: white;
`

function MakeDashboardTitle (props) {
  return (
    <TitleTextWrapper>
      {props.name} ({props.quantity})
    </TitleTextWrapper>
  )
}

export {
  OrderDashboardWrapper,
  GeneralTitleWrapper,
  NewOrderTitleWrapper,
  AcceptedOrderTitleWrapper,
  ReadyOrderTitleWrapper,
  NewOrderSpaceWrapper,
  AcceptedOrderSpaceWrapper,
  ReadyOrderSpaceWrapper,
  MakeDashboardTitle
}
