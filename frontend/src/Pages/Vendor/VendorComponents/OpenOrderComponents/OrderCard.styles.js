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
  background-color: white;
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
  word-break: break-word;
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
  box-shadow: 0.6px 0.6px 3px 0.5px rgba(0,0,0,0.3);
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

export const Background = styled.div`
  position: fixed;
  height: 93vh;
  width: 100vw;
  bottom: 0px;
  left: 0px;
  backdrop-filter: blur(4px) brightness(75%);
  z-index: 1;
`

export const ModalWrapper = styled.div`
  background-color: white;
  height: 54vh;
  width: 56vw;
  top: 15vh;
  font-size: 1.9vh;
  left: 22vw;
  position: fixed;
  z-index: 2;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow:  ${props => props.cancel ? '1px 1px 15px 15px rgba(255,0,0,0.3)' : '2px 2px 9px 1pxrgba(0, 0, 0, 0.2)'};
  font-family: 'Metropolis';
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 0.75fr 2.8fr minmax(0fr, 1fr) 0.8fr;
  grid-template-areas:
    'ModalHeaderSpace ModalHeaderSpace'
    'ModalOrderSpace ModalDetailSpace'
    'ModalButtons ModalButtons';
  align-items: center;
  justify-items: center;
  border-radius: 12px;
  overflow: hidden;
  color: black;
`

export const ModalHeaderWrapper = styled.div`
  grid-area: ModalHeaderSpace;
  height: 77%;
  width: 100%;
  font-size: 3.1vh;
  font-weight: bold;
  align-items: flex-end;
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

export const ModalOrderWrapper = styled.div`
  grid-area: ModalOrderSpace;
  height: 95%;
  width: 85%;
  display: grid;
  align-items: flex-start;
  grid-template-columns: 1fr;
  grid-template-rows: 3.4fr 0.6fr;
  overflow: hidden;
`

export const ModalItemList = styled.div`
  overflow: auto;
  height: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  max-height: 100%;
`

export const ModalOrderItem = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 10fr 2.4fr;
  grid-template-rows: 1fr;
  margin-bottom: 1vh;
`

export const ModalPaymentWrapper = styled.div`
  color: #3d3d3d;
  width: 50%;
  text-align: right;
  height: 90%;
  align-self: flex-end;
  display: grid;
  grid-template-columns: 4.65fr 2.4fr;
  grid-template-rows: 1fr 1fr;
  justify-self: flex-end;
`
export const ModalOrderDetailsWrapper = styled.div`
  grid-area: ModalDetailSpace;
  height: 95%;
  width: 85%;
  display: grid;
  align-items: flex-start;
  justify-items: flex-start;
  grid-template-columns: 1fr 1.2fr;
  grid-template-rows: 1fr 1fr 1fr;
`

export const ModalSubtitle = styled.div`
  text-decoration: underline;
  font-size: 2.2vh;
`

export const ModalDetail = styled.div`
display:flex;
flex-direction:column;
height:100%;
width:100%;
align-items:flex-start;
justify-items:flex-start:
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
  margin-top: 1vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
