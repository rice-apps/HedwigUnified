import React, { Component, useState } from "react";
import Button from '@material-ui/core/Button';
import styled, { css } from 'styled-components';
import visa from 'payment-icons/min/flat/visa.svg';
import { FaCreditCard, FaBriefcase } from 'react-icons/fa';
import { BiIdCard } from 'react-icons/bi';

const Payments = () => {

    const [bgColor, setBgColor] = useState([false, false, false]);

    const Title = styled.text`
        margin-top: 110px;
        margin-bottom: 20px;
        font-family: "adobe-clean", sans-serif;
        font-size: 25px;
        color: #595858;
        font-weight: lighter;
    `;

    const ButtonsCol = styled.div`
        display: flex;
        justify-content: space-evenly;
    `;

    const Button = styled.button`
        font-family: 'Raleway', sans-serif;
        border-radius: 20px;
        border-width: 1px;
        border-color: #595858;
        padding: 20px;
        height: 80px;
        width: 230px;
        font-size: 18px;
        font-weight: 500;
        color: #595858;
        text-align: center;
        background-color: ${props => (props.selected ? 'red' : 'white')};
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
    `;


    return (

        // <ButtonsCol>
        //     <Title>Payment Method</Title>
        //     <Button variant="outlined">Tetra</Button>
        //     <Button variant="outlined">Credit Card</Button>
        //     <Button variant="outlined">Cohen Club Card</Button>
        // </ButtonsCol>
        <div>
            <Grid>
                <Row>
                    <Title>Payment Method</Title>
                </Row>
                <Row>
                    <Button variant="outlined" onClick={() => setBgColor('red')}><BiIdCard size={40}></BiIdCard>Tetra</Button>

                </Row>
                <Row>
                    <Button variant="outlined"><FaCreditCard size={32}></FaCreditCard> Credit Card</Button>
                </Row>
                <Row>
                    <Button variant="outlined"><FaBriefcase size={32}></FaBriefcase> Cohen Club Card</Button>
                </Row>
            </Grid>
            <Footer>Next</Footer>
        </div>
    )
};


export default Payments
