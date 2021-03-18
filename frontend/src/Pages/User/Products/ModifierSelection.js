import currency from 'currency.js'
import { GET_ITEM_AVAILABILITIES } from './../../../graphql/ProductQueries'

function ModifierSelection ({ modifierCategory }) {
  const {
    modifiers: options,
    description,
    selectionType,
    name,
    minModifiers
  } = modifierCategory

  return (
    <div className='modifier'>
      <div className='heading'>
        {description ? <p>{description}</p> : null}
        <h1>
          {name}:{minModifiers > 0 && <span className='asterisk'> * </span>}
        </h1>
      </div>
      <div className='options'>
        {options.map(option => (
          <div className='optionSet' key={option.name}>
            {console.log('option', option)}
            <label>
              {selectionType === 'MULTIPLE' ? (
                <>
                  <input
                    // disabled={true}
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
                    // disabled={true}
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
