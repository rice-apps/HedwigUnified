import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import Thumb from './Thumb.js'
import { DropDownList } from '@progress/kendo-react-dropdowns';
import logo from './icons8-team-7LNatQYMzm4-unsplash.jpg'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const CartProduct = (product) => {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [quantity, setQuantity] = useState(2)
const handleMouseOver = () => {
    setIsMouseOver(true)
  }
const handleMouseOut = () => {
    setIsMouseOver(false)
  }
const increase = () => {
      setQuantity(quantity + 1)
    }

const decrease = () => {
      setQuantity(quantity - 1)
    }

  const options = [
  'ASAP', '30 Minutes', '1 Hour'
];
const defaultOption = options[0];
  return (
  
  <div className={(isMouseOver) ? 'shelf-item shelf-item--mouseover': 'shelf-item'}>
    <div
          className="shelf-item__del"
          onMouseOver={() => handleMouseOver()}
          onMouseOut={() => handleMouseOut()}
        />
    
    <Thumb
          classes="shelf-item__thumb"
          src={logo}
          alt={'Thai Tea'}
    />
        {/* <DropDownList data={[ "ASAP",, "30 Minutes", "1 Hour", "1.5 Hours", "2 Hours", "3 Hours", "4 Hours"]} defaultValue="ASAP" />  */}
        
       
        <div className="shelf-item__details">
          <p className="shelf-item__price">Thai Tea</p>
        <div className="shelf-item__price">
            <button onClick={decrease} disabled={quantity === 1}>-</button>
            <h5>{quantity}</h5>
            <button onClick={increase}>+</button>
        </div>
      
         <Dropdown className="dropdowncontainer" options={options} value={defaultOption} placeholder="Select an option" />
        <div className="shelf-item__price">
          <p>${3.5 * quantity}</p>
        </div>
 </div>
      </div>
    
    )
}

export default CartProduct
