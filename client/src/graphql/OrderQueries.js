import React, { Fragment } from "react";
import { useQuery, gql } from "@apollo/client";

export const UPDATED_ORDER = gql`
  subscription OrderSubscription {
    orderUpdated {
      id
      orderStatus
    }
  }
`;
