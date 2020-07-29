import React from "react";
import styled from "styled-components";
import { SERVICE_URL } from "../../config";
import { useHistory } from "react-router";
import illustration from "../../assets/coffee_cup.svg";
import { gql, useQuery, useMutation } from "@apollo/client";

/**
 * This simply fetches from our cache whether a recent update has occurred
 */
const GET_USER_INFO = gql`
	query GetUserInfo {
		user @client {
			_id
			recentUpdate
			firstName
			lastName
			netid
			phone
		}
	}
`;
// const { user } = client.readQuery(GET_USER_INFO);

// const FirstNameQuery = () => {
//     const { loading, error, data } = useQuery(GET_USER_INFO);

//     if (loading) {
//       return <div>Loading...</div>;
//     }
//     if (error) {
//       return <div>ERROR: {error.message}</div>;
//     }
//     return <span> ,{data.user.firstName} </span>;
//   };

const MainDiv = styled.div`
	height: 100vh;
	width: 100vw;
	position: center;
	background-color: white;
	max-width: 100%;
	font-family: Avenir;
	color: #ed533d;
	display: grid;
	grid-template-rows: 20% 12% 68%;
	grid-template-columns: 100%;
	justify-items: center;
	justify-content: center;
`;

const Title = styled.p`
	font-family: "Raleway", sans-serif;
	grid-row: 1/2;
	font-size: 8vh;
	display: block;
	align-self: end;
	margin-block-start: 0;
	margin-block-end: 0;
	font-weight: 600;
`;

const Greeting = styled.p`
	grid-row: 2/3;
	font-size: 3vh;
	font-weight: regular;
	margin-block-start: 0;
	margin-block-end: 0;
	margin-left: 1em;
	margin-right: 1em;
	align-self: center;
`;

const Paragraph = styled.p`
	font-size: 2.5vh;
	font-weight: regular;
	line-height: 1.5;
	margin-block-start: 0;
	margin-block-end: 0;
	margin-left: 1.5em;
	margin-right: 1.5em;
	align-self: start;
	justify-self: center;
	text-align: start;
	grid-row: 3/4;
	display: grid;
`;

const Illustration = styled.img`
	z-index: 0;
	justify-self: end;
	align-self: end;
	margin-bottom: 5vh;
	margin-top: 5vh;
	grid-area: 1/2/2/3;
	width: 13vh;
`;

const Input = styled.input`
	margin-top: 1vh;
	margin-bottom: 1vh;
	padding-top: 0.2vh;
	padding-bottom: 0.2vh;
	border: none;
	border-bottom: 1px solid #5a595380;
	outline-width: 0;
	font-size: 2vh;
`;
const Button = styled.button`
	width: 6em;
	// max-width:
	height: 4vh;
	border-radius: 25pt;
	border: 1px solid #ed533d;
	margin-bottom: 30px;
	background-color: white;
	font-weight: bold;
	font-size: 2.5vh;
	color: #ed533d;
	:hover {
		color: white;
		background-color: #ed533d;
	}
	justify-self: center;
	align-self: end;
	grid-area: 1/1/2/2;
	z-index: 1;
	outline: none;
`;

const IllusButtonDiv = styled.div`
	grid-row: 3/4;
	display: grid;
	grid-template-columns: 50% 50%;
`;

const CreateProfile = () => {
	const history = useHistory();
	// attempting to get user info from the backend
	const { loading, query, data } = useQuery(GET_USER_INFO);
	// Handles click of skip button
	const handleClick = () => {
		var input_number = document.getElementById("phoneNumber");
		// Push the phone number into localStorage (temporarily. will be pushed to backend)
		localStorage.setItem("phone", input_number.value);
		// Redirects user to the home page
		history.push("/home");
	};

	const PartOfDay = () => {
		// Return part of the day based on user's current time
		const hour = new Date().getHours();
		if (hour <= 12) {
			return "Good Morning";
		}
		if (hour < 17 && hour > 12) {
			return "Good Afternoon";
		}
		if (hour >= 17) {
			return "Good Evening";
		}
    };
    
    const timeOfDay = PartOfDay();
    const firstName = "Will";

	return (
		<MainDiv>
			<Title>Hedwig</Title>
			<Greeting>{timeOfDay}, {firstName}</Greeting>
			<Paragraph>
				<div>
					<span style={{ fontWeight: "bold" }}>
						Tell us your phone number so we can better assist you!{" "}
					</span>
					<br />
					(You can <span style={{ fontWeight: "bold" }}>
						skip
					</span>{" "}
					and do this later)
					<br />
					<br />{" "}
					<span style={{ fontWeight: "bold" }}>Phone Number:</span>
				</div>
				<Input
					type="text"
					placeholder="Phone number"
					id="phoneNumber"
				/>
				<IllusButtonDiv>
					<Button onClick={handleClick}>Confirm</Button>
					<Button
						style={{ gridColumn: "2/3" }}
						onClick={() => history.push("/home")}
					>
						Skip
					</Button>
					<Illustration src={illustration} />
				</IllusButtonDiv>
			</Paragraph>
		</MainDiv>
	);
};

export default CreateProfile;
