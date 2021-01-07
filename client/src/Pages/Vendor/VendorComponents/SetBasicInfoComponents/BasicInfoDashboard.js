import styled, { css } from "styled-components";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";

const GET_VENDOR_INFO = gql`
  query GET_AVAILABILITY($name: String!) {
    getVendor(filter: { name: "Cohen House" }) {
      name
      website
      email
      facebook
      phone
      cutoffTime
      pickupInstruction
    }
  }
`;

const UPDATE_VENDOR = gql`
  mutation UPDATE_VENDOR(
    $name: String!
    $website: String!
    $email: String!
    $facebook: String!
    $phone: String!
    $cutoffTime: Float!
    $pickupInstruction: String!
  ) {
    updateVendor(
      record: {
        website: $website
        email: $email
        facebook: $facebook
        phone: $phone
        cutoffTime: $cutoffTime
        pickupInstruction: $pickupInstruction
      }
      filter: { name: $name }
    ) {
      record {
        website
        email
        facebook
        phone
        cutoffTime
        pickupInstruction
      }
    }
  }
`;

const Div = styled.div`
  ${(props) =>
    props.wrapper &&
    css`
      height: 95%;
      width: 85%;
      background-color: orange;
      display: grid;
    `}
`;

function BasicInfoDashboard() {
  const [updateBasicInfo, { data, loading, error }] = useMutation(
    UPDATE_VENDOR
  );

  console.log("data ", data);

  updateBasicInfo({
    variables: {
      name: "Cohen House",
      website: "https://facultyclub.rice.edu/contact-us",
      email: "club@rice.edu",
      facebook: "test",
      phone: "713-348-4000",
      cutoffTime: 3.5,
      pickupInstruction: "test",
    },
  });

  console.log(data);
  return <Div wrapper>Set Basic Info</Div>;
}

export default BasicInfoDashboard;
