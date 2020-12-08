import { Component, useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import {orderSummary, userProfile} from "../../../apollo"
import Button from '@material-ui/core/Button';
import styled, { css } from 'styled-components';
// import visa from 'payment-icons/min/flat/visa.svg';
import { FaCreditCard, FaBriefcase } from 'react-icons/fa'
import { BiIdCard } from 'react-icons/bi'
import zIndex from '@material-ui/core/styles/zIndex'
import { useNavigate, Navigate } from 'react-router-dom'

// import { order } from '../../../apollo'
import Iframe from 'react-iframe'

// Payment Options page + embedding Shopify url

const CREATE_PAYMENT = gql`
        mutation CREATE_PAYMENT($sourceId: String!, $orderId: String!, $locationId: String!, $amount: Int!, $currency: String!){
            createPayment(
                record: {
                  source: SHOPIFY
                  sourceId: $sourceId
                  orderId: $orderId
                  locationId: $locationId
                  subtotal: { amount: $amount, currency: $currency }
                  tip: {amount: 0, currency: $currency}
                }
              ) {
                id
                total {
                  amount
                  currency
                }
                url
              }

        }
    `

const UPDATE_ORDER = gql`
    mutation ($studentId: String!, $orderId: String!, $uid: String!, $state: FulFillmentStatusEnum!) {
      updateOrder(
        orderId: $orderId
        record: {
        studentId: $studentId
        fulfillment: {
          uid: $uid
          state: $state
        }
      }
      ){
        fulfillment{
          state
        }
      }
    }`


// payment options page, coehn club or credit card or tetra
function Payments () {
  const navigate = useNavigate()

  // The index of the button that is clicked (0, 1, or 2), if no button is clicked the index is 3
  const [activeButton, setActiveButton] = useState(3);

  // colors
  const bgColors = ['white', '#cf5734'];
  const fontColors = ['#595858', 'white'];
  const fontWeights = [500, 700];

  const Title = styled.text`
    margin-top: 110px;
    margin-bottom: 20px;
    font-family: 'adobe-clean', sans-serif;
    font-size: 25px;
    color: #595858;
    font-weight: lighter;
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
    /* padding-left: 50px; */
    padding: 20px;
    padding-left: 30px;
    align-items: center;
    justify-content: center;
    display: grid;
    grid-template-columns: 2fr 3fr;
    grid-template-rows: 1fr;
  `

  const Grid = styled.div``

  const Row = styled.div`
            display: flex;
            justify-content: center;
            margin-bottom: 40px;
        `;

  const Footer = styled.footer`
            text-align: center;
            position:absolute;
            left:0;
            bottom:0;
            right:0;
            display:block;
            border-style: solid;
            border-width: 1px;
            padding: 25px 0;
            font-size: 25px;
            font-weight: ${activeButton !== 3 ? fontWeights[1] : fontWeights[0]};
            color: ${activeButton !== 3 ? fontColors[1] : fontColors[0]};
            background-color: ${ activeButton !== 3 ? bgColors[1] : bgColors[0]};
    `;

  // Changes background color of a button if its selected
  const renderBgColor = (index) => {
    return (index === activeButton ? bgColors[1] : bgColors[0]);
  };

  // Changes font color of a button if its selected
  const renderFontColor = (index) => {
    return (index === activeButton ? fontColors[1] : fontColors[0]);
  };

  // Changes weight of font if button is selected
  const renderFontWeight = (index) => {
    return (index === activeButton ? fontWeights[1] : fontWeights[0]);
  };

  // Displays the payment option buttons
  const renderButtons = () => {
    const icons = [
      <BiIdCard size={48} />,
      <FaCreditCard size={37} />,
      <FaBriefcase size={37} />
    ]
    const options = ['Tetra', 'Credit Card', 'Cohen Club Card']

    return icons.map((icon, index) => (
      <Row>
        <Button
          variant='outlined'
          onClick={() =>
            activeButton !== index ? setActiveButton(index) : setActiveButton(3)
          }
          style={{
            backgroundColor: renderBgColor(index),
            color: renderFontColor(index),
            fontWeight: renderFontWeight(index)
          }}
        >
          {icons[index]}
          {/* <Text> */}
          {options[index]}
          {/* </Text> */}
        </Button>
      </Row>
    ))
  }

  const handleClickCohen = () => {
    // Go to the cohen checkout page
    return navigate('/cohen')
  }

  // Credit card payment mutation:
  const [
    createPayment,
    { data: data, loading, error }
  ] = useMutation(CREATE_PAYMENT)

  const [
    updateOrder,
    { data: orderData, loading: orderLoading, error: orderError }
  ] = useMutation(UPDATE_ORDER)

  if (loading) return <p>'Loading vendor's business hour ...'</p>
  if (error) return <p>`Error! ${error.message}`</p>



  if (orderLoading) return <p>Loading...</p>
  if (orderError) {
    return <p>{orderError.message}</p>
  }
  const order = orderSummary();

  const handleClickCredit = async () => {
    // Get url and embed that url
    const payment = await createPayment({
      variables: {
        sourceId: "cnon:card-nonce-ok",
        orderId: order['orderId'],
        // hard coded right now:
        // orderId: "DQI6ReqW4BEWFkHG2KuZ3y3LHucZY",
        // For testing:
        // orderId: "NdQueMldCtknK2vMKsxUL01daxAZY",
        locationId: "FMXAFFWJR95WC", amount: 900, currency: "USD"
      }
    })

    // 11/8: Save this url to local storage for now, later want to pass it in as a prop to
    // CreditPayment.fa-js

    localStorage.setItem("url", payment.data.createPayment.url)
    orderSummary(Object.assign(orderSummary(),
      {
        'url': payment.data.createPayment.url
      }
    )
    )

    // 11/14: iframe url not working correctly
    // return navigate('/credit', { state: payment.data.createPayment.url });
    return orderSummary()['url']
    // Previously used to call this function:
    // renderIFrame(data.createPayment.url)
  }
  const handleClickTetra = () => {
    // To be implemented: Tetra payment should be automatic 
    console.log(userProfile());
    console.log({
      orderId: order['orderId'],
      // For testing:
      // orderId: "NdQueMldCtknK2vMKsxUL01daxAZY",
      studentId: userProfile()['studentId'],
      uid: order.fulfillment.uid,
      state: order.fulfillment.state
    })
    updateOrder({
      variables: {
        orderId: order['orderId'],
        // For testing:
        // orderId: "NdQueMldCtknK2vMKsxUL01daxAZY",
        studentId: userProfile()['studentId'],
        uid: order.fulfillment.uid,
        state: order.fulfillment.state
      }
    })
    return navigate('/eat/submit')
  }

  return (
    < div >
      <Grid>
        <Row>
          <Title>Payment Method</Title>
        </Row>
        {renderButtons()}
      </Grid>
      {/* when next is clicked, render the appropriate payment option process*/}
      <Footer onClick={async () => activeButton == 0 ? handleClickTetra() :
        // open url in new window:
        activeButton == 1 ? window.open(await handleClickCredit(), "_blank") :
          activeButton == 2 ? handleClickCohen() : { undefined }
      }>Next</Footer>
    </div >
  )
};

export default Payments;
