import styled, { css } from 'styled-components'

export const FloatCartWrapper = styled.div`
  -webkit-text-size-adjust: 100%;
  padding-top: 8vh;
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(100px, min-content) 10vh minmax(10vh, max-content);
  grid-template-areas:
    'OrderSummary'
    'PickUpTime'
    'PaymentMethod';
  font-family: 'avenir';
  letter-spacing: 0.97px;
`

export const SpaceWrapper = styled.div`
  height: 100%;
  width: 100%;
  font-family: 'avenir';
  ${props =>
    props.orderSummary &&
    css`
      grid-area: OrderSummary;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 3vh minmax(8vh, min-content) min-content;
      align-items: center;
      padding-top: 2.5vh;
    `};
  ${props =>
    props.pickUpTime &&
    css`
      grid-area: PickUpTime;
      border-top:1px #DDDDDD solid;
      display: grid;
      grid-template-columns: 1.2fr 1.3fr;
      grid-template-rows: 1fr;
      align-items: center;
    `};
  ${props =>
    props.paymentMethod &&
    css`
      grid-area: PaymentMethod;
      display: grid;
      border-top:1px #DDDDDD solid;
      grid-template-columns: 1.2fr 1.3fr;
      grid-template-rows: 10vh minmax(0px, min-content);
      align-items: center;
    `};
`

export const Title = styled.div`
  font-size: 2.6vh;

  font-weight: 600;
  margin-left: 3vw;
`

export const ShelfItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 0.3fr 0.5fr 1.9fr 0.8fr 0.55fr;
  grid-template-rows: 1;
  align-items: center;
  justify-items: center;
  width: 100%;
  background-color: #ffffff;
  padding: 10px 0px;
`

export const ShelfItemProduct = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 18px;
  width: 100%;
  height: 100%;
`

export const ShelfItemImage = styled.img`
  width: 6vh;
  height: 6vh;
  object-fit: cover;
  border-radius: 50%;
`

export const ShelfItem = styled.div`
  ${props =>
    props.title &&
    css`
      font-size: 2.4vh;
      font-weight: bold;
      word-break: break-word;
      text-align: left;
      width: 95%;
    `};

  ${props =>
    props.options &&
    css`
      font-size: 1.8vh;
      opacity: 0.7;
      letter-spacing: 0.8px;
      line-height: 1.9vh;
      width: 95%;
      text-align: left;
    `}

  ${props =>
    props.price &&
    css`
      font-size: 2vh;
      letter-spacing: 1px;
      margin-right:3vw;
      justify-self:flex-end;
    `}
`

export const Bill = styled.div`
  ${props =>
    props.wrapper &&
    css`
    padding:2vh 0px;
      height: 100%;
      width: 100%;
      display: grid;
      grid-template-rows: 2fr 1fr;
      grid-template-columns: auto 30vw 3vw;
      grid-template-areas:
        'Blank subcalculationSpace empty'
        'Blank totalSpace empty';
    `};
  ${props =>
    props.subwrapper &&
    css`
      grid-area: subcalculationSpace;
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'subtotalTitle subtotalNumber'
        'taxTitle taxNumber';
    `}
  ${props =>
    props.subtitle &&
    css`
        font-size:2vh;
      text-transform: capitalize;
      text-align: right;
      grid-area: ${props => props.gridArea};
    `};

  ${props =>
    props.price &&
    css`
    text-align:right;
      letter-spacing: 1px;
    `};

  ${props =>
    props.totalWrapper &&
    css`
      height: 100%;
      width: 100%;
      grid-area: totalSpace;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: 'totalTitle totalNumber';
    `}

  ${props =>
    props.title &&
    css`
    padding-top:0.5vh;
    font-size:2vh;
    border-top: 1px #DDDDDD solid;
      text-align: right;
      grid-area: ${props => props.gridArea};
      font-weight: bold;
    `}
`
