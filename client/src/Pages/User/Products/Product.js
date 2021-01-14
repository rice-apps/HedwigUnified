import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import './product.css'
import { useNavigate, useLocation } from 'react-router-dom'
import dispatch from './FunctionalCart'
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
    const order = JSON.parse(localStorage.getItem('order'))

    localStorage.setItem('order',
      JSON.stringify(Object.assign(order, {
        vendor: {
          name: vendor.name,
          merchantId: vendor.squareInfo.merchantId,
          locationIds: vendor.squareInfo.locationIds
        }
      }))
    )
    if (order.vendor && vendor.name != order.vendor.name) {
      console.log('Order is not from the same vendor! ERROR')
      return // todo: add warning window.
    }
    console.log('merchant Id ', order.vendor.merchantId)
    console.log('vendor square info ', vendor.squareInfo)
    console.log('location Id ', order.vendor.locationIds[0])
    const itemName = product.name
    const itemDataSourceId = product.dataSourceId
    let variant

    if (document.querySelector('.variantSelect:checked') == null) {
      return false
    }
    variant = JSON.parse(document.querySelector('.variantSelect:checked').value)
    const variantObject = variant.option
    const variantCost = variant.option.price.amount

    const modifierNames = []
    let modifierCost = 0
    const modifierList = {}
    const modifierLists = document.querySelectorAll('.modifierSelect:checked')

    for (let i = 0; i < modifierLists.length; i++) {
      const currentModifier = JSON.parse(modifierLists[i].value)
      modifierList[i] = currentModifier.option
      const currentModifierName = currentModifier.option.name
      {
        currentModifier.option.price
          ? (modifierCost += currentModifier.option.price.amount)
          : (modifierCost += 0)
      }
      modifierNames.push(currentModifierName)
    }
    const itemQuantity = { quantity }.quantity
    const totalPrice = (modifierCost + variantCost) * 0.01

    dispatch({
      type: 'ADD_ITEM',
      item: {
        name: itemName,
        Id: Date.now(),
        variant: variantObject,
        modifierLists: modifierList,
        quantity: itemQuantity,
        price: totalPrice,
        modDisplay: modifierNames,
        dataSourceId: itemDataSourceId
      }
    })
    console.log(itemName, variantObject)
    return true
  }

  return (
    <div>
      <BuyerHeader />
      <div className='container'>
        <img className='heroImage' src={product.image ? product.image : "https://www.nippon.com/en/ncommon/contents/japan-data/169591/169591.jpg"} alt={product.name} />

        <div className='itemHeading'>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
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
        <div className='submitContainer'>
          <button
            className='submitButton'
            onClick={() => {
              makeCartItem()
              navigate('/eat/cohen/cart')
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
