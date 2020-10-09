import React from 'react'

import {
  AppBar,
  Grid,
  Toolbar,
  BottomNavigation,
  Divider
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDoorOpen,
  faDoorClosed,
  faUser,
  faShoppingCart,
  faReceipt
} from '@fortawesome/free-solid-svg-icons'

function BottomAppBar () {
  return (
    <AppBar position='sticky' color='white'>
      <BottomNavigation className='stickToBottom'>
        <Grid container>
          <Toolbar className='bottomBar'>
            <div>
              <FontAwesomeIcon
                className='barIconCart'
                icon={faShoppingCart}
                flexitem
              />
              <p className='iconText'>Cart</p>
            </div>
            <Divider orientation='vertical' flexItem />
            <div>
              <FontAwesomeIcon
                className='barIconReceipt'
                icon={faReceipt}
                flexItem
              />
              <p className='iconText'>Orders</p>
            </div>
          </Toolbar>
        </Grid>
      </BottomNavigation>
    </AppBar>
  )
}

export default BottomAppBar
