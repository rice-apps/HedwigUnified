import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import OrderItemList from './OrderItemList.js'
import TotalAndTax from './TotalAndTax.js'
import {
    CANCEL_ORDER
} from '../../../graphql/Queries.js'

const OrderDetail = ({ order }) => {
    const { _id, items, vendor, user, createdAt } = order
    const [modalOpen, setModalOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
  
    const openModal = () => setModalOpen(true)
    const closeModal = () => setModalOpen(false)
  
    const [cancelOrder] = useMutation(CANCEL_ORDER)
  
    const handleCancelOrder = () => {
      cancelOrder({ variables: { _id: _id } })
    }
  
    function detailsClick () {
      if (detailOpen) {
        setDetailOpen(false)
      } else {
        setDetailOpen(true)
      }
    }
  
    function DateFormatter ({ date }) {
      var formattedDate = String(date).split('-')
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      return (
        <p>
          {months[parseInt(formattedDate[1]) - 1]}{' '}
          {String(formattedDate[2]).substring(0, 2)}, {formattedDate[0]}
        </p>
      )
    }
  
    function vendorLogo (name) {
      if (name == 'East West Tea') {
        return '//static1.squarespace.com/static/58559451725e25a3d8206027/t/58559539f5e2315e3ef1127c/1593500228704/?format=1500w'
      }
      //CoffeeHouse
      //Grillosophy
    }
    return (
      <div className='ordercard'>
        <div className='orderText'>
          <img src={vendorLogo(vendor.name)} className='vendorLogo' />
          <div>
            <span id='vendorHeader'>
              <p id='vendorName'>
                <strong>{vendor.name}</strong>
              </p>
              <a className='pinkText vendorLink' href=''>
                Visit Store
              </a>
            </span>
            <p className='pinkText'>
              <strong>{order.fulfillment}</strong>
            </p>
            <p>
              <DateFormatter date={createdAt} />
            </p>
            <p className='pinkText' onClick={detailsClick}>
              Details
            </p>
          </div>
        </div>
  
        <div>
          <hr class='solid'></hr>
          <p>
            {detailOpen ? (
              <strong>
                <OrderItemList items={items} />
              </strong>
            ) : null}
          </p>
        </div>
  
        <span className='tax-total'>
          <p>
            <TotalAndTax items={items} />
          </p>
        </span>
  
        <hr class='solid'></hr>
  
        <span className='order_card_buttons'>
          <button className='order_card_button'>Reorder</button>
          <button className='order_card_button'>Need Help?</button>
        </span>
  
        {order.fulfillment == 'Placed' ? (
          <button onClick={handleCancelOrder}>Cancel Order</button>
        ) : null}
      </div>
    )
  }

export default OrderDetail