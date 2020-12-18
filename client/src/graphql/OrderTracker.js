import { gql } from "@apollo/client";

const ORDER_TRACKER = gql`
  query ORDER_TRACKER($orderId: String!) {
    getOrderTracker(filter: { orderId: $orderId }) {
      shopifyOrderId
    }
  }
`;

export default ORDER_TRACKER;
