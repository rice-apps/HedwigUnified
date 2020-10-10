import React, { Component, useState } from "react";
import Button from '@material-ui/core/Button';
import styled, { css } from 'styled-components';
import {
    SquarePaymentForm,
    CreditCardNumberInput,
    CreditCardExpirationDateInput,
    CreditCardPostalCodeInput,
    CreditCardCVVInput,
    CreditCardSubmitButton
} from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'

// This is credit card payment! screen

function CohenPayment(props) {

    // The index of the button that is clicked (0, 1, or 2), if no button is clicked the index is 3
    const [activeButton, setActiveButton] = useState(3);

    // colors
    const bgColors = ['white', '#cf5734'];
    const fontColors = ['#595858', 'white'];
    const fontWeights = [500, 700];

    const Title = styled.text`
            margin-top: 110px;
            margin-bottom: 20px;
            font-family: "adobe-clean", sans-serif;
            font-size: 25px;
            color: #595858; 
            font-weight: lighter;
        `;

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
            padding-left: 50px;
        `;

    const Text = styled.text`
        text-align: right;
    `;

    const Grid = styled.div`
        `;

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

    const Input = styled.input.attrs({
        type: 'submit',
        value: 'Submit'
    })`
    background: #00aec9;
    color: #fff;
    cursor: pointer;
    margin-bottom: 0;
    text-transform: uppercase;
    width: 100%;
    border-radius: 5px;
    height: 35px;
    border-color: transparent;
    box-shadow: 0px;
    outline: none;
    transition: 0.15s;
    text-align: center;
    &:active {
      background-color: #f1ac15;
    }
  `;

    return (
        < div >
            <Grid>
                <Row>
                    <Title>Payment Method</Title>
                    <Title>Cohen Club Card</Title>
                </Row>
                <Input />
            </Grid>
            <Footer>Next</Footer>
        </div >
    )
}

export default CohenPayment
