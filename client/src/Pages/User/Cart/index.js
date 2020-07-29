import React, { useConp, useEffect } from 'react';
import { useQuery, gql, useMutation, useApolloClient } from '@apollo/client';
import { useParams, useHistory } from 'react-router';

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

const PLACE_ORDER = gql`
    mutation PlaceOrder($_id: MongoID!) {
        orderUpdateOne(filter: { _id: $_id } , record: { fulfillment: Placed } ){
            record {
                _id
                __typename
                fulfillment
            }
        }
    }
`

const CartItem = ({ item }) => {
    const history = useHistory();
    const { slug, product } = useParams();
    const handleClick = () => {
        history.replace(`products/${item.product._id}`)
        console.log("Should navigate to product detail page!");
    }
    const handleDeleteClick = () => {
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
    const [placeOrder, { data: placeOrderData, loading: placeOrderLoading, error: placeOrderError } ] = useMutation(PLACE_ORDER);

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

    useEffect(() => {
        if (placeOrderData) {
            history.push("/user/orders");
        }
    }, [placeOrderData]);

    if (placeOrderLoading) return <p>Creating order...</p>;
    if (placeOrderError) return <p>Error while placing order...</p>;

    if (error) return <p>Errors...</p>;
    if (loading) return <p>Loading...</p>
    if (!data) return (<p>No data...</p>);

    const { _id, items, fulfillment } = data.findOrCreateCart;

    // let orderVariables = { userID: userID, vendorID: vendorID };

    const handleConfirmClick = () => {
        // Submit order
        placeOrder({ variables: { _id: _id } });

        // createOrder({ variables: {...orderVariables, items: transformToOrderItems(cart) }});
        // Then navigate back to order detail page
    }


    return (
        <div>
            <p>Cart Items Below:</p>
            {items.map(item => {
                return (<CartItem item={item} />)
            })}
            <button title={"Confirm"} onClick={handleConfirmClick}>Confirm Order</button>
        </div>
    );
}

export default CartDetail;
