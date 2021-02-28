import styled, { css } from 'styled-components/macro'

export const FloatCartWrapper = styled.div`
  -webkit-text-size-adjust: 100%;
  padding-top: 8vh;
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(100px, min-content) 10vh minmax(10vh, max-content) auto 8.4vh;
  grid-template-areas:
    'OrderSummary'
    'PickUpTime'
    'PaymentMethod'
    'none'
    'Footer';
  letter-spacing: 0.97px;
`

export const SpaceWrapper = styled.div`
  height: 100%;
  width: 100%;
  ${props =>
    props.orderSummary &&
    css`
      grid-area: OrderSummary;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 4vh minmax(8vh, min-content) min-content;
      padding-top: 2.5vh;
    `};
  ${props =>
    props.pickUpTime &&
    css`
      grid-area: PickUpTime;
      border-top: 1px #dddddd solid;
      display: grid;
      grid-template-columns: 1.2fr 1.3fr;
      grid-template-rows: 1fr;
      align-items: center;
    `};
  ${props =>
    props.college &&
    css`
      grid-area: PickUpTime;
      border-top: 1px #dddddd solid;
      display: grid;
      grid-template-columns: 1.3fr 1.4fr;
      grid-template-rows: 4fr;
      align-items: center;
    `};
  ${props =>
    props.note &&
    css`
      grid-area: PaymentMethod;
      display: grid;
      border-top: 1px #dddddd solid;
      grid-template-rows: 16vh minmax(0px, min-content);
    `};
  ${props =>
    props.paymentMethod &&
    css`
      grid-area: PaymentMethod;
      display: grid;
      border-top: 1px #dddddd solid;
      grid-template-columns: 1.2fr 1.3fr;
      grid-template-rows: 10vh minmax(0px, min-content);
      align-items: center;
    `};
  ${props =>
    props.warning &&
    css`
      grid-area: none;
      display: grid;
      grid-template-rows: 10vh minmax(0px, min-content);
      align-items: center;
      margin: 1vh;
    `};
  ${props =>
    props.footer &&
    css`
      grid-area: Footer;
      display: flex;
      position: sticky;
      bottom: 0;
      align-items: center;
      justify-content: center;
      padding-bottom: 8px;
      background-color: white;
      width: 100%;
      height: 100%;
    `}
`

export const Title = styled.div`
  font-size: 2.6vh;
  font-weight: 600;
  margin-left: 5vw;
  ${props =>
    props.isolation &&
    css`
      font-size: 2.2vh;
      display: inline-block;
      margin-bottom: 1vh;
    `}
  ${props =>
    props.note &&
    css`
      margin-top:1.5vh;
      font-size: 2.2vh;
      display: block;
    `}
`

export const TextArea = styled.textarea`
  width: 90vw;
  height: 8vh;
  display: block;
  margin: auto;
  border-color: #dddddd;
  resize: none;
  :focus{
    outline: none;
  }
`

export const Input = styled.input`
  margin-right: 5vw;
  text-align: center;
  :focus{
    outline: none;
  }
  ${props =>
    props.roomNumber &&
    css`
      display: inline-block;
      margin-right: 5vw;
      margin-bottom: 1vw;
      border-right: 0;
      border-left: 0;
      border-top:0;
      border-width:0.1px;
    `}
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
      line-height: 2.5vh;
    `};

  ${props =>
    props.options &&
    css`
      padding-top: 4px;
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
      margin-right: 3vw;
      justify-self: flex-end;
    `}
`

export const Bill = styled.div`
  ${props =>
    props.wrapper &&
    css`
      padding: 2vh 0px;
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
      font-size: 2vh;
      text-transform: capitalize;
      text-align: right;
      grid-area: ${props => props.gridArea};
    `};

  ${props =>
    props.price &&
    css`
      text-align: right;
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
      padding-top: 0.5vh;
      font-size: 2vh;
      border-top: 1px #dddddd solid;
      text-align: right;
      grid-area: ${props => props.gridArea};
      font-weight: bold;
    `}
`
export const SubmitButton = styled.div`
  color: white;
  background-color: #f3725b;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: absolute;
  justify-content: center;
  font-weight: bold;
  height: 4vh;
  font-size: 2vh;
  width: 60vw;
  border-radius: 30px;
`
