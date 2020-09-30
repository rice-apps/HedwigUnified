import React from 'react'
import VendorsideTemplate from './../VendorComponents/VendorGridContainer.js'
import OrderDashboard from './../VendorComponents/OpenOrderComponents/OrderDashboard.js'

function OpenOrdersPage () {
  return <VendorsideTemplate page={<OrderDashboard />}></VendorsideTemplate>
}

export default OpenOrdersPage
