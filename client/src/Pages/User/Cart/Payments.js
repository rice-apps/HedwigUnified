import React, { Component, useState } from 'react'
import Button from '@material-ui/core/Button'
import styled, { css } from 'styled-components'
// import visa from 'payment-icons/min/flat/visa.svg';
import { FaCreditCard, FaBriefcase } from 'react-icons/fa'
import { BiIdCard } from 'react-icons/bi'
import zIndex from '@material-ui/core/styles/zIndex'
import { useNavigate } from 'react-router-dom'

// payment options page, coehn club or credit card or tetra
const Payments = () => {
  const navigate = useNavigate()

  // The index of the button that is clicked (0, 1, or 2), if no button is clicked the index is 3
  const [activeButton, setActiveButton] = useState(3)

  // colors
  const bgColors = ['white', '#cf5734']
  const fontColors = ['#595858', 'white']
  const fontWeights = [500, 700]

  const Title = styled.text`
    margin-top: 110px;
    margin-bottom: 20px;
    font-family: 'adobe-clean', sans-serif;
    font-size: 25px;
    color: #595858;
    font-weight: lighter;
  `

  // const ButtonsCol = styled.div`
  //         display: flex;
  //         justify-content: space-evenly;
  //     `;

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

  // const Text = styled.text`
  //     text-align: right;
  // `;

  const Grid = styled.div``

  const Row = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  `

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
    font-weight: ${activeButton !== 3 ? fontWeights[1] : fontWeights[0]};
    color: ${activeButton !== 3 ? fontColors[1] : fontColors[0]};
    background-color: ${activeButton !== 3 ? bgColors[1] : bgColors[0]};
  `

  // Changes background color of a button if its selected
  const renderBgColor = index => {
    return index === activeButton ? bgColors[1] : bgColors[0]
  }

  // Changes font color of a button if its selected
  const renderFontColor = index => {
    return index === activeButton ? fontColors[1] : fontColors[0]
  }

  // Changes weight of font if button is selected
  const renderFontWeight = index => {
    return index === activeButton ? fontWeights[1] : fontWeights[0]
  }

  // Displays the payment option buttons
  const renderButtons = () => {
    const icons = [
      <BiIdCard size={48}></BiIdCard>,
      <FaCreditCard size={37}></FaCreditCard>,
      <FaBriefcase size={37}></FaBriefcase>
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
    return navigate(`/cohen`)
  }

  const handleClickCredit = () => {
    // Go to the cohen checkout page
    return navigate(`/payment`)
  }

  // handle when the user clicks on credit card option and next
  // const handleCreditNext = () {
  //     return navigate()
  // }

  return (
    <div>
      <Grid>
        <Row>
          <Title>Payment Method</Title>
        </Row>
        {renderButtons()}
      </Grid>
      <Footer
        onClick={() =>
          activeButton == 2 ? handleClickCohen() : handleClickCredit()
        }
      >
        Next
      </Footer>
    </div>
  )
}

// should check whether current merchant supports square payments <- assume this is automatic
// make create payments call with shopify as payment option
// object u get back has url field
// payment page should take url to be embedded

export default Payments
