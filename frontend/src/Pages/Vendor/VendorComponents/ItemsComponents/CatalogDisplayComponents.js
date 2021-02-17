import styled from 'styled-components/macro'
import Toggle from 'react-toggle'
import {
  GET_ITEM_AVAILABILITY,
  SET_ITEM_AVAILABILITY,
  GET_MODIFIER_AVAILABILITY,
  SET_MODIFIER_AVAILABILITY
} from '../../../../graphql/ProductQueries.js'
import { useQuery, useMutation } from '@apollo/client'
import ClipLoader from 'react-spinners/ClipLoader'

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
      vendor: currentUser.vendor,
      productId: props.itemId
    },
    fetchPolicy: 'network-only'
  })

  if (availability_loading) {
    return <ClipLoader size={100} color='#0f0f0f' loading />
  }
  if (availability_error) {
    return <p>Error...</p>
  }
  const { getAvailability: availability } = availability_info

  return (
    <DisplayWrapper>
      <ItemPicture src={props.itemImage} />
      <ItemName>{props.itemName}</ItemName>
      <ItemAvailability>
        <Toggle
          icons={false}
          defaultChecked={availability}
          
          onChange={e => {
            setAvailability({ variables:{vendor: currentUser.vendor,
              productId: props.itemId,
              isItemAvailable: e.target.checked}
            }).then(data=>console.log(data))
            // setTimeout(500, window.location.reload())
          }}
          
        />
      </ItemAvailability>
      <ItemPrice>{formatter.format(props.itemPrice / 100)}</ItemPrice>
    </DisplayWrapper>
  )
}

export default MakeCatalogItems
