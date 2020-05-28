import React, { useContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, useHistory } from 'react-router';

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

const ProductDetail = ({ }) => {
    const { slug, product } = useParams();
    const history = useHistory();

    const { data, loading, error } = useQuery(
        GET_PRODUCT_DETAIL,
        { variables: { _id: product } }
    ); 

    if (error) return <p>Errors...</p>;
    if (loading) return <p>Loading...</p>
    if (!data) return (<p>No data...</p>);

    const { _id, name, description, price } = data.productOne;

    // We define
    // const orderItem = {
    //     product: product,
    //     addons: [],
    //     comments: ""
    // }

    const handleClick = () => {
        // dispatch({ type: ADD_TO_CART, vendorID: vendorID, item: orderItem });
        history.goBack();
    }

    return (
        <div>
            <p>Product Name: {name}</p>
            <button onClick={() => console.log("Add clicked!")}>Add to Cart</button>
            <button onClick={handleClick}>Go to Cart</button>
        </div>
    );
}

export default ProductDetail;
