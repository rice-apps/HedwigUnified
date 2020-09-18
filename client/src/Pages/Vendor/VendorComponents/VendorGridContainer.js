import React from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router";
import { useNavigate } from "react-router-dom";
import SideNavBar from "./SidebarComponents/SideNavBar.js";
import VendorHeader from "./VendorHeaderComponents/VendorHeader.js";

const Primary = css`
  @font-face {
    font-family: "Avenir-Black";
    src: url("'../../../fonts/Avenir-Black.otf'");
  }
  font-family: "Avenir-Black", sans-serif;
`;
const VendorGridContainer = styled.div`
  ${Primary}
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 16vw 84vw;
  grid-template-rows: 7vh 93vh;
  grid-template-areas:
    "sidebar vendor-header"
    "sidebar maindisplay";
  
`;

const SideNavigationBarSpace = styled.div`
  grid-area: sidebar;
  background-color: #ffffff;
`;

const VendorHeaderSpace = styled.div`
  grid-area: vendor-header;
  background-color: #ffffff;
`;

const MainDisplaySpace = styled.div`
  grid-area: maindisplay;
  background-color: #dfdfdf;
  font-size: 150px;
  text-align: center;
`;

function VendorsideTemplate(props) {
  return (
    <VendorGridContainer>
      <SideNavigationBarSpace>
        <SideNavBar/>
      </SideNavigationBarSpace>
      <VendorHeaderSpace>
        <VendorHeader/>
      </VendorHeaderSpace>
      <MainDisplaySpace> {props.name} </MainDisplaySpace>
    </VendorGridContainer>
  );
}

export default VendorsideTemplate;
