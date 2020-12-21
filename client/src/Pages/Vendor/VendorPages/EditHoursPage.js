import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { VENDOR_QUERY } from "../../../graphql/VendorQueries.js";

import { useNavigate, useLocation } from "react-router-dom";

const UPDATE_VENDOR_CLOSED = gql`
  mutation UPDATE_VENDOR_CLOSED(
    $isOpen: Boolean!
    $merchantId: MongoID!
  ) {
    updateVendor(filter: { _id: $merchantId }, record: { isOpen: $isOpen }) {
      record {
        isOpen
      }
    }
  }
`

function EditHoursPage() {
  const { state } = useLocation();
  const { currProduct: productId, currVendor: vendorState } = state;

  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading,
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: vendorState },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  if (vendor_loading) {
    return <p>Loading...</p>;
  }
  if (vendor_error) {
    return <p>ErrorV...</p>;
  }
  const { getVendor: vendor } = vendor_data;

  vendor.merchantId

  const [vendorClosed, { data: update_data, loading, error }] = useMutation(UPDATE_VENDOR_CLOSED)

  vendorClosed({
    variables: {
      hours: {
        day:Saturday, 
        isClosed: true
      },
      merchantId: data.getVendor._id
    }
  })
}

return (

)
}

export default EditHoursPage;
