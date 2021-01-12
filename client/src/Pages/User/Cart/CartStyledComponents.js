import styled, { css } from 'styled-components'

export const FloatCartWrapper = styled.div`
  padding-top: 8vh;
  min-height: 100vh;
  min-width: 100vw;
  background-color: red;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(150px, min-content) 10vh minmax(10vh, max-content);
  grid-template-areas:
    'OrderSummary'
    'PickUpTime'
    'PaymentMethod';
  font-family: 'avenir';
`

export const SpaceWrapper = styled.div`
  height: 100%;
  width: 100%;
  ${props =>
    props.orderSummary &&
    css`
      grid-area: OrderSummary;
      background-color: green;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 40px min-content;
      align-items: center;
    `};
  ${props =>
    props.pickUpTime &&
    css`
      grid-area: PickUpTime;
      background-color: orange;
      display: grid;
      grid-template-columns: 1.2fr 1.3fr;
      grid-template-rows: 1fr;
      align-items: center;
    `};
  ${props =>
    props.paymentMethod &&
    css`
      grid-area: PaymentMethod;
      background-color: yellow;
      display: grid;
      grid-template-columns: 1.2fr 1.3fr;
      grid-template-rows: 10vh minmax(0px, min-content);
      align-items: center;
    `};
`

export const Title = styled.div`
  font-size: 2.6vh;
  letter-spacing: 0.9px;
  font-weight: bold;
  margin-left: 3vw;
`
