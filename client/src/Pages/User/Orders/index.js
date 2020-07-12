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
					price
				}
			}
			user {
				netid
			}
			fulfillment
			createdAt
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
			{items.map((item) => (
				<p>{item.product.name} ${item.product.price}</p>
			))}
		</div>
	);
};

const OrderDetail = ({ order }) => {
    const { _id, items, vendor, user, createdAt} = order;
	const [modalOpen, setModalOpen] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

	const [cancelOrder] = useMutation(CANCEL_ORDER);

	const handleCancelOrder = () => {
		cancelOrder({ variables: { _id: _id } });
	};

	function detailsClick(){
		if(detailOpen){
			setDetailOpen(false);
		}
		else{
			setDetailOpen(true);
		}
	}

	function total_and_tax({items}){
		var total = 0;
		for(var item in items){
			total += parseInt(item.product.price);}
		return [total, total*.1];
	}

	return (
		<div className="ordercard">
			<div className = "orderText">
			<p><strong>{vendor.name}</strong></p>
			<p className = "pinkText"><strong>{order.fulfillment}</strong></p>
			<p>{order.createdAt}</p>
			<hr class="solid"></hr>
			<p  className = "pinkText" onClick = {detailsClick}>Details</p>
			<p>{detailOpen ? <strong><OrderItemList items={items} /></strong>:null}</p>
			</div>
			<hr class="solid"></hr>

	 		<p>Total: {total_and_tax(items)[0]}</p>

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
	const[tab_selected_past, setTab] = useState(false);

	const {
		data: orderData,
		loading: orderLoading,
		error: orderError,
	} = useQuery(GET_PAST_ORDERS, { fetchPolicy: "network-only" });

	if (orderError) return <p>Errors...</p>;
	if (orderLoading) return <p>Loading...</p>;
	if (!orderData) return <p>No data...</p>;

	const orders = orderData.orderMany;

	function orders_tab(tab){
			if(tab == "past"){
				setTab(true); 
			}
			else{
				setTab(false);
			}	
	}



	return (
		<div>
		<div className = "order_tab">
			<p className = {tab_selected_past == false ? "order_tab_selected":"order_tab_unselected"} onClick = {() => orders_tab("upcoming")}>Upcoming</p> 
			<p className = {tab_selected_past == true ? "order_tab_selected":"order_tab_unselected"} onClick = {() => orders_tab("past")}>Past Orders</p> 
		</div>
		<div className="orderlist">
			{orders.map((order) => {
				if(!tab_selected_past){
					return <OrderDetail order={order} />;
				}
				else{
					return null //Return OrderDetail of past orders fetched from backend?
				}
			})}
		</div>
		</div>
	);
};

export default OrderList;
