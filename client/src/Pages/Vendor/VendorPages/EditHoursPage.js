import { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { VENDOR_QUERY } from "../../../graphql/VendorQueries.js";

import { useNavigate, useLocation } from "react-router-dom";

import Button from "@material-ui/core/Button";

const UPDATE_VENDOR_CLOSED = gql`
  mutation UPDATE_VENDOR_CLOSED(
    $hours: [VendorBusinessHours]!
    $name: String!
  ) {
    updateVendor(filter: { name: $name }, record: { hours: $hours }) {
      record {
        hours
      }
    }
  }
`;

function EditHoursPage() {
  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading,
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: "Cohen House" },
    // fetchPolicy: "cache-and-network",
    // nextFetchPolicy: "cache-first",
  });

  const updatedHours = null;
  if (!vendor_loading) {
    const originalHours = vendor_loading ? null : vendor_data.getVendor.hours;
    const updatedHours = [...originalHours];
    const updatedDay = { ...updatedHours[0] };
    const updatedIsClosed = [...updatedDay.isClosed];
    updatedIsClosed[0] = false;
    updatedDay.isClosed = updatedIsClosed;
    updatedHours[0] = updatedDay;
  }

  const [toggleIsClosed, { data, loading, error }] = useMutation(
    UPDATE_VENDOR_CLOSED,
    {
      variables: { hours: updatedHours, name: "Cohen House" },
    }
  );

  useEffect(() => {
    if (!vendor_loading) {
      toggleIsClosed(); // called when data ready
      console.log(data);
    }
  });

  return (
    <div>
      <div>Hello</div>
      <Button
      // onClick={() =>
      //   //   vendorClosed({
      //   //     variables: {
      //   //       hours: updatedHours,
      //   //       name: "Cohen House",
      //   //     },
      //   //   })
      //   console.log(updated_data)
      // }
      >
        Change Sunday Closed
      </Button>
    </div>
  );
}

export default EditHoursPage;
