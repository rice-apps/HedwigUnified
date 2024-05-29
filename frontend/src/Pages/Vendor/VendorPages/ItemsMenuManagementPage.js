import VendorsideTemplate from '../VendorComponents/VendorGridContainer.js'
import { GET_CATALOG } from '../../../graphql/ProductQueries.js'
import { useQuery } from '@apollo/client'
import ItemCatalog from '../VendorComponents/ItemsComponents/ItemCatalog.js'
import { LoadingPage } from './../../../components/LoadingComponents'

function ItemsMenuManagementPage () {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const {
    data: catalog_info,
    error: catalog_error,
    loading: catalog_loading
  } = useQuery(GET_CATALOG, {
    variables: {
      vendor: currentUser.vendor[0]
    }
  })

  if (catalog_loading) {
    return <LoadingPage />
  }
  if (catalog_error) {
    throw new Error("Error Detected!")
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

  const categories = compileCategories(catalog)

  return (
    <VendorsideTemplate
      page={
        <ItemCatalog
          catalog={catalog}
          categories={categories}
          category={categories[0]}
        />
      }
    />
  )
}

export default ItemsMenuManagementPage
