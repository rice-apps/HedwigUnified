import { useState, useRef, useEffect } from 'react'
import hero from '../../../images/hero.jpg'
import './index.css'
import { Link } from 'react-scroll'
import { useNavigate, useLocation } from 'react-router-dom'
import { GET_CATALOG } from '../../../graphql/ProductQueries.js'
import { VENDOR_QUERY } from '../../../graphql/VendorQueries.js'
import { useQuery } from '@apollo/client'
import BottomAppBar from '../Vendors/BottomAppBar.js'
import BuyerHeader from '../Vendors/BuyerHeader.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import { convertTimeToNum } from '../Vendors/VendorCard.js'
import { SmallLoadingPage } from './../../../components/LoadingComponents'
import ItemAddedModal from './ItemAdded'

// add a proceed to checkout
function Menu () {
  const [open, setOpen] = React.useState(false)
  const prevOpen = React.useRef(open)
  const anchorRef = useRef(null)
  const [] = useState(false)
  const navigate = useNavigate()
  const { state } = useLocation()
  const { currentVendor, slug, addedItem, addedImage } = state
  const {
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

  let menuBar
  let horizontalMenuItem
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }
    prevOpen.current = open
    const onScroll = () => {
      if (!menuBar) {
        menuBar = document.getElementById('horizontalmenu')
      } else {
        horizontalMenuItem = menuBar.querySelector('.categoryactive')
      }
      if (horizontalMenuItem) {
        menuBar.scrollLeft =
          horizontalMenuItem.offsetLeft - horizontalMenuItem.offsetHeight / 2
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  if (vendor_loading) {
    return <SmallLoadingPage />
  }
  if (vendor_error) {
    return <p>ErrorV...</p>
  }
  // const vendor_data = vendor_info.getVendor;
  if (catalog_loading) {
    return <SmallLoadingPage />
  }
  if (catalog_error) {
    console.log('CATALOG ERROR', catalog_error)
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
        currVendor: currentVendor,
        slug: slug
      }
    })
  }

  const current_date = new Date()

  const currentDay = current_date.getDay()
  // current day is an integer
  console.log(vendor_data.getVendor.hours[currentDay])
  const startTimes = vendor_data.getVendor.hours[currentDay].start
  console.log('start times: ' + startTimes)
  const endTimes = vendor_data.getVendor.hours[currentDay].end

  const times = []
  for (let i = 0; i < startTimes.length; i++) {
    times.push([startTimes[i], endTimes[i]])
  }

  const determineIfClosed = (current_date, dayObj) => {
    if (!dayObj) return
    else if (dayObj.isClosed === true) {
      return true
    } else {
      const currentTime =
        current_date.getHours() + current_date.getMinutes() / 60
      const startTimes = dayObj.start.map(startTime => {
        return convertTimeToNum(startTime)
      })
      const endTimes = dayObj.end.map(endTime => {
        return convertTimeToNum(endTime)
      })
      let isClosedHours = true
      for (let i = 0; i < startTimes.length; i++) {
        if (currentTime >= startTimes[i] && currentTime < endTimes[i]) {
          isClosedHours = false
        }
      }
      return isClosedHours
    }
  }

  const isClosed = determineIfClosed(
    current_date,
    vendor_data.getVendor.hours[currentDay]
  )

  // splash the hours
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown (event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // display start - end time of a specific day
  function dayDisplay (dayItem) {
    let start = dayItem.start
    let end = dayItem.end
    let time = start.map(function (e, i) {
      return [e, end[i]]
    })
    if (dayItem.start.length === 0) {
      return (
        <div className='dayHourRow'>
          <span className='dayInitial'>{dayItem.day.charAt(0)} </span>
          <span>Closed</span>{' '}
        </div>
      )
    } else {
      return (
        <div className='dayHourRow'>
          {' '}
          <span className='dayInitial'> {dayItem.day.charAt(0)} </span>
          <span className='hoursColumn'>
            {time.map(startend => {
              return (
                <div>
                  <span>
                    {startend[0].replace('.', '').replace('.', '')} -{' '}
                    {startend[1].replace('.', '').replace('.', '')}
                  </span>
                </div>
              )
            })}
          </span>
        </div>
      )
    }
  }

  // display day name and its hours
  function hourDisplay () {
    let hourItems = vendor_data.getVendor.hours
    return (
      <div>
        {console.log('HourItems', hourItems)}
        {hourItems.map(dayItem => {
          return <div>{dayDisplay(dayItem)}</div>
        })}
      </div>
    )
  }

  {
    /* {isClosed ? (
            <p class="vendorinfo">Closed for the Day</p>
          ) : (
            times.map(time => {
              return (
                <p class="vendorinfo">
                  {time[0]} - {time[1]}
                </p>
              );
            })
          )}
          <button class="readmore"> More Info </button> */
  }

  let dropdownTitle = (
    <div className='statusTitleWrapper'>
      <span className='openStatus'>
        {' '}
        {isClosed && 'CLOSED'} {!isClosed && 'OPEN'}{' '}
      </span>
      <div>
        {times.map(time => {
          return (
            <div class='vendorinfo'>
              {time[0].replace('.', '').replace('.', '')} -{' '}
              {time[1].replace('.', '').replace('.', '')}
            </div>
          )
        })}
      </div>
      <FontAwesomeIcon
        className='arrowIcon'
        icon={open ? faAngleUp : faAngleDown}
      />
    </div>
  )

  const horizontalMenu = categories.map(category => (
    // smooth scrolling feature
    <h1 class='categoryname' category={category}>
      <Link
        activeClass='categoryactive'
        style={{ textDecoration: 'none', color: 'black' }}
        to={category}
        smooth
        spy
        duration={500}
        offset={-20}
      >
        {category}
      </Link>
    </h1>
  ))

  // we have to change these returns because vendor.name is outdated - brandon
  return (
    <div style={{ position: 'relative' }}>
      {addedItem && <ItemAddedModal item={addedItem} itemImage={addedImage} />}
      <BuyerHeader showBackButton='true' backLink='/eat' />
      {addedItem && <div> hi </div>}
      <div
        style={{
          paddingBottom: '8.6vh',
          paddingTop: '8vh',
          position: 'relative'
        }}
      >
        {/* Hero Image */}
        <img src={vendor_data.getVendor.logoUrl} class='hero' alt='hero' />

        {/* Vendor Info */}
        <div class='vendorinfocontainer'>
          {/* Vendor Name */}
          <div class='vendortitle'> {vendor_data.getVendor.name} </div>

          {/* Vendor Operating Hours */}
          <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            style={{ backgroundColor: 'white' }}
            onClick={handleToggle}
            disableRipple
            className='anchorButton'
          >
            {dropdownTitle}
          </Button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement='top'
            role={undefined}
            transition
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id='menu-list-grow'
                    onKeyDown={handleListKeyDown}
                    className='hourDisplay'
                  >
                    <MenuItem
                      className='menuItem'
                      onClick={handleClose}
                      disableGutters
                    >
                      <div className='storeHourBox'>
                        {' '}
                        <div style={{ fontWeight: 'bold' }}>Hours</div>
                        {hourDisplay()}
                      </div>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Grow>
            )}
          </Popper>
        </div>

        {/* Category Select Bar */}
        <div class='categoryselect' id='horizontalmenu'>
          {horizontalMenu}
        </div>

        {/* Products */}
        <div class='itemlist' id='categorymenu'>
          {/* Appending each category to the list */}
          {categories.map(category => (
            <div
              id={category}
              // class='categorycontianer'
            >
              {/* Giving each category a header */}
              <div class='categoryheader'>{category}</div>
              {/*  Filtering out all items that fall under the category */}
              {catalog_data
                .filter(item => item.category === category && item.isAvailable)
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
                    <div class='itemcontainer'>
                      <h1 class='itemname'>{product.name}</h1>
                      <p class='itemprice'>
                        {formatter.format(
                          product.variants[0].price.amount / 100
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <BottomAppBar vendor={vendor_data.getVendor} />
    </div>
  )
}

export default Menu
