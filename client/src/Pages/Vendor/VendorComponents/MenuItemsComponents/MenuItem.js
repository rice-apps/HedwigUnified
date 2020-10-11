import React from 'react'
import styled from 'styled-components'

const ItemWrapper = styled.div`
  font-family: 'Futura', sans-serif;
  font-size: 20px;
  text-align: left;
  vertical-align: middle;
  color: black;
`
const ImageWrapper = styled.div`
  float: left;
`

function MenuItem(props){
  const length = parseInt(props.length.split("p")[0]);
  return (
    <ItemWrapper height={length}>
      <ImageWrapper height={length}><img style={{width:props.length, height:props.length, borderRadius:props.length}}src={props.image} alt={props.name}/></ImageWrapper>
      <strong><p style={{marginLeft: (1.5*length).toString()+"px"}}>{props.name}</p></strong>
    </ItemWrapper>
  )
}

export default MenuItem;
