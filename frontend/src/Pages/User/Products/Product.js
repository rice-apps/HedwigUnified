import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import './product.css'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import dispatch from './FunctionalCart'
import VariantSelection from './VariantSelection'
import QuantitySelector from './QuantitySelector'
import ModifierSelection from './ModifierSelection'
import { GET_ITEM } from '../../../graphql/ProductQueries'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries'
import BuyerHeader from '../Vendors/BuyerHeader.js'
import BottomAppBar, {
  Modal,
  ModalBackground,
  ModalMessage,
  StyledCancel
} from '../Vendors/BottomAppBar.js'
import { SmallLoadingPage } from './../../../components/LoadingComponents'

import { BiErrorCircle } from 'react-icons/bi'

function MakeDiffItemModal (props) {
  return (
    <ModalBackground>
      <Modal>
        <BiErrorCircle
          style={{
            fontSize: '13vh',
            color: '#F3725A',
            marginTop: '-4.7vh',
            marginBottom: '1.2vh',
            opacity: '0.77'
          }}
        />
        <ModalMessage>
          You can't add items from different vendors to the same cart!
        </ModalMessage>
        <StyledCancel onClick={() => props.changeModal(false)}>
          close
        </StyledCancel>
      </Modal>
    </ModalBackground>
  )
}

function Product () {
  const [showErrorModal, setShowErrorModal] = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()

  const productId = state?.currProduct;
  const currentVendor = state?.currentVendor;

  const {
    data: product_data,
    error: product_error,
    loading: product_loading
  } = useQuery(GET_ITEM, {
    skip: state === null,
    variables: {
      dataSourceId: productId,
      vendor: currentVendor
    }
  })
  // console.log(vnedorState, "CURRENT")

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    skip: state === null,
    variables: { vendor: currentVendor },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [quantity, setQuantity] = useState(1)
  const [requiredFilled, setRequiredFilled] = useState(true)

  console.log(productId)
  if (state === null) return <Navigate to='/eat' />
  if (vendor_loading) {
    return <SmallLoadingPage />
  }
  if (vendor_error) {
    return <p>ErrorV...{vendor_error.message}</p>
  }

  if (product_loading) {
    return <SmallLoadingPage />
  }
  if (product_error) {
    return <p>ErrorP...{product_error.message}</p>
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
    const cart_menu = JSON.parse(localStorage.getItem('cartItems'))
    const order = JSON.parse(localStorage.getItem('order'))

    if (Object.keys(order.vendor).length != 0) {
      if (cart_menu.length === 0) {
        console.log('SUCCESS')
      } else if (vendor.name != order.vendor.name) {
        setShowErrorModal(true)
        return
      } // todo: add warning window.
    }

    localStorage.setItem(
      'order',
      JSON.stringify(
        Object.assign(order, {
          vendor: {
            name: vendor.name,
            merchantId: vendor.squareInfo.merchantId,
            locationIds: vendor.squareInfo.locationIds
          }
        })
      )
    )

    console.log('merchant Id ', order.vendor.merchantId)
    console.log('vendor square info ', vendor.squareInfo)
    console.log('location Id ', order.vendor.locationIds[0])
    const itemName = product.name
    const image = product.image
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
    let i = 0
    let j = 0
    let subList = []

    // loops through product modifierLists once
    // traverses selected modifiers once at a separate pace
    while (i < prodList.length) {
      // case where subList would be pushed to modList
      if (
        j >= modifierLists.length ||
        prodList[i].dataSourceId !==
          JSON.parse(modifierLists[j].value).option.parentListId
      ) {
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
      if (
        (prodList[i].minModifiers != null &&
          modList[i].length < prodList[i].minModifiers) ||
        (prodList[i].maxModifiers != null &&
          prodList[i].maxModifiers !== -1 &&
          modList[i].length > prodList[i].maxModifiers)
      ) {
        setRequiredFilled(false)
        return false
      }
    }
    // converts modList into an object
    let x = 0
    let y = 0
    const modObject = {}

    while (x < modList.length) {
      if (modList[x].length === 0) {
        x++
      } else {
        for (let j = 0; j < modList[x].length; j++) {
          modObject[y] = modList[x][j]
          y++
        }
        x++
      }
    }

    dispatch({
      type: 'ADD_ITEM',
      item: {
        name: itemName,
        Id: Date.now(),
        variant: variantObject,
        modifierLists: modObject,
        quantity: itemQuantity,
        price: totalPrice,
        modDisplay: modifierNames,
        dataSourceId: itemDataSourceId,
        image: image
      }
    })

    setRequiredFilled(true)
    return true
  }

  return (
    <div>
      <BuyerHeader
        showBackButton
        backLink={`/eat/${vendor.slug}`}
        state={{ currentVendor: vendor.name }}
      />
      <div className='container'>
        <img className='heroImage' src={product.image} alt={product.name} />

        <div className='itemHeading'>
          <h2>{product.name}</h2>
          <p>
            {product.description} <br />
            <span className='asterisk'> (* required) </span>
          </p>
        </div>
        <div className='variantsContainer'>
          <VariantSelection variants={product.variants} />
        </div>
        {product.modifierLists.length === 0 && null}
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
          <div className='warningContainer'>Missing required selections!</div>
        )}
        <div className='submitContainer'>
          <button
            className='submitButton'
            onClick={() => {
              if (makeCartItem()) {
                navigate(`/eat/${vendor.slug}`, {
                  state: {
                    currentVendor: vendor.name,
                    addedItem: product.name,
                    addedImage: product.image
                  }
                })
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <BottomAppBar />
      {showErrorModal && <MakeDiffItemModal changeModal={setShowErrorModal} />}
    </div>
  )
}

export default Product
