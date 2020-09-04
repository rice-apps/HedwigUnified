import React, { useContext, useEffect, useState } from "react";
import currency from "currency.js";
import "./product.css";
import {makeVar} from '@apollo/client';
import { faIceCream } from "@fortawesome/free-solid-svg-icons";
import {cartItems} from '../../../apollo';




// HOW TO CALL DISPATCH:
// dispatch({
//     type: 'ADD_TO_CART',
//     item:{
//         
//         name: "Milk Tea",
//         Id: Date.now(),
//         variant: {name: "Medium", description: "blah", price: { amount: $3.50, currency: USD }, variantID: 246}
//         modifierList: {modifier: {name: "Boba", desciription: "Chewy bubbles in your drink!", 
//                        price: {amount: $0.50, currency, USD}, modifierID: 345}
//         price: 3.50,
//         quantity: 1
//         }

//     }
// })


function dispatch(action){
    switch(action.type){

        case 'ADD_ITEM':{
            
            const oldCart = cartItems()
            cartItems([...oldCart, action.item])
        }

        case 'UPDATE_QUANTITY':{
            let {quantity, Id} = action.item;
            let newState = cartItems().map((i) =>{
                if(i.Id===Id){
                    return{
                        ...action.item,
                        quantity
                    }
                }
                else return i

            })
            
            return cartItems(newState)
        }

        case 'DELETE_ITEM':{
            let {Id} = action.item;
            let newState = cartItems().filter(i=>i.Id!==Id)
            return cartItems(newState)
        }
        default:{
            return cartItems();
        }
    }

}

export default dispatch;