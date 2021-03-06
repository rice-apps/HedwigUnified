import currency from 'currency.js'

const VariantSelection = ({ variants }) => {
  console.log('VARIANT', variants)

  return (
    <div className='variant'>
      <div className='heading'>
        {/* <h1>{variants[0].description}</h1> */}
        <h1 style={{ fontSize: '19px' }}>
          {' '}
          Select your variant: <span className='asterisk'> * </span>
        </h1>
        {variants[0].description ? <p>{variants[0].description}</p> : null}
      </div>
      <div className='options'>
        {variants.map(option => (
          <div className='optionSet' key={option.name}>
            <label>
              <input
                type='radio'
                name='place holder' // change this to the type of variant user is choosing
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
