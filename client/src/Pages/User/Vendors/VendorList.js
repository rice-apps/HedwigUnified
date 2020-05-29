import React, { useContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';

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
        <div onClick={handleClick}>
            <p>{vendor.name}</p>
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
        <div>
            {vendors.map(vendor => {
                return (<VendorCard vendor={vendor} />)
            })}
        </div>
    );
}

export default VendorList;
