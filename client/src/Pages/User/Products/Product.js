import { useContext, useEffect, useState } from 'react'
import { useQuery, makeVar } from '@apollo/client'
import './product.css'
import { useNavigate, useLocation } from 'react-router-dom'

import dispatch from './FunctionalCart'
import { createMuiTheme } from '@material-ui/core'
import { cartItems } from '../../../apollo'
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
    refetch,
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

  console.log(product_data)

  const { getItem: product } = product_data
  const { getVendor: vendor } = vendor_data
  const handleClick = () => {
    return navigate(`/eat/${vendor.slug}/cart`)
  }

  const increase = () => {
    setQuantity(quantity + 1)
  }

  const decrease = () => {
    setQuantity(quantity - 1)
  }

  /*
  const product = {
    name: "Milk Tea",
    description:
      "A refreshing blend of tea and milk. You can choose to added fresh and chewy bobas for an adventurous taste.",
    squareID: 123456787,
    variants: [
      {
        question: "Select your size",
        options: [
          {
            name: "Medium (16oz)",
            description: "Medium-Sized Drink",
            variantID: "123",
            price: { amount: 3.5, currency: "USD" }
          },
          {
            name: "Large (20oz)",
            description: "Large-Sized Drink",
            variantID: "246",
            price: { amount: 4.0, currency: "USD" }
          }
        ]
      }
    ],
    modifierLists: [
      {
        question: "Pick your free topping",
        description: "One included for free!",
        multiSelect: false,
        options: [
          {
            name: "Oreo",
            description: "Oreo cookie crubles",
            variantID: "123"
          },
          {
            name: "Lychee Jelly",
            description: "Bite-sized lychee jelly pieces",
            variantID: "123"
          },
          {
            name: "Tapioca Pearls (Boba)",
            description: "Fun, chewy balls",
            variantID: "123"
          }
        ]
      },

      {
        question: "Pick your additional topping(s)",
        description: "$0.50 for each additional topping.",
        multiSelect: true,
        options: [
          {
            name: "Oreo",
            description: "Oreo cookie crubles",
            variantID: "123",
            price: { amount: 0.5, currency: "USD" }
          },
          {
            name: "Lychee Jelly",
            description: "Bite-sized lychee jelly pieces",
            variantID: "123",
            price: { amount: 0.5, currency: "USD" }
          },
          {
            name: "Tapioca Pearls (Boba)",
            description: "Fun, chewy balls",
            variantID: "123",
            price: { amount: 0.5, currency: "USD" }
          },
          {
            name: "No additional topping",
            description: "None",
            variantID: "123"
          }
        ]
      },

      {
        question: "Choose your ice level",
        description: "",
        multiSelect: false,
        options: [
          { name: "No Ice", description: "No ice at all", variantID: "123" },
          { name: "Light Ice", description: "75% ice", variantID: "123" },
          { name: "Regular Ice", description: "100% ice", variantID: "123" },
          { name: "More Ice", description: "125% ice", variantID: "123" }
        ]
      },
      {
        question: "Choose your sugar level",
        description: "",
        multiSelect: false,
        options: [
          { name: "0% Sugar", description: "No Sugar", variantID: "123" },
          { name: "25% Sugar", description: "Light Sugar", variantID: "123" },
          { name: "50% Sugar", description: "Half Sugar", variantID: "123" },
          { name: "75% Sugar", description: "Less Sugar", variantID: "123" },
          { name: "100% Sugar", description: "Normal Sugar", variantID: "123" }
        ]
      }
    ]
  };
  */

  function makeCartItem () {
    const itemName = product.name
    const itemID = product.squareID
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
    return true
  }

  return (
    <div>
      <BuyerHeader />
      <div className='container'>
        <img className='heroImage' src={product.image} alt={product.name} />

        <div className='itemHeading'>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
        <div className='variantsContainer'>
          <VariantSelection variants={product.variants} />
        </div>
        {product.modifierLists.length == 0 && (
          <p>Sorry! no modifiers in the database</p>
        )}
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
