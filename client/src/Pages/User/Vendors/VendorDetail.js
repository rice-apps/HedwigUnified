import React, { useState, useContext, useEffect } from 'react'
import { useQuery, gql, useMutation, ApolloError } from '@apollo/client'
import { useParams, useHistory, useLocation } from 'react-router'
import ErrorPage from '../../../components/ErrorPage'

const GET_VENDOR_PRODUCTS_QUERY = gql`
  query GET_VENDOR_PRODUCTS($slug: String!) {
    vendorOne(filter: { slug: $slug }) {
      _id
      __typename
      products {
        _id
        __typename
        name
        price
      }
    }
  }
`

function ProductCard ({ product, slug }) {
  const history = useHistory()

  const handleClick = () => {
    return history.push(`/user/vendors/${slug}/products/${product._id}`)
  }

  return (
    <div className='productdetail' onClick={handleClick}>
      <p>{product.name}</p>
    </div>
  )
}

function VendorDetail () {
  const { slug } = useParams()
  const history = useHistory()

  const { data, loading, error } = useQuery(GET_VENDOR_PRODUCTS_QUERY, {
    variables: { slug: slug }
  })

  if (error) return <ErrorPage errMessage={error.message} />
  if (loading) return <p>Loading...</p>
  if (!data) return <p>No data...</p>

  const { products } = data.vendorOne

  const handleClick = () => {
    history.push(`/user/vendors/${slug}/cart`)
  }

  return (
    <div className='productlist'>
      {products.map(product => {
        return <ProductCard product={product} slug={slug} />
      })}
      <button title='View Cart' onClick={handleClick}>
        Cart
      </button>
      <button title='Go Back' onClick={() => history.goBack()}>
        Go Back
      </button>
    </div>
  )
}

export default VendorDetail
