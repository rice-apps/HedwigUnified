import React, { useState } from "react";
import Modal from "react-modal";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import "./order.css";

Modal.bind("#app");

const GET_PAST_ORDERS = gql`
	query GetOrders {
		orderMany(
			filter: {
				OR: [
					{ fulfillment: Ready }
					{ fulfillment: Cancelled }
					{ fulfillment: Placed }
					{ fulfillment: Preparing }
				]
			}
		) {
			_id
			__typename
			vendor {
				name
			}
			items {
				product {
					name
				}
			}
			user {
				netid
			}
			fulfillment
		}
	}
`;

const CANCEL_ORDER = gql`
	mutation CancelOrder($_id: MongoID!) {
		orderUpdateOne(
			filter: { _id: $_id }
			record: { fulfillment: Cancelled }
		) {
			record {
				_id
				__typename
				fulfillment
			}
		}
	}
`;

const OrderItemList = ({ items }) => {
	return (
		<div>
			<p>Order Items: </p>
			{items.map((item) => (
				<p>{item.product.name}</p>
			))}
		</div>
	);
};

const OrderDetail = ({ order }) => {
    const { _id, items, vendor, user } = order;
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

	const [cancelOrder] = useMutation(CANCEL_ORDER);

	const handleCancelOrder = () => {
		cancelOrder({ variables: { _id: _id } });
	};

	return (
		<div className="ordercard">
			<h2>{order.fulfillment}</h2>
			<p>{vendor.name}</p>
            <button onClick={openModal}>Show Order Items</button>
			{order.fulfillment == "Placed" ? (
				<button onClick={handleCancelOrder}>Cancel Order</button>
			) : null}
            <Modal
            className="modal"
            isOpen={modalOpen}
            onRequestClose={closeModal}
            >
                <OrderItemList items={items} />
            </Modal>
		</div>
	);
};

const OrderList = ({}) => {
	const history = useHistory();

	const {
		data: orderData,
		loading: orderLoading,
		error: orderError,
	} = useQuery(GET_PAST_ORDERS, { fetchPolicy: "network-only" });

	if (orderError) return <p>Errors...</p>;
	if (orderLoading) return <p>Loading...</p>;
	if (!orderData) return <p>No data...</p>;

	const orders = orderData.orderMany;

	return (
		<div className="orderlist">
			{orders.map((order) => {
				return <OrderDetail order={order} />;
			})}
		</div>
	);
};

export default OrderList;
