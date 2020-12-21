import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { VENDOR_QUERY } from "../../../graphql/VendorQueries.js";

import { useNavigate, useLocation } from "react-router-dom";

import Button from "@material-ui/core/Button";

// const UPDATE_VENDOR_CLOSED = gql`
//   mutation UPDATE_VENDOR_CLOSED($isClosed: Boolean!, $merchantId: MongoID!) {
//     updateVendor(filter: { _id: $merchantId }, record: { isOpen: $isOpen }) {
//       record {
//         hours
//       }
//     }
//   }
// `;
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
  //   const [vendorClosed, { data: updated_data, loading, error }] = useMutation(
  //     UPDATE_VENDOR_CLOSED
  //   );

  //   const { state } = useLocation();
  //   const { /*currProduct: productId, */ currVendor: vendorState } = state;

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading,
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: "Cohen House" },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  //   if (vendor_loading) {
  //     return <p>Loading...</p>;
  //   }
  //   if (vendor_error) {
  //     return <p>ErrorV...</p>;
  //   }

  //   const originalHours = vendor_data.getVendor.hours;
  //   console.log("originalHours: ", originalHours);
  //   // -- TOGGLE OPEN/CLOSED DROPDOWN --

  //   // -- VENDOR CHOOSES OPEN -- **for now, treating isClosed as type array but should just be boolean
  //   // make a shallow copy of the original hours:
  //   const updatedHours = [...originalHours];
  //   // make a shallow copy of the day we want to mutate from our copy of hours:
  //   const updatedDay = { ...updatedHours[0] };
  //   // make a shallow copy of the isClosed array we want to mutate from our copy of day:
  //   const updatedIsClosed = [...updatedDay.isClosed];
  //   // change the copy of isClosed array to have false:
  //   updatedIsClosed[0] = false;
  //   // replace isClosed
  //   updatedDay.isClosed = updatedIsClosed;
  //   updatedHours[0] = updatedDay;
  //   console.log("updatedHours: ", updatedHours);

  //   console.log("vendor data: ", vendor_data);
  //   const [
  //     toggleIsClosed,
  //     { data: updated_data, loading: updated_loading, error: updated_error },
  //   ] = useMutation(UPDATE_VENDOR_CLOSED, {
  //     variables: { hours: updatedHours, name: "Cohen House" },
  //   });
  const [toggleIsClosed] = useMutation(UPDATE_VENDOR_CLOSED);

  if (!vendor_loading && !vendor_error) {
    const originalHours = vendor_data.getVendor.hours;
    console.log("originalHours: ", originalHours);
    // -- TOGGLE OPEN/CLOSED DROPDOWN --
    // make a shallow copy of the original hours:
    const updatedHours = [...originalHours];
    // make a shallow copy of the day we want to mutate from our copy of hours:
    const updatedDay = { ...updatedHours[0] };
    // make a shallow copy of the isClosed array we want to mutate from our copy of day:
    const updatedIsClosed = [...updatedDay.isClosed];
    // change the copy of isClosed array to have false:
    updatedIsClosed[0] = false;
    // replace isClosed
    updatedDay.isClosed = updatedIsClosed;
    updatedHours[0] = updatedDay;
    console.log("updatedHours: ", updatedHours);
    toggleIsClosed({
      variables: {
        hours: updatedHours,
        name: "Cohen House",
      },
    });
  }

  //   useEffect(() => {
  //     if (!vendor_loading && !vendor_error) {
  //       toggleIsClosed(); // called when data ready
  //     }
  //   });

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
