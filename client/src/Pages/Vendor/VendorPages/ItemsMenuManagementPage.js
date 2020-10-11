import React from 'react'
import VendorsideTemplate from './../VendorComponents/VendorGridContainer.js'
import MenuCatalog from '../VendorComponents/MenuItemsComponents/MenuCatalog.js'
import { GET_CATALOG } from '../../../graphql/ProductQueries.js'
import { useQuery } from '@apollo/client'

function ItemsMenuManagementPage () {
  const {
    data: catalog_info,
    error: catalog_error,
    loading: catalog_loading
  } = useQuery(GET_CATALOG, {
    variables: {
      vendor: "East West Tea"
    }
  })

  if (catalog_loading) {
    return <p>Loading...</p>
  }
  if (catalog_error) {
    return <p>ErrorC...</p>
  }

  const { getCatalog: catalog } = catalog_info

  const compileCategories = data => {
        let categories = []
        data.forEach(product => {
          categories.push(product.category)
        })
        categories = new Set(categories)
        return [...categories]
      }

  const categories = compileCategories(catalog);

  return <VendorsideTemplate page={<MenuCatalog catalog={catalog} categories = {categories} category={categories[0]}/>}></VendorsideTemplate>
}

export default ItemsMenuManagementPage
