import { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { VENDOR_QUERY } from "../../../graphql/VendorQueries.js";

import { useNavigate, useLocation } from "react-router-dom";

import Button from "@material-ui/core/Button";

// const UPDATE_VENDOR = gql`
//   mutation UPDATE_VENDOR($hours: [VendorBusinessHours]!, $name: String!) {
//     updateVendor(filter: { name: $name }, record: { hours: $hours }) {
//       record {
//         hours {
//           start
//           end
//         }
//       }
//     }
//   }
// `;

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
    console.log("updated hours ", updatedHours);
  }

  //   const [toggleIsClosed, { data, loading, error }] = useMutation(
  //     UPDATE_VENDOR,
  //     {
  //       variables: { hours: updatedHours, name: "Cohen House" },
  //     }
  //   );
  //   const [toggleIsClosed, { data, loading, error }] = useMutation(UPDATE_VENDOR);

  const [toggleIsClosed, { data, loading, error }] = useMutation(
    UPDATE_VENDOR,
    {
      variables: {
        name: "Cohen House",
        hours: [
          {
            start: [],
            end: [],
            day: "Sunday",
            isClosed: true,
          },
        ],
      },
    }
  );
  //   toggleIsClosed();

  //   useEffect(() => {
  //     console.log("updatedHours ", updatedHours);
  //     if (!vendor_loading) {
  //       toggleIsClosed();
  //       console.log(data);
  //     }
  //   });

  return (
    <div>
      <div>Hello</div>
      <Button
        onClick={() =>
          //   vendorClosed({
          //     variables: {
          //       hours: updatedHours,
          //       name: "Cohen House",
          //     },
          //   })
          toggleIsClosed()
        }
      >
        Change Sunday Closed
      </Button>
      <Button onClick={() => console.log(data)}>See data</Button>
    </div>
  );
}

export default EditHoursPage;
