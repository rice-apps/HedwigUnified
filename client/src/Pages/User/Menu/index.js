import { useState } from 'react'
import hero from '../../../images/hero.jpg'
import boba from '../../../images/boba.jpg'
import './index.css'
import { Link, animateScroll as scroll } from 'react-scroll'
import { useNavigate, useLocation } from 'react-router-dom'
import { GET_CATALOG } from '../../../graphql/ProductQueries.js'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries.js'
import { useQuery, gql } from '@apollo/client'
import BottomAppBar from './../Vendors/BottomAppBar.js'
import { Hidden } from '@material-ui/core'
import BuyerHeader from './../Vendors/BuyerHeader.js'
import { Dropdown, DropdownButton } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

/*
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
*/
// <Menu currentVendor = {"East West Tea"}/>

// add a proceed to checkout
function Menu () {
  const [arrowState, setArrowState] = useState(false);
  const navigate = useNavigate()
  const { state } = useLocation()
  const { currentVendor } = state
  const {
    refetch,
    data: catalog_info,
    error: catalog_error,
    loading: catalog_loading
  } = useQuery(GET_CATALOG, {
    variables: {
      // dataSource: 'SQUARE',
      vendor: currentVendor
    }
  })

  // const catalog_data = vendor;

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: currentVendor },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  if (vendor_loading) {
    return <p>Loading...</p>
  }
  if (vendor_error) {
    return <p>ErrorV...</p>
  }
  // const vendor_data = vendor_info.getVendor;
  if (catalog_loading) {
    return <p>Loading...</p>
  }
  if (catalog_error) {
    console.log(catalog_error)
    return <p>ErrorC...</p>
  }

  const { getCatalog: catalog_data } = catalog_info
  // Later in the code, we call sampleFunction(product.number)

  // sampleFunction
  // input: a number
  // output: number * 3
  const compileCategories = data => {
    let categories = []
    data.forEach(product => {
      categories.push(product.category)
    })
    categories = new Set(categories)
    return [...categories]
  }

  const categories = compileCategories(catalog_data)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'

    // These options are needed to round to whole numbers if that's what you want.
    // minimumFractionDigits: 0,
    // maximumFractionDigits: 0,
  })

  formatter.format(2500)

  /**
   * Input: a product id
   * Output: Navigates to page with that product
   */
  const handleClick = product => {
    // Go to this particular vendor's detail page
    return navigate(`${product.name}`, {
      state: {
        currProduct: `${product.dataSourceId}`,
        currVendor: currentVendor
      }
    })
  }

  const current_date = new Date()

  const currentDay = current_date.getDay()
  // current day is an integer

  const startTimes = vendor_data.getVendor.hours[currentDay].start
  const endTimes = vendor_data.getVendor.hours[currentDay].end

  const times = []
  for (let i = 0; i < startTimes.length; i++) {
    times.push([startTimes[i], endTimes[i]])
  }
  const isClosed = vendor_data.getVendor.hours[currentDay].isClosed

  // splash the hours

  // display start - end time of a specific day
  function dayDisplay(dayItem){
    let start = dayItem.start;
    let end = dayItem.end;
    let time = start.map(function(e, i) {return [e, end[i]];});
    if(dayItem.start.length === 0){
      return(<div className="dayHourRow"><span className="dayInitial">{dayItem.day.charAt(0)} </span><span>Closed</span>  </div>)
    }else{
      return(
        <div className="dayHourRow" > <span className="dayInitial"> {dayItem.day.charAt(0)} </span>
          <span className="hoursColumn">{time.map(startend => {
        return(<div><span>{startend[0].replace(".","").replace(".","")} - {startend[1].replace(".","").replace(".","")}</span></div>)})}</span>
        </div>
      )
    }
  }
  // toggle arrow to display
  function handleClickArrow(){
    setArrowState(!arrowState);
  }

  // display day name and its hours
  function hourDisplay(){
    let hourItems = vendor_data.getVendor.hours;
    return(
      <div >
        {hourItems.map(dayItem => {
        return(
          <div >
          {dayDisplay(dayItem)}</div>)}
        )}
      </div>
      )}
  let dropdownTitle = isClosed ? (<div><span className='openStatus'>Closed </span>{times[0][0].replace(".","").replace(".","")} - {times[1][0].replace(".","").replace(".","")} 
  <FontAwesomeIcon className="arrowIcon" icon={arrowState? faAngleDown:faAngleUp} /></div>) : (
    (<span ><span className='openStatus'>Open</span>{times[0][0].replace(".","").replace(".","")} - {times[1][0].replace(".","").replace(".","")} 
  <FontAwesomeIcon className="arrowIcon"  icon={arrowState? faAngleDown:faAngleUp} /></span>)
  )




  // we have to change these returns because vendor.name is outdated - brandon
  return (
    <div>
      <BuyerHeader />
      <div style={{ paddingBottom: '10vh' }}>
        {/* Hero Image */}
        <img
          style={{ filter: 'blur(2.5px)' }}
          src={hero}
          class='hero'
          alt='hero'
        />

        {/* Vendor Info */}
        <div class='vendorinfocontainer'>
          {/* Vendor Name */}
          <h1 class='vendortitle'> {vendor_data.getVendor.name} </h1>
          {/* Vendor Operating Hours */}
          <DropdownButton size="sm" title={dropdownTitle}  onClick={handleClickArrow} >
          <Dropdown.Header>
            <div className="storeHourBox">
              <div style={{fontWeight:"bold"}}>Hours</div>
              {hourDisplay()}</div>
            </Dropdown.Header>
          </DropdownButton>

          <button class='readmore'> More Info </button>
        </div>

        {/* Category Select Bar */}
        <div class='categoryselect'>
          {categories.map(category => (
            // smooth scrolling feature
            <h1 class='categoryname'>
              <Link
                activeClass='categoryactive'
                to={category}
                smooth
                spy
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
          {categories.map(category => (
            <div id={category}>
              {/* Giving each category a header */}
              <h3 class='categoryheader'>{category}</h3>
              {/*  Filtering out all items that fall under the category */}
              {catalog_data
                .filter(item => item.category === category)
                .map(product => (
                  <div
                    class='itemgrid'
                    onClick={
                      product.isAvailable ? () => handleClick(product) : null
                    }
                  >
                    {/* Displaying the item: image, name, and price */}
                    <img
                      src={product.image}
                      class='itemimage'
                      alt={product.name}
                    />
                    <h1 class='itemname'>{product.name}</h1>
                    <p class='itemprice'>
                      {product.isAvailable
                        ? formatter.format(
                            product.variants[0].price.amount / 100
                          ) + '+'
                        : 'Unavailable'}
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <BottomAppBar />
    </div>
  )
}

export default Menu
