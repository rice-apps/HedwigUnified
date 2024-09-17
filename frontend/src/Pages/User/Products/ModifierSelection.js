import currency from 'currency.js'
import { GET_ITEM_AVAILABILITIES } from './../../../graphql/ProductQueries'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries.js'
import { SmallLoadingPage } from './../../../components/LoadingComponents'
import './product.css'

function ModifierSelection ({ modifierCategory }) {
  const { state } = useLocation()
  const { currentVendor } = state

  const {
    modifiers: options,
    description,
    selectionType,
    name,
    minModifiers
  } = modifierCategory

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: currentVendor,  },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  if (vendor_loading) {
    return <SmallLoadingPage />
  }
  if (vendor_error) {
    return <p>ErrorV...</p>
  }

  const availModifiers = vendor_data.getVendor.availableModifiers
  let isAvailable = true

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
          isAvailable = availModifiers.includes(option.dataSourceId),
          <div className='optionSet' key={option.name}>
            <label>
              {selectionType === 'MULTIPLE' ? (
                <>
                  <input
                    disabled={isAvailable ? false : true}
                    type='checkbox'
                    name={name}
                    className='modifierSelect'
                    value={JSON.stringify({ option })}
                  />
                  <span className={isAvailable ? 'customCheck' : 'customCheckUnavail'} />
                </>
              ) : (
                <>
                  <input
                    disabled={isAvailable ? false : true}
                    type='radio'
                    name={name}
                    className='modifierSelect'
                    value={JSON.stringify({ option })}
                  />
                  <span className={isAvailable ? 'customRadio' : 'customRadioUnavail'} />
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
