import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import styled from 'styled-components/macro'

const QuantitySelectorWrapper = styled.div`
  display: grid;
  margin:2vh 0vh;
  grid-template-columns: 1fr 1.3fr 1fr;
  grid-template-rows: 1fr;
  width: 25vh;
  height: 5vh;
  align-items: center;
  justify-items: center;
  font-size: 3.9vh;
`

function QuantitySelector ({ quantity, decrease, increase }) {
  return (
    <QuantitySelectorWrapper>
      <HiMinusCircle
        onClick={quantity === 1 ? null : decrease}
        style={{ opacity: quantity === 1 ? '0.35' :'0.85', cursor: 'pointer' }}
      />
      <div style={{ margin: '0vh 2vh', fontSize: '3.3vh' }}>{quantity} </div>
      <HiPlusCircle
        onClick={increase}
        style={{ opacity: '0.85', cursor: 'pointer' }}
      />
    </QuantitySelectorWrapper>
  )
}

export default QuantitySelector
