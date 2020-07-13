import React, { useContext, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useHistory, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faDoorClosed } from "@fortawesome/free-solid-svg-icons";

import "./vendor.css";
import { PickupDropdown } from "../../../components/PickupDropdown";

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
`;

const VendorCard = ({ vendor }) => {
	const { name, hours, keywords, image, closed } = vendor;
	return (
		<div className="vendorContainer">
			<div className="vendorHeading">
				<div className="vendorHeadingText">
					<h2 className="vendorName">{name}</h2>
					<p className="vendorHours">Hours: {hours}</p>
				</div>
				<div className="vendorHoursIcon">
					{closed ? (
						<FontAwesomeIcon icon={faDoorClosed} />
					) : (
						<FontAwesomeIcon icon={faDoorOpen} />
					)}
				</div>
			</div>
			<div className="vendorImageContainer">
				{closed ? <p className="closedText">Closed.</p> : null}
				<img
					className={closed ? `vendorImage closed` : `vendorImage`}
					src={image}
				/>
			</div>
			<p className="vendorKeywords">{keywords.join(", ")}</p>
		</div>
	);
};

const VendorList = ({}) => {
    // const { data, loading, error } = useQuery(GET_VENDORS_QUERY);

	// if (error) return <p>Error...</p>;
	// if (loading) return <p>Loading...</p>;
	// if (!data) return <p>No data...</p>;

    // const vendors = data.vendorMany;
    
	const vendors = [
		{
			name: "East West Tea",
			hours: "7:00pm - 10:00pm",
			keywords: ["Boba Tea", "Snacks", "Vegan / Non-Dairy"],
			image:
				"https://images.squarespace-cdn.com/content/v1/58559451725e25a3d8206027/1486710333727-C3OXR7PA5G2YGEZHNK6R/ke17ZwdGBToddI8pDm48kCHChmuivJZ1Va5ov3ZJeg17gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0ouw-8l5B_J38LMU7OZFvYcSGirBhY_3j1yQtntvGS73bypqQ-qjSV5umPUlGbQFAw/DSC_0064.jpg?format=1500w",
			closed: false,
		},
		{
			name: "Coffeehouse",
			hours: "7:30am - 5:00pm",
			keywords: ["Coffee", "Snacks", "Decaf"],
			image:
				"https://lh5.googleusercontent.com/p/AF1QipNZ0aMBlyVAc6GXs1dVZTMOu6rn0I9G1ZBVJPJz",
			closed: true,
		},
		{
			name: "Grillosophy",
			hours: "7:00pm - 10:00pm",
			keywords: ["Hamburgers", "Sandwiches", "Milkshakes", "Agua Fresca"],
			image:
				"https://images.unsplash.com/photo-1522244451342-a41bf8a13d73?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
			closed: false,
		},
	];
	return (
		<div>
			<div className="pickup">
				Pickup Time:
				<PickupDropdown options={["ASAP", "7:45pm"]} selectedOption="ASAP" onChange={() => console.log("Meme")} />
			</div>
			<div>
				{vendors.map((vendor) => {
					return <VendorCard vendor={vendor} />;
				})}
			</div>
		</div>
	);
};

export default VendorList;
