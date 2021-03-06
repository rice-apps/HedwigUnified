import VendorsideTemplate from '../VendorComponents/VendorGridContainer.js'
import OrderDashboard from '../VendorComponents/OpenOrderComponents/OrderDashboard.js'

function OpenOrdersPage () {
  return <VendorsideTemplate page={<OrderDashboard />} />
}

export default OpenOrdersPage
