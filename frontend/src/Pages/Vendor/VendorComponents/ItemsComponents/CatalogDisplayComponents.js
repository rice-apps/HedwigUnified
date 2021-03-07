import styled from 'styled-components/macro'
import {
  GET_ITEM_AVAILABILITY,
  SET_ITEM_AVAILABILITY,
  GET_MODIFIER_AVAILABILITY,
  SET_MODIFIER_AVAILABILITY
} from '../../../../graphql/ProductQueries.js'
import { useQuery, useMutation } from '@apollo/client'
import ClipLoader from 'react-spinners/ClipLoader'
import { useState, useEffect } from 'react'

const DisplayWrapper = styled.div`
  font-size: 25px;
  color: #0f0f0f;
  height: 70px;
  width: 56vw;
  display: grid;
  align-items: center;
  justify-items: center;
  justify-content: center;
  grid-template-columns: 1.75fr 5.25fr 2.25fr 2.75fr;
  grid-template-rows: 1fr;
  padding-bottom: 5px;
  padding-top: 5px;
  grid-template-areas: 'ItemPictureSpace ItemNameSpace ItemAvailabilitySpace ItemPriceSpace';
  border-bottom: 2px #d3d3d3 solid;
`

const ItemPicture = styled.img`
  border-radius: 50%;
  height: 60px;
  width: 60px;
  grid-area: ItemPictureSpace;
  background-color: blue;
`

const ItemName = styled.div`
  grid-area: ItemNameSpace;
  line-height: 25px;
  font-size: 20px;
  text-align: left;
  justify-self: left;
`

const ItemAvailability = styled.div`
  grid-area: ItemAvailabilitySpace;
  padding-top: 15px;
`
const ItemPrice = styled.div`
  margin-left: 2.5vw;
  grid-area: ItemPriceSpace;
  font-weight: 100;
`

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`

const ToggleInput = styled.input`
  & {
    opacity: 0;
    width: 0;
    height: 0;
  }
  &:checked + .slider {
    background-color: #ea907a;
  }
  &:focus + .slider {
    box-shadow: 0 0 1px #ea907a;
  }
  &:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`

const ToggleSlider = styled.span`
  & {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 20px;
  }
  &:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
`

function MakeCatalogItems (props) {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  var SET_AVAILABILITY = SET_ITEM_AVAILABILITY;
  var GET_AVAILABILITY = GET_ITEM_AVAILABILITY;
  if (props.itemType === "Modifier") {
    SET_AVAILABILITY = SET_MODIFIER_AVAILABILITY;
    GET_AVAILABILITY = GET_MODIFIER_AVAILABILITY;
  }
  const [setAvailability] = useMutation(SET_AVAILABILITY)
  const {
    data: availability_info,
    error: availability_error,
    loading: availability_loading
  } = useQuery(GET_AVAILABILITY, {
    variables: {
      vendor: currentUser.vendor[0],
      productId: props.itemId
    },
    fetchPolicy: 'network-only'
  })

  const [isChecked, setIsChecked] = useState()

  useEffect(() => {
    if (availability_info) {
      setIsChecked(availability_info.getAvailability)
    }
  }, [availability_info])

  function ToggleCheck () {
    const e = !isChecked
    setIsChecked(e)
  }

  if (availability_loading) {
    return <ClipLoader size={100} color='#0f0f0f' loading />
  }
  if (availability_error) {
    return <p>Error...</p>
  }

  return (
    <DisplayWrapper>
      <ItemPicture src={props.itemImage} />
      <ItemName>{props.itemName}</ItemName>
      <ItemAvailability>
        <ToggleSwitch>
          <ToggleInput
            type='checkbox'
            checked={isChecked}
            onChange={e => {
              setAvailability({
                variables: {
                  vendor: currentUser.vendor[0],
                  productId: props.itemId,
                  isItemAvailable: e.target.checked
                }
              })
              ToggleCheck()
            }}
          />
          <ToggleSlider className='slider' />
        </ToggleSwitch>
      </ItemAvailability>
      <ItemPrice>{formatter.format(props.itemPrice / 100)}</ItemPrice>
    </DisplayWrapper>
  )
}

export default MakeCatalogItems
