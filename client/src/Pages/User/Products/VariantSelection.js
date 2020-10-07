import React, { useContext, useEffect, useState } from 'react'
import currency from 'currency.js'

const VariantSelection = ({ variants }) => {
  console.log("VARIANT", variants);

  return (
    <div className='variant'>
      <div className='heading'>
        <h1>Select one of the following</h1>
      </div>
      <div className='options'>
        {variants.map(option => (
          <div className='optionSet' key={option.name}>
            <label>
              <input
                type='radio'
                name={'variant type place holder'} //change this to the type of variant use is choosing
                className='variantSelect'
                value={JSON.stringify({ option })}
              />

              <span className='customRadio' />
              <p>{option.name}</p>
              <p>
                {currency(option.price.amount / 100).format({
                  symbol: '$',
                  format: 'USD'
                })}
              </p>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VariantSelection
