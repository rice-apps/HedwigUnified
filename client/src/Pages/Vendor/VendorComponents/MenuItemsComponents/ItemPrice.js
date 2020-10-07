import React from 'react'
import styled from 'styled-components'

const ItemWrapper = styled.div`
  text-align: left;
  vertical-align: middle;
  font-size: 14px;
  font-family: 'Avenir', sans-serif;
  color: black;
  margin-top: 15px; 
`
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

function ItemPrice(props){
  return (
    <ItemWrapper>
      <p>{formatter.format(props.price/100)+"+"}</p>
    </ItemWrapper>
  )
}

export default ItemPrice;
