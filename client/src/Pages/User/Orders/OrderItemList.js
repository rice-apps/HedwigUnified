import React, { useState } from 'react'

const OrderItemList = ({ items }) => {
    return (
      <div>
        {items.map(item => (
          <span className='item'>
            <p>{item.product.name}</p>{' '}
            <p>${parseFloat(item.product.price).toFixed(2)}</p>
          </span>
        ))}
        <hr class='solid'></hr>
      </div>
    )
  }

export default OrderItemList