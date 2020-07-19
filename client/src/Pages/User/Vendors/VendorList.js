import React, { AppBar, ToolBar, Container, Fragment, useContext, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';

import "./vendor.css";
import "../../fonts/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
//fontawesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap'
import { graphqlSync } from 'graphql';


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

 
const NavTop = ({ }) => {
    return (
    <Navbar className="navtop" variant="light" bg="white" expand="lg">
        <NavDropdown title="Pickup Time: " class="nav-pickup">
            <NavDropdown.Item className="itemtext" href="#">As soon as possible</NavDropdown.Item>
            <NavDropdown.Item className="itemtext" href="#">Schedule an order</NavDropdown.Item>
        </NavDropdown>
        <FontAwesomeIcon class="user" icon={faUser} />
    </Navbar>
    )

}


const VendorCard = ({ vendor }) => {
    const history = useHistory();

    const handleClick = () => {
        // Go to this particular vendor's detail page
        return history.push(`/user/vendors/${vendor.slug}`);
    }

    return (
        <Fragment>
        <h2>{vendor.name}</h2>
        <p>{vendor.hours.start}</p>
        <FontAwesomeIcon class="door" icon={faDoorOpen} />
        <div style={{ backgroundImage: `url(${vendor.imageURL})` }} className="vendorcard" onClick={handleClick}>
        </div>
        </Fragment>

    )
}

const VendorLine = ( {} ) => {
        return (
            <div class="linebreak"> </div>
        ) 
    
}

class HeaderExclusion extends React.Component {
    screenOptions = {
        headerShown: false
    }
}

const VendorList = ({  }) => {
    const { data, loading, error } = useQuery(GET_VENDORS_QUERY);

    if (error) return <p>Error...</p>;
    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data...</p>;

    const vendors = data.vendorMany;

    return (
        <div className="vendorcontainer">
            <div className="vendorlist">
                <Fragment>
                <NavTop />
                </Fragment>
                {vendors.map(vendor => {
                    return (
                            <Fragment>
                            <VendorLine /> 
                            <VendorCard vendor={vendor} />
                            </Fragment>
                            )
                },
                <AppBar position="fixed">

                </AppBar>
                )}

            </div>
            </div>
    );
}

export default VendorList;
