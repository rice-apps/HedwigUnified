import { useState, useEffect } from "react";
import { useQuery, gql, useMutation, InMemoryCache } from "@apollo/client";
import { VENDOR_QUERY } from "../../../graphql/VendorQueries.js";

import { useNavigate, useLocation } from "react-router-dom";

import Button from "@material-ui/core/Button";

// route: http://localhost:3000/employee/edithours

const UPDATE_VENDOR = gql`
  mutation UPDATE_VENDOR_HOURS($hours: [UpdateOneVendorBusinessHoursInput]!) {
    updateVendor(record: { hours: $hours }, filter: { name: "Cohen House" }) {
      record {
        hours {
          start
          end
        }
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
  });

  const [toggleIsClosed, { data, loading, error }] = useMutation(UPDATE_VENDOR);

  if (vendor_loading) {
    return <p>Loading...</p>;
  }
  if (vendor_error) {
    return <p>Error...</p>;
  }

  const originalHours = vendor_data.getVendor.hours;
  const updatedHours = [...originalHours];
  // This index is the index of the day! should reflect what day the user clicks to edit:
  const updatedDay = { ...updatedHours[0] };
  //   const updatedIsClosed = [...updatedDay.isClosed];
  //   updatedIsClosed[0] = false;
  updatedDay.isClosed = false;

  console.log("updatedDay ", updatedDay);

  updatedHours[0] = updatedDay;
  updatedHours.map((day, index) => {
    const dayCopy = { ...updatedHours[index] };
    delete dayCopy["__typename"];
    updatedHours[index] = dayCopy;
  });

  console.log("updated hours ", updatedHours);

  return (
    <div>
      <div>Hello</div>
      <Button
        onClick={
          () => console.log(updatedHours)
          //   toggleIsClosed({
          //     variables: {
          //       name: "Cohen House",
          //       hours: updatedHours,
          //     },
          //   })
        }
      >
        Change Sunday Closed
      </Button>
      <Button onClick={() => console.log(data)}>See data</Button>
    </div>
  );
}

export default EditHoursPage;
