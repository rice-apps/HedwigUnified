import React, { useContext, useEffect, useState } from 'react';
import { useQuery, gql, useMutation, useApolloClient } from '@apollo/client';
import { useParams, useHistory } from 'react-router';
import omitDeep from 'omit-deep-lodash';

const GET_PRODUCT_DETAIL = gql`
    query GetProduct($_id:MongoID!){
        productOne(filter:{_id:$_id}){
            _id
            __typename
            name
            type
            description
            price
            category
        }
    }
`;

const FIND_OR_CREATE_CART = gql`
    mutation FindOrCreateCart($vendorID:MongoID!){
        findOrCreateCart(record:{vendor:$vendorID}) {
            _id
            __typename
            items {
                product {
                    _id
                }
                quantity
                comments
            }
            fulfillment
        }
    }
`

const ADD_ITEM_TO_CART = gql`
    mutation AddItem($_id:ID!, $item:OrdersItemsInput){
        orderAddItem(_id:$_id, item:$item){
            _id
            __typename
            fulfillment
            items {
                _id
                __typename
                product {
                    _id
                }
                quantity
                comments
            }
        }
    }
`

const REMOVE_ITEM_FROM_CART = gql`
    mutation RemoveItem($_id:ID!, $item:OrdersItemsInput){
        orderRemoveItem(_id:$_id, item:$item){
            _id
            __typename
            items {
                _id
                __typename
                product {
                    _id
                }
                quantity
                comments
            }
        }
    }
`

const ProductDetail = ({ }) => {
    const { slug, product } = useParams();
    const history = useHistory();

    let userID = "";
    let vendorID = "5ecf473841ccf22523280c3b";

    // We'll use this hook to initialize our cart when we want to create an order
    const [findOrCreateCart, { data: cartData, loading: cartLoading, error: cartError }] = useMutation(
        FIND_OR_CREATE_CART,
        { variables: { vendorID: vendorID } }
    );

    const { data: productData, loading: productLoading, error: productError } = useQuery(
        GET_PRODUCT_DETAIL,
        { variables: { _id: product } }
    ); 

    const [addItemToCart, ] = useMutation(
        ADD_ITEM_TO_CART,
    );

    const [removeItemFromCart, ] = useMutation(
        REMOVE_ITEM_FROM_CART,
    );

    useEffect(() => {
        // We need to get the cart for this vendor, or create it if it doesn't already exist
        findOrCreateCart();
    }, []);

    if (productError || cartError) return <p>Errors...</p>;
    if (productLoading || cartLoading) return <p>Loading...</p>
    if (!productData || !cartData) return (<p>No data...</p>);

    const { _id: productID, name, description, price } = productData.productOne;
    const { _id: cartID, items, fulfillment } = cartData.findOrCreateCart;

    // Check if this product is already in the cart
    let item;
    let _filteredItems = items.filter(item => item.product._id == productID);
    if (_filteredItems.length > 0) {
        item = _filteredItems[0];
        // Flatten product field
        item.product = item.product._id;
    } else {
        item = {
            product: productID,
            quantity: 1,
            comments: ""
        };
    }

    const handleAddToCart = () => {
        // This is necessary because __typename cannot be a field on the item when it is passed to the backend
        let itemForMutation = omitDeep(item, "__typename");
        addItemToCart({ variables: { _id: cartID, item: itemForMutation } });
    };

    const handleRemoveFromCart = () => {
        let itemForMutation = omitDeep(item, "__typename");
        removeItemFromCart({ variables: { _id: cartID, item: itemForMutation } });
    };

    return (
        <div>
            <p>Product Name: {name}</p>
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleRemoveFromCart}>Remove from Cart</button>
            <button onClick={() => history.push(`/user/vendors/${slug}/cart`)}>Go to Cart</button>
        </div>
    );
}

export default ProductDetail;
