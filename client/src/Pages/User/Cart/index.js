/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { useParams, useHistory } from 'react-router';
import logo from './tealogo.png'; 
import './cart.scss'
import { centerCenter, row, column, } from '../../../Styles/flex';
import CartProduct from './CartProducts'

const CartDetail = ({ }) => {
    const handleConfirmClick = () => {
        // Submit order
    }

    const cart_menu = [{title: 'Thai Tea', varients: 'Medium, Orea, Boba', price: 3.50}, {title: 'Jasmine Tea', varients: 'Large, Orea, Boba', price: 4.50}]

    return (
        <div className="float-cart">
        <div className="float-cart__content">
          <div className="float-cart__shelf-container">
            
            <div css={[centerCenter, row]}>
                <img src={logo} className="logo" alt="Logo" />
                <div>
                <p css={{margin: '16px 0 0 10px'}}>East West Tea</p>
                <p css={{margin: '0 0 0 10px', color: 'grey'}}>Houston, TX</p>
                </div>
      
            </div>
            {cart_menu.map(item => {
                console.log(item)
                console.log(item.title)
                return (<CartProduct product={item} />)
            })}
           
            </div>
            <div className="float-cart__footer">
            <div className="sub">SUBTOTAL</div>
            <div className="sub-price">
              <p className="sub-price__val">$ 10</p>
            </div>
            {/* <Dropdown
				className="dropdowncontainer"
				options={options}
				value={defaultOption}
				placeholder="Select an option"
			/> */}
            <div className="buy-btn" title={"Confirm"} onClick={handleConfirmClick}>Confirm Order</div>
            </div>
     </div>
</div>
    );
}

export default CartDetail;
