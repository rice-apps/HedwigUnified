import { Component, useState } from 'react';

const CartItem = ({ product }) => {
  const [isMouseOver, setIsMouseOver] = useState(false)

  function getVarMod () {
    let VarModList = ' '
    VarModList += product.variant.name + ', '

    for (let i = 0; i < product.modDisplay.length; i++) {
      {
        i < product.modDisplay.length - 1
          ? (VarModList += product.modDisplay[i] + ', ')
          : (VarModList += product.modDisplay[i])
      }
    }
    return VarModList
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  return (
    <div
      className={
        isMouseOver ? 'shelf-item shelf-item--mouseover' : 'shelf-item'
      }
    >
      <div className='shelf-item__title'>
        <p id='title'>{product.name}</p>
        <p id='options'> {getVarMod()}</p>
      </div>
      <div className='shelf-item__price'>
        <p>{formatter.format(product.price * product.quantity)}</p>
      </div>
    </div>
  )
}

export default CartItem
