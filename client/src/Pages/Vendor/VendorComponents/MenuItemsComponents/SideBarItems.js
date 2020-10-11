import React from 'react'
import styled from 'styled-components'
import uuid from 'react-uuid'

const SideBarItemsWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 80%;
  /* background-color: green; */
  flex-direction: column;
  align-content: stretch;
  margin-top: 10px;
`

const CategoryWrapper = styled.div`
  width: 80%;
  padding: 1vh 0.4vw;
  border-radius: 20px;
`
const CategoryButton = styled.button`
  font-family: 'Avenir', sans-serif;
  font-size: 18px;
  color: black;
  font-weight: bold;
  background-color: transparent;
  outline: none;
  border: none;
  padding-bottom: 5px;
  &:hover {
    border-bottom: 5px solid #ea907a;
    font-family: 'Futura', sans-serif;
  }
`

function Category (props) {
  return (
    <CategoryWrapper>
      <CategoryButton onClick={()=>{props.updateCategory(props.category)}}>{props.category}</CategoryButton>
    </CategoryWrapper>
  )
}

function SideBarItems (props) {
  return (
    <SideBarItemsWrapper>
      {props.categories.map(category => {
        return (
          <Category
            key={uuid()}
            category={category}
            updateCategory={props.updateCategory}
          ></Category>
        )
      })}
    </SideBarItemsWrapper>
  )
}

export default SideBarItems
