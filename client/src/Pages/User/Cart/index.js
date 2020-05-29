import React, { useConp, useEffect } from 'react';
import { useQuery, gql, useMutation, useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router';

const FIND_OR_CREATE_CART = gql`
    mutation FindOrCreateCart($vendorID:MongoID!){
        findOrCreateCart(record:{vendor:$vendorID}) {
            _id
            __typename
            items {
                product {
                    _id
                    name
                }
                quantity
                comments
            }
            fulfillment
        }
    }
`

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

const CREATE_CART_MUTATION = gql`
    mutation CreateCart($userID:MongoID!, $vendorID:MongoID!) {
        orderCreateOne(record:{user:$userID, vendor:$vendorID}) {
            record {
                _id
            }
            recordId
        }
    }
`

const GET_CART = gql`
    query GetCart {
        cart @client {
            vendor @client {
                name
                items {
                    product {
                        _id 
                        price
                    }
                    quantity
                    comments
                }
            }
        }
    }
`

const CartItem = ({ item }) => {

    const handleClick = () => {
        console.log("Should navigate to product detail page!");
    }

    return (
        <div onClick={handleClick}>
            <p>Name: {item.product.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>End.</p>
        </div>
    )
}

const CartDetail = ({ }) => {
    const history = useHistory();

    const [findOrCreateCart, { data, loading, error } ] = useMutation(FIND_OR_CREATE_CART);

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

    useEffect(() => {
        let vendorID = "5ecf473841ccf22523280c3b";
        findOrCreateCart({ variables: { vendorID: vendorID } });
    }, []);

    if (error) return <p>Errors...</p>;
    if (loading) return <p>Loading...</p>
    if (!data) return (<p>No data...</p>);

    const { items, fulfillment } = data.findOrCreateCart;

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
            {items.map(item => {
                return (<CartItem item={item} />)
            })}
            <button title={"Confirm"} onPress={handleClick}>Confirm Order</button>
        </div>
    );
}

export default CartDetail;
