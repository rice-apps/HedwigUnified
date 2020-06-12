import React, { useContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';

import "./vendor.css";

const GET_VENDORS_QUERY = gql`
    query VendorList {
        vendorMany {
            _id
            name
            slug
            type
            phone
            hours {
                day
                start
                end
            }
            locations {
                name
            }
            imageURL
        }
    }
`

const VendorCard = ({ vendor }) => {
    const history = useHistory();

    const handleClick = () => {
        // Go to this particular vendor's detail page
        return history.push(`/user/vendors/${vendor.slug}`);
    }

    return (
        <div style={{ backgroundImage: `url(${vendor.imageURL})` }} className="vendorcard" onClick={handleClick}>
            <h1>{vendor.name}</h1>
        </div>
    )
}

const VendorList = ({ }) => {
    const { data, loading, error } = useQuery(GET_VENDORS_QUERY);

    if (error) return <p>Error...</p>;
    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data...</p>;

    const vendors = data.vendorMany;

    return (
        <div className="vendorcontainer">
            <div className="vendorlist">
                {vendors.map(vendor => {
                    return (<VendorCard vendor={vendor} />)
                })}
            </div>
        </div>
    );
}

export default VendorList;
