import { gql, useQuery } from '@apollo/client'

// Catalog Mock Data
const vendor_catalog = [
  {catagory: 'sandwich', 
  name: 'chicken sandwich', 
  varients: [
    {regular: 3.50}, 
    {extra_chicken: 4.50}
    ]
  },
  {catagory: 'drink', 
  name: 'iced tea', 
  varients: [
    {name: 'regular', price: 1.50}, 
    {name: 'large', price: 2.75}
    ]
  }, 
]

// Finds the cheapest varient within an item
export const FIND_CHEAPEST_VARIENT = (item) => {
  let lowest_price = 0
  let lowest_price_varient = 'NaN'
  for (varient=0; varient < item.varients.length; varient++) {
    if (item.varients[varient][price] > lowest_price) {
      lowest_price = item.varients[varient][price]
      lowest_price_varient = item.varients[varient][name] 
    }
  }
return lowest_price, lowest_price_varient
}

// Finds all catagories within a catalog
export const FIND_CATEGORIES = (catalog) => {
  catagories = []
  for (item=0; item<catalog.length(); item++) {
    catagories.append(catalog[item].catagory)
  }
  return catagories
}

//GraphQL Query
export const ALL_MENU_ITEMS = gql`
  query ALL_MENU_ITEMS($item: String!) {
    getItem(dataSourceId: { _eq: $item }) {
      title
      catagory
      image
      variations
    }
  }
`

//Use useQuery to create a query response
const catalogResponse = useQuery(ALL_MENU_ITEMS, {
    variables: {
      vendor: 'TODO' /*TODO Add vendor name based on page here (Ask Will For Help)*/
    },
  })

//Creates a Catalog with a useQuery response passed in
export const getCatalog = (response) => {
  const catalog = []

  if (!response.loading && response.data && response.data.CatalogAll) {
    const catalog = response.data.CatalogAll[0]
    const { item } = catalog
    item.forEach(setElement => {
      catalog.push(setElement)
    })
  }
  return catalog
}

//Final catalog object
export const catalog = getCatalog(catalogResponse)

//catalog.map... Done by Alexis
