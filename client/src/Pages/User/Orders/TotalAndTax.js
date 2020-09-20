import React, { useState } from 'react'

const TotalAndTax = ({ items }) => {
    console.log("ITEMS", items)
    var tax = 0.1
    var total = 0
    var list = items.map(item => {
      if (parseFloat(item.product.price) != undefined) {
        return parseFloat(item.product.price)
      } else {
        return 0.0
      }
    })
  
    for (const item_order of list) {
      total += parseFloat(item_order)
    }
  
    return (
      <div>
        <p>
          Tax: <strong>${(total * tax).toFixed(2)}</strong>
        </p>
        <p>
          Total: <strong>${(total + total * tax).toFixed(2)}</strong>
        </p>
      </div>
    )
  }

export default TotalAndTax