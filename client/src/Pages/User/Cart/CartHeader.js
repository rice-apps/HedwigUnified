import styled from 'styled-components'

import HedwigLogoFinal from './../../../images/HedwigLogoFinal.png'
import RalewayFont from './../../../fonts/GlobalFont'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate, useLocation } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries'

const HeaderWrapper = styled.div`
  position: fixed;
  height: 8vh;
  font-size: 2.8vh;
  width: 100vw;
  top: 0;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background-color: white;
  z-index: 1;
  padding-top: 1vh;
  box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.2);
`

const HedwigLogo = styled.img`
  height: 4.5vh;
  width: 4.5vh;
  margin-right: 5px;
  margin-top: 0l5vh;
`

const HedwigWrapper = styled.div`
  font-family: 'avenirbold';
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`

function CartHeader (props) {
  const navigate = useNavigate()

  //   const { state } = useLocation();
  //   const { currVendor: vendorState } = state;

  //   const {
  //     data: vendor_data,
  //     error: vendor_error,
  //     loading: vendor_loading,
  //   } = useQuery(VENDOR_QUERY, {
  //     variables: { vendor: vendorState },
  //     fetchPolicy: "cache-and-network",
  //     nextFetchPolicy: "cache-first",
  //   });

  //   if (vendor_loading) {
  //     return <p>Loading...</p>;
  //   }
  //   if (vendor_error) {
  //     return <p>ErrorV...</p>;
  //   }

  function getVendorName () {
    // const { getVendor: vendor } = vendor_data;
    // return vendor_data.getVendor.name;
    return 'Cohen House'
  }

  return (
    <HeaderWrapper>
      <RalewayFont />
      <HedwigWrapper>
        {props.showBackButton ? (
          <IoMdArrowRoundBack
            onClick={() => navigate(props.backLink)}
            style={{
              position: 'fixed',
              left: '22px',
              fontSize: '25px',
              verticalAlign: 'middle',
              cursor: 'pointer'
            }}
          />
        ) : null}
        Checkout: {getVendorName()}
      </HedwigWrapper>
    </HeaderWrapper>
  )
}

export default CartHeader
