/* eslint-disable no-lone-blocks */
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import './product.css'
import { useNavigate, useLocation } from 'react-router-dom'

import dispatch from './FunctionalCart'
import { orderSummary, cartItems } from '../../../apollo'
import VariantSelection from './VariantSelection'
import QuantitySelector from './QuantitySelector'
import ModifierSelection from './ModifierSelection'
import { GET_ITEM } from '../../../graphql/ProductQueries'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries'
import BuyerHeader from './../Vendors/BuyerHeader.js'
import BottomAppBar from './../Vendors/BottomAppBar.js'

function Product () {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { currProduct: productId, currVendor: vendorState } = state

  const {
    data: product_data,
    error: product_error,
    loading: product_loading
  } = useQuery(GET_ITEM, {
    variables: {
      dataSourceId: productId
    }
  })

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: vendorState },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [quantity, setQuantity] = useState(1)

  const [requiredFilled, setRequiredFilled] = useState(true)

  if (vendor_loading) {
    return <p>Loading...</p>
  }
  if (vendor_error) {
    return <p>ErrorV...</p>
  }

  if (product_loading) {
    return <p>Loading...</p>
  }
  if (product_error) {
    return <p>ErrorP...</p>
  }

  const { getItem: product } = product_data
  const { getVendor: vendor } = vendor_data

  const increase = () => {
    setQuantity(quantity + 1)
  }

  const decrease = () => {
    setQuantity(quantity - 1)
  }

  function makeCartItem () {
    const vendor = vendor_data.getVendor
    const order = orderSummary()
    console.log('ORDER SUMMARY', orderSummary(), 'VENDOR NAME', vendor.name)

    orderSummary(
      Object.assign(orderSummary(), {
        vendor: {
          name: vendor.name,
          merchantId: vendor.squareInfo.merchantId,
          locationIds: vendor.squareInfo.locationIds
        }
      })
    )
    if (order.vendor && vendor.name != order.vendor.name) {
      console.log('Order is not from the same vendor! ERROR')
      return // todo: add warning window.
    }
    console.log('merchant Id ', orderSummary().vendor.merchantId)
    console.log('vendor square info ', vendor.squareInfo)
    console.log('location Id ', orderSummary().vendor.locationIds[0])
    const itemName = product.name
    const itemDataSourceId = product.dataSourceId
    let variant

    if (document.querySelector('.variantSelect:checked') == null) {
      setRequiredFilled(false)
      return false
    }
    variant = JSON.parse(document.querySelector('.variantSelect:checked').value)
    const variantObject = variant.option
    const variantCost = variant.option.price.amount

    const modifierNames = []
    let modifierCost = 0
    const modifierLists = document.querySelectorAll('.modifierSelect:checked')
    
    // purpose of subList: to make modifierList match the structure of prodList
    const modList = []
    const prodList = product.modifierLists
    let i = 0, j = 0, subList = []
    
    // loops through product modifierLists once
    // traverses selected modifiers once at a separate pace
    while (i < prodList.length) {
      // case where subList would be pushed to modList
      if (j >= modifierLists.length || prodList[i].dataSourceId !== JSON.parse(modifierLists[j].value).option.parentListId) {
        modList.push(subList)
        subList = []
        i++
      }
      // case where subList would continue being built
      else {
        subList.push(JSON.parse(modifierLists[j].value).option)
        j++
      }
    }

    for (let i = 0; i < modifierLists.length; i++) {
      const currentModifier = JSON.parse(modifierLists[i].value).option
      const currentModifierName = currentModifier.name
      {
        currentModifier.price
          ? (modifierCost += currentModifier.price.amount)
          : (modifierCost += 0)
      }
      modifierNames.push(currentModifierName)
    }

    const itemQuantity = { quantity }.quantity
    const totalPrice = (modifierCost + variantCost) * 0.01
    

    // update modifiers validity flag, ignores check if min/max modifiers is null
    for (let i = 0; i < prodList.length; i++) {
      if ((prodList[i].minModifiers != null && modList[i].length < prodList[i].minModifiers) ||
      (prodList[i].maxModifiers != null && modList[i].length > prodList[i].maxModifiers)) {
        setRequiredFilled(false)
        return false
      }
    }

    // apply checks
    dispatch({
      type: 'ADD_ITEM',
      item: {
        name: itemName,
        Id: Date.now(),
        variant: variantObject,
        modifierLists: modList,
        quantity: itemQuantity,
        price: totalPrice,
        modDisplay: modifierNames,
        dataSourceId: itemDataSourceId
      }
    })
    setRequiredFilled(true)
    return true
  }

  return (
    <div>
      <BuyerHeader />
      <div className='container'>
        <img className='heroImage' src={product.image} alt={product.name} />

        <div className='itemHeading'>
          <h2>{product.name}</h2>
          <p>{product.description} <br></br> <text className='asterisk'> (* required) </text> </p>
          
        </div>
        <div className='variantsContainer'>
          <VariantSelection variants={product.variants} />
        </div>
        {product.modifierLists.length == 0 && null}
        <div className='modifiersContainer'>
          {product.modifierLists.map(modifier => {
            return (
              <ModifierSelection
                key={modifier.name}
                modifierCategory={modifier}
              />
            )
          })}
        </div>
        <div className='quantityContainer'>
          <QuantitySelector
            quantity={quantity}
            increase={increase}
            decrease={decrease}
          />
        </div>
        {!requiredFilled && (
          <div className='warningContainer'>
            Missing required selections!
          </div>
        )}
        <div className='submitContainer'>
          <button
            className='submitButton'
            onClick={() => {
              // Insert check here
              if (makeCartItem()) {
                navigate('/eat/cohen/cart')
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
      <BottomAppBar />
    </div>
  )
}

export default Product
