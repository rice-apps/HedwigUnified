import styled, { css } from 'styled-components/macro'
import SideNavBar from './SidebarComponents/SideNavBar.js'
import VendorHeader from './VendorHeaderComponents/VendorHeader.js'
import MetropolisFont from '../../../fonts/GlobalFont.js'

const VendorGridContainer = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 16vw 84vw;
  grid-template-rows: 7vh 93vh;
  grid-template-areas:
    'sidebar vendor-header'
    'sidebar maindisplay';
`

const SideNavigationBarSpace = styled.div`
  grid-area: sidebar;
  background-color: #ffffff;
  // font-family: 'Metropolis';
`

const VendorHeaderSpace = styled.div`
  grid-area: vendor-header;
  background-color: #ffffff;
  // font-family: 'Metropolis';
`

const MainDisplaySpace = styled.div`
  grid-area: maindisplay;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e7e7;
  font-size: 150px;
  // font-family: 'Metropolis';
  text-align: center;
`

function VendorsideTemplate (props) {
  return (
    <VendorGridContainer>
      <MetropolisFont />
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
