import styled from 'styled-components/macro'

export const OrderCardWrapper = styled.div`
  background-color: white;
  border-radius: 20px;
  border-width: 2px;
  border-color: #cacaca;
  border-style: solid;
  justify-self: center;

  display: grid;
  width: 26vw;
  height: max-content;
  margin: 10px;
  margin-right: 14px;
  overflow: visible;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content max-content min-content;
  grid-template-areas:
    'OrderTitleSpace'
    'OrderTimeSpace'
    'OrderDetailsSpace'
    'PaymentSpace';
`

export const OrderTitleSpaceWrapper = styled.div`
  background-color: white;
  font-weight: bolder;
  grid-area: OrderTitleSpace;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr;
  font-size: 22px;
  line-height: 23.5px;
  justify-content: center;
  justify-items: center;
  padding-top: 8px;
  align-items: center;
  overflow: hidden;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`

export const OrderTimeSpaceWrapper = styled.div`
  background-color: white;
  grid-area: OrderTimeSpace;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  font-size: 14px;
  grid-template-areas: 'ExactTimeSpace TimeLeftSpace';
  font-weight: 500;
`

export const ExactTimeSpaceWrapper = styled.div`
  grid-area: ExactTimeSpace;
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 7px;
  margin-left: 10px;
  line-height: 18px;
`
export const TimeLeftSpaceWrapper = styled.div`
  grid-area: TimeLeftSpace;
  text-align: right;
  color: #2d2d2d;
  font-size: 13px;
`

export const OrderDetailsSpaceWrapper = styled.div`
  background-color: #fafafa;
  grid-area: OrderDetailsSpace;
  display: flex;
  flex-direction: column;
`
export const OrderDetailsItemWrapper = styled.div`
  background-color: #fafafa;
  margin: 3px 0px;
  display: grid;
  grid-template-columns: 1.1fr 10fr 3fr;
  grid-template-rows: 1fr;
  font-size: 14px;
`
export const ItemDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 6px;
`

export const PaymentSpaceWrapper = styled.div`
  background-color: white;
  border-top: 1px solid grey;
  width: 90%;
  justify-self: center;
  grid-area: PaymentSpace;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  font-size: 14px;
  
`

export const CostSpaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  text-align: right;
  margin-right: 5px;
  margin-bottom: 7px;
  margin-top: 3px;
`
export const ButtonsSpaceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

`
export const ButtonWrapper = styled.button`
  border-radius: 20px;
  cursor: pointer;
  border: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  margin: 0px 15px;
  margin-bottom: 15px;
`
export const AcceptButton = styled(ButtonWrapper)`
  background-color: #f9ddd7;
`

export const CancelButton = styled(ButtonWrapper)`
  background-color: #dedede;
`

export const ReadyButton = styled(ButtonWrapper)`
  background-color: #fadfbe;
`
export const PickedUpButton = styled(ButtonWrapper)`
  background-color: #deeee7;
`

export const ModalWrapper = styled.div`
  display: grid;
  font-family: 'Metropolis';
  grid-template-columns: 1fr;
  grid-template-rows: 2fr 4fr 5fr 3fr;
  grid-template-areas:
    'ModalHeader'
    'ModalParagraph'
    'ModalOrderDetails'
    'ModalButtons';
  height: 100%;
  width: 100%;
  align-items: center;
  color: black;
`

export const ModalHeaderWrapper = styled.div`
  grid-area: ModalHeader;
  height: 100%;
  width: 100%;
  font-size: 30px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const ModalParagraphWrapper = styled.div`
  /* background-color: blue; */
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 16px;
  grid-area: ModalParagraph;
  border-bottom: 1px solid grey;
`

export const ModalPaymentWrapper = styled.div`
  color: #3d3d3d;
  font-weight: bold;
`
export const ModalOrderDetailsWrapper = styled.div`
  grid-area: ModalOrderDetails;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-bottom: 1px solid grey;
`

export const ModalOrderDetailRow = styled.div`
  width: 35%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1.2px 0px;
`

export const ModalButtonsWrapper = styled.div`
  grid-area: ModalButtons;
  margin-top: 4vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
