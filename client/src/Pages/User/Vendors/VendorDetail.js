import React, { useState, useContext, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useParams, useHistory, useLocation } from 'react-router';

const GET_VENDOR_PRODUCTS_QUERY = gql`
    query GET_VENDOR_PRODUCTS($slug: String!) {
        vendorOne(filter: { slug: $slug } ) {
            _id
            __typename
            products {
                _id
                __typename
                name
                price
            }
        }
    }
`

const ProductCard = ({ product }) => {
    const location = useLocation();
    const history = useHistory();

    const handleClick = () => {
        let path = location.pathname + "/products/" + product._id;
        return history.push(path);
    }
    
    return (
        <div onClick={handleClick}>
            <p>{product.name}</p>
        </div>
    )
}

const VendorDetail = ({ }) => {
    const { slug } = useParams();
    const history = useHistory();

    const { data, loading, error } = useQuery(
        GET_VENDOR_PRODUCTS_QUERY,
        { variables: { slug: slug } }
    ); 

    if (error) return <p>Errors...</p>;
    if (loading) return <p>Loading...</p>
    if (!data) return (<p>No data...</p>);

    const { products } = data.vendorOne;

    const handleClick = () => {
        history.push(`/user/vendors/${slug}/cart`);
    }

    return (
        <div>
            {products.map(product => {
                return (<ProductCard product={product} />);
            })}
            <button title="View Cart" onClick={handleClick}>Cart</button>
        </div>
    );
}

export default VendorDetail;
