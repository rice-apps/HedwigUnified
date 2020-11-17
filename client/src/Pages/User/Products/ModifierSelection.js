import { useContext, useEffect, useState } from 'react';
import currency from 'currency.js'

function ModifierSelection ({ modifierCategory }) {
  const {
    modifiers: options,
    question,
    description,
    selectionType,
    name
  } = modifierCategory
  return (
    <div className='modifier'>
      <div className='heading'>
        {/* <h1>{question}</h1> */}
        <h1>Select your modifiers/add-ons:</h1>
        {description ? <p>{description}</p> : null}
        <h1>{name}</h1>
      </div>
      <div className='options'>
        {options.map(option => (
          <div className='optionSet' key={option.name}>
            <label>
              {selectionType === 'MULTIPLE' ? (
                <>
                  <input
                    type='checkbox'
                    name={name}
                    className='modifierSelect'
                    value={JSON.stringify({ option })}
                  />
                  <span className='customCheck' />
                </>
              ) : (
                <>
                  <input
                    type='radio'
                    name={name}
                    className='modifierSelect'
                    value={JSON.stringify({ option })}
                  />
                  <span className='customRadio' />
                </>
              )}
              <p>{option.name}</p>
              {option.price ? (
                <p>
                  {currency(option.price.amount / 100).format({
                    symbol: '$',
                    format: 'USD'
                  })}
                </p>
              ) : (
                <p />
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModifierSelection
