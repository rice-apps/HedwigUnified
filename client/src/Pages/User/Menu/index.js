import React, {useState} from 'react'
import hero from '../../../images/hero.jpg'
import boba from '../../../images/boba.jpg'
import './index.css'
import { Link, animateScroll as scroll } from 'react-scroll'
import { useNavigate, useLocation } from 'react-router-dom'
import { GET_CATALOG } from '../../../graphql/CatalogQueries.js'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries.js'
import { useQuery, gql } from '@apollo/client'


const vendor = {
  name: 'East West Tea',
  hours: 'Monday - Thursday 7:00 pm - 10:00 pm',
  location: "Sammy's Kitchen in Rice Memorial Center",
  categories: [
    'Special Offers',
    'Milk Tea',
    'Fruit Tea',
    'Snacks',
    'Burgers',
    'Salads',
    'Chicken'
  ],
  products: [
    {
      name: 'Nutty Bee Boba',
      category: 'Special Offers',
      price: '$3.50',
      image: boba
    },
    {
      name: 'Peach Black Tea',
      category: 'Fruit Tea',
      price: '$3.50',
      image: boba
    },
    {
      name: 'Strawberry Lemonade',
      category: 'Fruit Tea',
      price: '$3.50',
      image: boba
    },
    { name: 'Milk Tea', category: 'Milk Tea', price: '$3.50', image: boba },
    { name: 'Taro Tea', category: 'Milk Tea', price: '$3.50', image: boba },
    { name: 'Thai Tea', category: 'Milk Tea', price: '$3.50', image: boba },
    { name: 'Just Plain Boba', category: 'Snacks', price: '$.50', image: boba },
    {
      name: 'Honeydew Boba',
      category: 'Special Offers',
      price: '$3.50',
      image: boba
    },
    {
      name: 'Passionfruit Tea',
      category: 'Fruit Tea',
      price: '$3.50',
      image: boba
    },
    {
      name: 'Pink Lemonade',
      category: 'Fruit Tea',
      price: '$3.50',
      image: boba
    },
    { name: 'Green Tea', category: 'Milk Tea', price: '$3.50', image: boba },
    { name: 'Jasmine Tea', category: 'Milk Tea', price: '$3.50', image: boba },
    { name: 'Black Tea', category: 'Milk Tea', price: '$3.50', image: boba },
    { name: 'Goldfish', category: 'Snacks', price: '$1.50', image: boba },
    { name: 'Hamburger', category: 'Burgers', price: '$7.00', image: boba },
    { name: 'Cheeseburger', category: 'Burgers', price: '$7.50', image: boba },
    { name: 'Cobb Salad', category: 'Salads', price: '$7.50', image: boba },
    { name: 'Whole Chicken', category: 'Chicken', price: '$8.00', image: boba },
    {
      name: 'Chicken Nuggets',
      category: 'Chicken',
      price: '$6.00',
      image: boba
    }
  ]
}

//<Menu currentVendor = {"East West Tea"}/>
function Menu () {
  const navigate = useNavigate(); 
  const {state} = useLocation();
  const {currentVendor} = state;

  const { refetch, data : catalog_data, error : catalog_error, loading : catalog_loading } = useQuery(GET_CATALOG, {
    variables: {
      //dataSource: 'SQUARE',
      vendor: currentVendor
    },
  });

  //const catalog_data = vendor; 

  const {data: vendor_data, error: vendor_error, loading: vendor_loading } = useQuery(VENDOR_QUERY, {
    variables: {vendor: currentVendor},
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  }); 

  if (vendor_loading){
    return <p>Loading...</p>
  }
  if(vendor_error){
    return <p>ErrorV...</p>
  }
  //const vendor_data = vendor_info.getVendor; 
  if (catalog_loading){
    return <p>Loading...</p>
  }
  if(catalog_error){
    return <p>ErrorC...</p>
  }

  
  console.log("CURVENDOR", currentVendor);  
  console.log(vendor_data); 
  // Later in the code, we call sampleFunction(product.number)

  // sampleFunction
  // input: a number
  // output: number * 3
  const sampleFunction = price => {
    return price * 3
  }

  /**
   * Input: a product id
   * Output: Navigates to page with that product
   */
  const handleClick = productID => {
    // Go to this particular vendor's detail page
    return navigate(`${productID}`)
  }

  // we have to change these returns because vendor.name is outdated - brandon
  return (
    <div>
      {/* Hero Image */}
      <img src={hero} class='hero' alt='hero' />

      {/* Vendor Info */}
      <div class='vendorinfocontainer'>
        {/* Vendor Name */}
        <h1 class='vendortitle'> {vendor_data.name} </h1>
        {/* Vendor Operating Hours */}
        <p class='vendorinfo'>{vendor_data.hours}</p>
        <button class='readmore'> More Info </button>
      </div>

      {/* Category Select Bar */}
      <div class='categoryselect'>
        {catalog_data.categories.map(category => (
          // smooth scrolling feature
          <h1 class='categoryname'>
            <Link
              activeClass='categoryactive'
              to={category}
              smooth={true}
              spy={true}
              duration={500}
              offset={-20}
            >
              {category}
            </Link>
          </h1>
        ))}
      </div>

      {/* Products */}
      <div class='itemlist'>
        {/* Appending each category to the list */}
        {catalog_data.categories.map(category => (
          <div id={category}>
            {/* Giving each category a header */}
            <h3 class='categoryheader'>{category}</h3>
            {/*  Filtering out all items that fall under the category */}
            {catalog_data.products
              .filter(item => item.category === category)
              .map(product => (
                <div class='itemgrid' onClick={() => handleClick(product.name)}>
                  {/* Displaying the item: image, name, and price */}
                  <img src={product.image} class='itemimage' alt='boba' />
                  <h1 class='itemname'>{product.name}</h1>
                  <p class='itemprice'>{product.price}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
