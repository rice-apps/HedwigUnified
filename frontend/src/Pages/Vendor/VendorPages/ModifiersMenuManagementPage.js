import VendorsideTemplate from '../VendorComponents/VendorGridContainer.js'
import { GET_MODIFIER_LISTS } from '../../../graphql/ProductQueries.js'
import { useQuery } from '@apollo/client'
import ItemCatalog from '../VendorComponents/ItemsComponents/ItemCatalog.js'
import { LoadingPage } from './../../../components/LoadingComponents'

function ModifiersMenuManagementPage () {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const {
    data: modifierLists_info,
    error: modifierLists_error,
    loading: modifierLists_loading
  } = useQuery(GET_MODIFIER_LISTS, {
    variables: {
      vendor: currentUser.vendor
    }
  })

  if (modifierLists_loading) {
    return <LoadingPage />
  }
  if (modifierLists_error) {
    return <p>ErrorC...</p>
  }

  // const { getCatalog: catalog } = catalog_info
  const { getModifierLists: modifierLists } = modifierLists_info

  /*
  const compileCategories = data => {
    let categories = []
    data.forEach(product => {
      categories.push(product.category)
    })
    categories = new Set(categories)
    return [...categories]
  }

  const categories = compileCategories(catalog)
  */

  const compileCategories = data => {
    let categories = []
    data.forEach(modifierList => {
      categories.push(modifierList.name)
    })
    categories = new Set(categories)
    return [...categories]
  }

  const compileModifiers = data => {
    let modifiers = []
    data.forEach(modifierList => {
      modifierList.modifiers.forEach(modifier => {
        // construct modifier Info that matches ItemCatalog template
        const modifierInfo = {
          _typename: "Modifier",
          image: modifier.image,
          dataSourceId: modifier.dataSourceId,
          category: modifierList.name,
          name: modifier.name,
          variants: [{price: modifier.price}]
        }
        // modifier.category = modifier.name
        modifiers.push(modifierInfo)
      })
    })
    return [...modifiers]
  }


  const categories = compileCategories(modifierLists)
  const modifiers = compileModifiers(modifierLists)

  return <VendorsideTemplate
      page={
        <ItemCatalog
          catalog={modifiers}
          categories={categories}
          category={categories[0]}
        />
      }
    />
}

export default ModifiersMenuManagementPage
