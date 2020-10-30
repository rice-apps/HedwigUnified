import { Component, useState } from 'react'
import Button from '@material-ui/core/Button'
import styled, { css } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'
import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton
} from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'

// import { ACCEPT_ORDER } from "/Users/Ananya/hedwig/client/src/Pages/Vendor/VendorComponents/OpenOrderComponents/OrderCard.js"

// This is credit card payment! screen

const [inputCohenId, setInputCohenId] = useState('');

const ACCEPT_ORDER = gql`
  mutation ACCEPT_ORDER($orderId: String!, $cohenId: String!){
    updateOrder(
      orderId: $orderId
      record: {
        fulfillment: { uid: "WXe2kpdIeO7phMhR7hY6GD", state: RESERVED }
        cohenId: $cohenId
      }
    ) {
      fulfillment {
        uid
        state
      }
    }
  }
`

function CohenPayment(props) {
  // The index of the button that is clicked (0, 1, or 2), if no button is clicked the index is 3
  const [activePass, setActivePass] = useState(0)

  // colors
  const bgColors = ['white', '#cf5734']
  const fontColors = ['#595858', 'white']
  const fontWeights = [500, 700]

  const Title = styled.text`
    margin-top: 10px;
    font-family: 'adobe-clean', sans-serif;
    font-size: 25px;
    color: #595858;
    font-weight: lighter;
    justify-content: center;
    display: flex;
  `

  const CohenTitle = styled.text`
    margin-bottom: 80px;
    font-family: 'adobe-clean', sans-serif;
    font-size: 23px;
    color: #cf5734;
    font-weight: bold;
    justify-content: center;
    display: flex;
  `

  const MembershipTitle = styled.text`
    margin-left: 50px;
    font-family: 'adobe-clean', sans-serif;
    font-size: 23px;
    color: #595858;
    font-weight: bold;
    justify-content: center;
  `

  const Button = styled.button`
    font-family: 'Raleway', sans-serif;
    border-radius: 20px;
    border-width: 1px;
    border-color: #595858;
    height: 80px;
    width: 230px;
    font-size: 18px;
    font-weight: 500;
    color: #595858;
    text-align: left;
    padding-left: 50px;
  `

  const Grid = styled.div``

  const Row = styled.div``

  const Footer = styled.footer`
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    display: block;
    border-style: solid;
    border-width: 1px;
    padding: 25px 0;
    font-size: 25px;
    font-weight: ${activePass == 0 ? fontWeights[0] : fontWeights[0]};
    color: ${activePass == 0 ? fontColors[0] : fontColors[1]};
    background-color: ${activePass == 0 ? bgColors[0] : bgColors[1]};
  `

  const PasswordInput = styled.input.attrs(props => ({
    // Every <PasswordInput /> should be type="password"
    type: 'password'
  }))`
    justify-content: center;
    display: flex;
    margin-left: 50px;
    margin-top: 20px;
    width: 300px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom-color: gray;
    border-bottom-width: 1px;
  `

  const navigate = useNavigate();

  const [
    updateOrder,
    { data: data, loading, error }
  ] = useMutation(ACCEPT_ORDER)

  const handleClickNext = () => {
    updateOrder({
      variables: {
        orderId: /*order()[0]*/ "Ha6zGEo32PyBOlcnbkSuJGxjOuOZY",
        cohenId: inputCohenId
      }
    }).then(navigate(`/eat/submit`).catch(err => console.log("Could not update order")))
  }

  return (
    < div >
      <Grid onClick={() => setActivePass(0)}>
        <Row>
          <Title>Payment Method</Title>
        </Row>
        <Row>
          <CohenTitle>Cohen Club Card</CohenTitle>
        </Row>
        <Row>
          <MembershipTitle>Membership ID:</MembershipTitle>
        </Row>
      </Grid>
      <Row>
        < PasswordInput aria-hidden="true" onClick={() => setActivePass(1)} onChange={event => setInputCohenId(event.target.value)} />
      </Row>
      <Footer onClick={() => {
        handleClickNext()
      }}>Next</Footer>
    </div >
  )
}

export default CohenPayment
