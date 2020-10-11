import React from "react";
import styled from "styled-components";
import Toggle from "react-toggle";

const DisplayWrapper = styled.div`
  font-size:25px;
  color: #0f0f0f;
  height: 70px;
  width: 56vw;
  display: grid;
  align-items: center;
  justify-items: center;
  justify-content: center;
  grid-template-columns: 1.75fr 5.25fr 2.25fr 2.75fr;
  grid-template-rows: 1fr;
  padding-bottom:5px;
  padding-top: 5px;
  grid-template-areas: "ItemPictureSpace ItemNameSpace ItemAvailabilitySpace ItemPriceSpace";
  border-bottom: 2px #D3D3D3 solid;
`;

const ItemPicture = styled.img`
  border-radius: 50%;
  height: 60px;
  width: 60px;
  grid-area: ItemPictureSpace;
  background-color: blue;
`;

const ItemName = styled.div`
  grid-area: ItemNameSpace;
  line-height: 25px;
  font-size:20px;
  text-align: left;
  justify-self: left;
`;

const ItemAvailability = styled.div`
grid-area: ItemAvailabilitySpace;
padding-top: 15px;
`
const ItemPrice = styled.div`
margin-left:2.5vw;
grid-area: ItemPriceSpace;
font-weight:100;
`

function MakeCatalogItems(props) {
  return (
    <DisplayWrapper>
      <ItemPicture src={props.itemImage} />
      <ItemName>{props.itemName}</ItemName>
      <ItemAvailability><Toggle/></ItemAvailability>
      <ItemPrice>${props.itemPrice}</ItemPrice>
    </DisplayWrapper>
  );
}

export default MakeCatalogItems;
