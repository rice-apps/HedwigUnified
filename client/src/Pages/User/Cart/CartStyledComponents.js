import styled, { css } from 'styled-components'

export const FloatCartWrapper = styled.div`
  padding-top: 8vh;
  min-height: 100vh;
  min-width: 100vw;
  background-color: red;
  display:grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(150px, min-content) 10vh 10vh;
  grid-template-areas:
    'OrderSummary'
    'PickUpTime'
    'PaymentMethod';
`

export const SpaceWrapper = styled.div`
height:100%;
width:100%;
 ${props =>
   props.orderSummary &&
   css`
     grid-area: OrderSummary;
     background-color:green;
   `};
 ${props =>
   props.pickUpTime &&
   css`
     grid-area: PickUpTime;
     background-color:orange;
   `};
 ${props =>
   props.paymentMethod &&
   css`
     grid-area: PaymentMethod;
     background-color:yellow;
   `};
`
