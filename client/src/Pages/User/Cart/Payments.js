import React, { Component, useState } from "react";
import Button from '@material-ui/core/Button';
import styled, { css } from 'styled-components';
// import visa from 'payment-icons/min/flat/visa.svg';
import { FaCreditCard, FaBriefcase } from 'react-icons/fa';
import { BiIdCard } from 'react-icons/bi';
import zIndex from "@material-ui/core/styles/zIndex";

const Payments = () => {

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
        const icons = [<BiIdCard size={48}></BiIdCard>, <FaCreditCard size={37}></FaCreditCard>, <FaBriefcase size={37}></FaBriefcase>]
        const options = ["Tetra", "Credit Card", "Cohen Club Card"]

        return (
            icons.map((icon, index) =>
                <Row>
                    <Button variant="outlined"
                        onClick={() => activeButton !== index ? setActiveButton(index) : setActiveButton(3)}
                        style={{
                            backgroundColor: renderBgColor(index),
                            color: renderFontColor(index),
                            fontWeight: renderFontWeight(index)
                        }}>
                        {icons[index]}
                        <Text style={{ marginLeft: '10px', marginBottom: '10px' }}>
                            {options[index]}
                        </Text>
                    </Button>
                </Row >

            )
        )
    }


    return (
        < div >
            <Grid>
                <Row>
                    <Title>Payment Method</Title>
                </Row>
                {renderButtons()}
            </Grid>
            <Footer>Next</Footer>
        </div >
    )
};


export default Payments;
