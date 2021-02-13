import VendorsideTemplate from '../VendorComponents/VendorGridContainer.js'
import { GET_MODIFIER_LISTS } from '../../../graphql/ProductQueries.js'
import { useQuery } from '@apollo/client'
import ModifierCatalog from '../VendorComponents/ItemsComponents/ModifierCatalog.js'
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
        modifiers.push(modifier)
      })
    })
    return [...modifiers]
  }

  const categories = compileCategories(modifierLists)
  const modifiers = compileModifiers(modifierLists)

  return <VendorsideTemplate
      page={
        <ModifierCatalog
          modifierLists={modifierLists}
          modifierListNames={categories}
          modifierListName={categories[0]}
          allModifiers={modifiers}
        />
      }
    />
}

export default ModifiersMenuManagementPage
