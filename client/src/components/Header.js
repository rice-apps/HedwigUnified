import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router";

const Primary = css`
    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
    font-family: 'Raleway', sans-serif;
    font-weight: 500;
    /* background-color: #6fffe9; */
    color: #0b132b;
`

const HeaderDiv = styled.div`
    ${Primary}
    width: 100vw;
    height: 8vh;
    display: grid;
    grid-template-columns: 25% 75%;
    font-size: 15pt;
`;

const LinksDiv = styled.div`
    display: grid;
    grid-template-columns: 25%, 25%, 25%, 25%;
`

const Logo = styled.div`
    justify-self: center;
    align-self: center;
    grid-column : 1/2;
    :hover {
        cursor: pointer;
    }
`

const CartLink = styled.a`
    grid-column: 1/2;
    :hover {
        color: red;
        cursor: pointer;
    }
    align-self: center;
`
const OrdersLink = styled.a`
    grid-column:2/3;
    :hover {
        color: red;
        cursor: pointer;
    }
    align-self: center;
`
const VendorsLink = styled.a`
    grid-column:3/4;
    :hover {
        color: red;
        cursor: pointer;
    }
    align-self: center;
`

const SettingsLink = styled.a`
    grid-column:4/5;
    :hover {
        color: red;
        cursor: pointer;
    }
    align-self: center;
`

const Header = () => {
    const history = useHistory();

    return (
        <HeaderDiv>
            <Logo onClick={() => history.push("/home")}>Hedwig</Logo>
            <LinksDiv>
                <CartLink onClick={() => history.push("/user/vendors/ewtea/cart")}>Cart</CartLink>
                <OrdersLink onClick={() => history.push("/user/orders")}>Orders</OrdersLink>
                <VendorsLink onClick={() => history.push("/user/vendors")}>Vendors</VendorsLink>
                <SettingsLink onClick={() => history.push("/user/settings")}>Settings</SettingsLink>
            </LinksDiv>
        </HeaderDiv>
    )
}

export default Header;