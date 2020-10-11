import React from 'react'
import styled from 'styled-components'
import Toggle from 'react-toggle'
import './Toggle.css'
import {GET_ITEM_AVAILABILITY, SET_ITEM_AVAILABILITY} from '../../../../graphql/ProductQueries.js'
import uuid from 'react-uuid'
import { useQuery, useMutation, NetworkStatus } from '@apollo/client';

const ItemWrapper = styled.div`
  text-align: left;
  vertical-align: middle;
  width: 100px;
  color: black;
  margin-top: 25px;
`

function ItemAvailability(props){
  const [setAvailability] = useMutation(SET_ITEM_AVAILABILITY);
  const {
    data: availability_info,
    error: availability_error,
    loading: availability_loading,
  } = useQuery(GET_ITEM_AVAILABILITY, {
    variables: {
      productId: props.itemId
    },
    fetchPolicy: 'network-only'
  })

  if (availability_loading) {
    return <p>Loading...</p>
  }
  if (availability_error) {
    return <p>Error...</p>
  }
  const {getAvailability: availability} = availability_info;

  return (
    <ItemWrapper>
      <Toggle icons={false} defaultChecked={availability} onChange={
        e => {
          setAvailability({variables:{idempotencyKey:uuid(),productId:props.itemId,isItemAvailable:e.target.checked}});
          window.location.reload();
        }
      }/>
    </ItemWrapper>
  )
}

export default ItemAvailability;
