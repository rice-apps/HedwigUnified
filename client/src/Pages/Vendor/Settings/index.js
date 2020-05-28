import React, { Fragment } from "react";
import { useQuery, gql } from '@apollo/client';

const VENDOR_QUERY = gql`
    {
        vendorOne(filter:{ name:"East-West Tea"}) {
            _id
            name
            phone
            hours {
                start
                end
                day
            }
            locations {
                name
            }
            team {
                name
                netid
                phone
            }
        }
    }
`;

const PRODUCTS_QUERY = gql`
    query Products($vendorID:MongoID!) {
        productMany(filter: { vendor: $vendorID }) {
            name
            description
            type
            category
            price
        }
    }
`

const ADD_VENDOR_HOURS = gql`
    mutation AddHourSet($id: ID!, $start: Int!, $end: Int!, $day: EnumVendorsHoursDay) {
        vendorAddHourSet(id:$id, start:$start, end:$end, day:$day) {
            name
            hours {
                start
                end
                day
            }
        }
    }
`

const REMOVE_VENDOR_HOURS = gql`
    mutation RemoveHourSet($id: ID!, $start: Int!, $end: Int!, $day: EnumVendorsHoursDay) {
        vendorRemoveHourSet(id:$id, start:$start, end:$end, day:$day) {
            name
            hours {
                start
                end
                day
            }
        }
    }
`

const VendorSettings = () => {
    let vendorID = "5ebcc4a6a55cea938d503174";
    const { loading, error, data } = useQuery(VENDOR_QUERY);
    // const { loading, error, data } = useQuery(PRODUCTS_QUERY);

    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error :(</p>);
    if (!data) return (<p>No Data...</p>);

    console.log(data);
    
    return (
        <Fragment>
            Vendor: {data.vendorOne.name}
            <h3>Product List</h3>
            
        </Fragment>
    )
}

export default VendorSettings;