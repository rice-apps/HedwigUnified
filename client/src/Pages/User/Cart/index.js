import React, { useConp, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';

const CREATE_ORDER_MUTATION = gql`
    mutation CreateOrder($userID:MongoID!, $vendorID:MongoID!, $items:[OrdersItemsInput] ) {
        orderCreateOne(record:{user:$userID, vendor:$vendorID, items:$items}) {
            record {
                _id
                createdAt
                items {
                    product {
                        name
                    }   
                    comments
                }
            }
            recordId
        }
    }
`

const CartItem = ({ }) => {

    const handleClick = () => {
        console.log("Should navigate to product detail page!");
    }

    return (
        <div onClick={handleClick}>
            <p>Meme</p>
            <p>Lmao</p>
        </div>
    )
}

const CartDetail = ({ }) => {
    const history = useHistory();

    // Move this to a utils folder
    const transformToOrderItems = (cart) => {
        return cart.map(item => {
            return {
                product: item.product._id,
                addons: item.addons.map(addon => addon._id),
                quantity: 1,
                comments: item.comments
            }
        });
    }

    const [createOrder, { data, loading, error }] = useMutation(CREATE_ORDER_MUTATION);

    // let orderVariables = { userID: userID, vendorID: vendorID };

    const handleClick = () => {
        // Submit order
        // createOrder({ variables: {...orderVariables, items: transformToOrderItems(cart) }});
        // Then navigate back to order detail page
        history.push("/login"); 
    }
    
    return (
        <div>
            <p>Cart Items Below:</p>
            <button title={"Confirm"} onPress={handleClick}>Confirm Order</button>
        </div>
    );
}

export default CartDetail;
