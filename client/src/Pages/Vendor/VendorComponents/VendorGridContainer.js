import React from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router'
import { useNavigate } from 'react-router-dom'
import SideNavBar from './SidebarComponents/SideNavBar.js'
import VendorHeader from './VendorHeaderComponents/VendorHeader.js'

const Primary = css`
  @font-face {
    font-family: 'Avenir Black';
    src: url('../../../fonts/Avenir-Black.otf') format('otf');
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 300;
    src: url('../../../fonts/Metropolis-ExtraLight.otf') format('otf');
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 400;
    src: url('../../../fonts/Metropolis-Light.otf') format('otf');
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 500;
    src: url('../../../fonts/Metropolis-Regular.otf') format('otf');
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 600;
    src: url('../../../fonts/Metropolis-SemiBold.otf') format('otf');
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 700;
    src: url('../../../fonts/Metropolis-Bold.otf') format('otf');
  }
  @font-face {
    font-family: 'Metropolis';
    font-weight: 800;
    src: url('../../../fonts/Metropolis-ExtraBold.otf') format('otf');
  }
  font-family: 'Avenir Black', sans-serif;
`
const VendorGridContainer = styled.div`
  ${Primary}
  display: grid;
  grid-template-columns: 16vw 84vw;
  grid-template-rows: 7% 93%;
  grid-template-areas:
    'sidebar vendor-header'
    'sidebar maindisplay';
`

const SideNavigationBarSpace = styled.div`
  grid-area: sidebar;
  background-color: #ffffff;
`

const VendorHeaderSpace = styled.div`
  grid-area: vendor-header;
  background-color: #ffffff;
`

const MainDisplaySpace = styled.div`
  grid-area: maindisplay;
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7e7;
  font-size: 150px;
  text-align: center;
`

function VendorsideTemplate (props) {
  return (
    <VendorGridContainer>
      <SideNavigationBarSpace>
        <SideNavBar />
      </SideNavigationBarSpace>
      <VendorHeaderSpace>
        <VendorHeader />
      </VendorHeaderSpace>
      <MainDisplaySpace> {props.page} </MainDisplaySpace>
    </VendorGridContainer>
  )
}

export default VendorsideTemplate
