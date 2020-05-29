import React, { useContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';

const GET_USER_CARTS = gql`
    query UserCarts {
        userOne {
            carts {
                vendor {
                    slug
                }
                items {
                    _id
                    product {
                        _id
                        name
                    }
                    quantity
                    comments
                }
            }
        }
    }    
`

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
    const location = useLocation();

    const handleClick = () => {
        // Go to this particular vendor's detail page
        let path = location.pathname + "/" + vendor.slug;
        // Change page
        return history.push(path);
        // navigation.navigate('VendorDetail', { vendor: vendor });
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
