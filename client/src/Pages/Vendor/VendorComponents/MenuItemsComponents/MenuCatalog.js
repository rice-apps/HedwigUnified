import React, {useState} from 'react'
import styled from 'styled-components'
import MenuItem from './MenuItem.js'
import ItemAvailability from './ItemAvailability.js'
import ItemPrice from './ItemPrice.js'
import MenuCategories from './MenuCategories.js'
import uuid from 'react-uuid'

const GridWrapper = styled.div`
  text-align: center;
  font-size: 14px;
  color: white;
  font-family: 'Futura', sans-serif;
  display: grid;
  grid-template-columns: auto auto auto auto;
  margin-left: 50px;
  align-items: start;
  grid-row-gap: 20px;
  background-color: #f8f8f8;
`

const CategoriesWrapper = styled.div`
  display: grid;
  grid-row: 2 / ${props => props.numItems+2};
  align-items: start;
`

const MenuHeader = styled.h3`
  color: white;
  font-family: 'Futura', sans-serif;
  font-size: 18px;
  font-weight: bold;
  background-color: #696969;
  padding: 15px;
  text-align: left;
`

function MenuCatalog(props){
  const [category, setCategory] = useState(props.category);
  const items = props.catalog.filter((item)=>{
    if (item.category === category){
      return item;
    }
  });

  const updateCategory = function(newCategory){
    setCategory(newCategory);
  }
  return (
    <GridWrapper>
      <MenuHeader>Category</MenuHeader>
      <MenuHeader>Item</MenuHeader>
      <MenuHeader>Availability</MenuHeader>
      <MenuHeader>Price</MenuHeader>
      <CategoriesWrapper numItems={items.length}>
        <MenuCategories updateCategory={updateCategory} catalog={props.catalog} categories={props.categories}/>
      </CategoriesWrapper>
      {items.map(item=>{
        return (
          <React.Fragment key={uuid()}>
            <MenuItem image={item.image} length="80px" name={item.name}/>
            <ItemAvailability itemId={item.dataSourceId} availability={item.isAvailable}/>
            <ItemPrice price={item.variants[0].price.amount}/>
          </React.Fragment>
        )
      })}
    </GridWrapper>
  )
}

export default MenuCatalog;
