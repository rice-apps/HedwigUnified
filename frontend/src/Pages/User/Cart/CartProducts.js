import { useState } from 'react'
import dispatch from '../Products/FunctionalCart'
import './cart.css'
import styled from 'styled-components/macro'
import {
  Title,
  ShelfItemWrapper,
  ShelfItemImage,
  ShelfItem,
  ShelfItemProduct
} from './CartStyledComponents'
import { HiMinusCircle, HiPlusCircle } from 'react-icons/hi'
import {FaTimes} from 'react-icons/fa'


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
        style={{ opacity: quantity === 1 ? '0.35' : '0.85', cursor: 'pointer', fontSize:'2.3vh' }}
      />

      <div style={{ margin: '0px 7px' }}>{quantity}</div>
      <HiPlusCircle
        onClick={increase}
        style={{ opacity: '0.85', cursor: 'pointer', fontSize:'2.3vh' }}
      />
    </QuantitySelectorWrapper>
  )
}

const CartProduct = ({ product, forceUpdate, updateTotal }) => {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [quantity, setQuantity] = useState(product.quantity)
  const handleMouseOver = () => {
    setIsMouseOver(true)
  }
  const handleMouseOut = () => {
    setIsMouseOver(false)
  }

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
  const options = ['ASAP', '30 Minutes', '1 Hour']

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  console.log(product)
  return (
    <ShelfItemWrapper>
      <FaTimes
        style={{ cursor: 'pointer', fontSize: '2.5vh', opacity: '0.8' , color:'#E05B5B'}}
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
            : 'https://img.cinemablend.com/filter:scale/quill/9/6/6/3/7/a/96637aabb562881adec1336c0d78acc6cc5d1403.jpg?mw=600'
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
