import { useContext, useEffect, useState } from 'react';

function QuantitySelector ({ quantity, decrease, increase }) {
  return (
    <div className='quantityContainer'>
      <button onClick={decrease} disabled={quantity === 1}>
        &ndash;
      </button>
      <p>{quantity}</p>
      <button onClick={increase}>+</button>
    </div>
  )
}

export default QuantitySelector
