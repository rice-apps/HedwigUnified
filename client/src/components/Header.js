import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router";

const Primary = css`
    background-color: #0779e4;
    color: #eff3c6;
`

const HeaderDiv = styled.div`
    ${Primary}

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100vw;
    height: 50px;
`;

const LinksDiv = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`

const Logo = styled.div`
    align-self: center;
    flex-grow: 3;
    margin-left: 50px;

    :hover {
        cursor: pointer;
    }
`

const Link = styled.a`
    margin-right: 50px;

    :hover {
        cursor: pointer;
    }
`

const Header = () => {
    const history = useHistory();

    return (
        <HeaderDiv>
            <Logo onClick={() => history.push("/home")}>Hedwig</Logo>
            <LinksDiv>
                <Link onClick={() => history.push("/user/vendors/ewtea/cart")}>Cart</Link>
                <Link onClick={() => history.push("/user/vendors")}>Vendors</Link>
                <Link onClick={() => history.push("/user/settings")}>Settings</Link>
            </LinksDiv>
        </HeaderDiv>
    )
}

export default Header;