import SquareController from '../controllers/SquareController.js'
import { Vendor } from '../graphql/schema/index.js'

const squareControllers = await Vendor.find()
  .exec()
  .then(vendors =>
    vendors.map(
      vendor =>
        new SquareController(vendor.name, vendor.squareInfo.accessToken, false)
    )
  )

/**
 *
 * @param {string} vendorName
 * @returns
 */
const getSquare = vendorName =>
  squareControllers.filter(
    squareController => squareController.vendorName === vendorName
  )[0]

export default getSquare
