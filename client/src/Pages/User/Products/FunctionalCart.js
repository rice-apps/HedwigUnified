import './product.css'
import { cartItems } from '../../../apollo'
import produce from 'immer'

// HOW TO CALL DISPATCH:
// dispatch({
//     type: 'ADD_TO_CART',
//     item:{
//
//         name: "Milk Tea",
//         Id: Date.now(),
//         variant: {name: "Medium", description: "blah", price: { amount: $3.50, currency: USD }, variantID: 246}
//         modifierList: {modifier: {name: "Boba", desciription: "Chewy bubbles in your drink!",
//                        price: {amount: $0.50, currency, USD}, modifierID: 345}
//         price: 3.50,
//         quantity: 1
//         }

//     }
// })

function dispatch (action) {
  const oldCart = cartItems()
  
  const newCart = produce(oldCart, draft => {
    switch (action.type) {
      case 'ADD_ITEM':
        draft.push(action.item)
        break
      case 'UPDATE_QUANTITY':
        let { quantity, Id } = action.item
        draft.forEach(item => {
          if (item.Id === Id) {
            item.quantity = quantity
          }
        })
        break
      case 'DELETE_ITEM':
        let { Id: id } = action.item
        draft.reduceRight((_, item, index, object) => {
          if (item.Id === id) {
            object.splice(index, 1)
          }
        }, [])
        break
    }
  })

  cartItems(newCart)

  return newCart
}

export default dispatch
