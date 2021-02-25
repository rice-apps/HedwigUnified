import { useState } from 'react'
import dispatch from '../Products/FunctionalCart'
import './cart.css'
import styled from 'styled-components/macro'
import {
  ShelfItemWrapper,
  ShelfItemImage,
  ShelfItem,
  ShelfItemProduct
} from './CartStyledComponents'
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import { FaTimes } from 'react-icons/fa'

const QuantitySelectorWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr 1fr;
  grid-template-rows: 1fr;
  width: 80%;
  height: 100%;
  align-items: center;
  justify-items: center;
  font-size: 1.9vh;
`

function QuantitySelector ({ quantity, decrease, increase }) {
  return (
    <QuantitySelectorWrapper>
      <HiMinusCircle
        onClick={quantity === 1 ? null : decrease}
        style={{
          opacity: quantity === 1 ? '0.35' : '0.85',
          cursor: 'pointer',
          fontSize: '2.3vh'
        }}
      />

      <div style={{ margin: '0px 7px' }}>{quantity}</div>
      <HiPlusCircle
        onClick={increase}
        style={{ opacity: '0.85', cursor: 'pointer', fontSize: '2.3vh' }}
      />
    </QuantitySelectorWrapper>
  )
}

const CartProduct = ({ product, forceUpdate, updateTotal }) => {
  const [quantity, setQuantity] = useState(product.quantity)

  const increase = () => {
    setQuantity(quantity + 1)
    updateQuantity(quantity + 1)
    forceUpdate(date.getTime())
  }

  const decrease = () => {
    setQuantity(quantity - 1)
    updateQuantity(quantity - 1)
    forceUpdate(date.getTime())
  }

  function getVarMod () {
    let VarModList = ' '
    const numModifiers = product.modDisplay.length
    if (numModifiers === 0) {
      VarModList += product.variant.name
    } else {
      VarModList += product.variant.name + ', '
      for (let i = 0; i < numModifiers; i++) {
        i < numModifiers - 1
          ? (VarModList += product.modDisplay[i] + ', ')
          : (VarModList += product.modDisplay[i])
      }
    }
    return VarModList
  }

  function deleteCartItem () {
    dispatch({
      type: 'DELETE_ITEM',
      item: {
        ...product
      }
    })
  }

  function updateQuantity (num) {
    const newProd = Object.assign({}, product)
    newProd.quantity = num
    dispatch({
      type: 'UPDATE_QUANTITY',
      item: {
        ...newProd
      }
    })
    updateTotal()
  }

  const date = new Date()

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  console.log(product)
  return (
    <ShelfItemWrapper>
      <FaTimes
        style={{
          cursor: 'pointer',
          fontSize: '2.5vh',
          opacity: '0.8',
          color: '#E05B5B'
        }}
        onClick={() => {
          deleteCartItem()
          forceUpdate(date.getTime())
        }}
      />
      <ShelfItemImage
        id='image'
        src={
          product.image
            ? product.image
            : 'https://scontent.fhou1-1.fna.fbcdn.net/v/t1.0-9/56770720_2496620450358466_4855511062713204736_n.jpg?_nc_cat=100&ccb=3&_nc_sid=09cbfe&_nc_ohc=ljQCn12JvCAAX-x41HR&_nc_ht=scontent.fhou1-1.fna&oh=416fce9b15a0cc371a6560ca6316d9e4&oe=605B92F8'
        }
        alt={product.name}
      />
      <ShelfItemProduct>
        <ShelfItem title>{product.name}</ShelfItem>
        <ShelfItem options>{getVarMod()}</ShelfItem>
      </ShelfItemProduct>
      <QuantitySelector
        quantity={quantity}
        increase={increase}
        decrease={decrease}
      />
      <ShelfItem price>{formatter.format(product.price * quantity)}</ShelfItem>
    </ShelfItemWrapper>
  )
}

export default CartProduct
