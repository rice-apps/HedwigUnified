import React from 'react';
import ClosedOrderDashboard from './../VendorComponents/ClosedOrderComponents/ClosedOrderDashboard.js'
import VendorsideTemplate from './../VendorComponents/VendorGridContainer.js'

function ClosedOrdersPage() {
  return <VendorsideTemplate page={<ClosedOrderDashboard />} />
}

export default ClosedOrdersPage
