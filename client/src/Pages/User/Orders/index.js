import React, { useState } from "react";
import Modal from "react-modal";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./tabs.css";
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
    orderUpdateOne(filter: { _id: $_id }, record: { fulfillment: Cancelled }) {
      record {
        _id
        __typename
        fulfillment
      }
    }
  }
`;

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const OrderItemList = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <span className="item">
          <p>{item.product.name}</p>{" "}
          <p>${parseFloat(item.product.price).toFixed(2)}</p>
        </span>
      ))}
      <hr class="solid"></hr>
    </div>
  );
};

const TotalAndTax = ({ items }) => {
  var tax = 0.1;
  var total = 0;
  var list = items.map((item) => {
    if (parseFloat(item.product.price) != undefined) {
      return parseFloat(item.product.price);
    } else {
      return 0.0;
    }
  });

  for (const item_order of list) {
    total += parseFloat(item_order);
  }

  return (
    <div>
      <p>
        Tax: <strong>${roundMoney(total * tax).toFixed(2)}</strong>
      </p>
      <p>
        Total: <strong>${roundMoney(total + total * tax).toFixed(2)}</strong>
      </p>
    </div>
  );
};

const OrderDetail = ({ order }) => {
  const { _id, items, vendor, user, createdAt } = order;
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [cancelOrder] = useMutation(CANCEL_ORDER);

  const handleCancelOrder = () => {
    cancelOrder({ variables: { _id: _id } });
  };

  function detailsClick() {
    if (detailOpen) {
      setDetailOpen(false);
    } else {
      setDetailOpen(true);
    }
  }

  function DateFormatter({ date }) {
    var formattedDate = date.split("-");
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <p>
        {months[parseInt(formattedDate[1]) - 1]}{" "}
        {formattedDate[2].substring(0, 2)}, {formattedDate[0]}
      </p>
    );
  }

  function vendorLogo(name) {
    if (name == "East West Tea") {
      return "//static1.squarespace.com/static/58559451725e25a3d8206027/t/58559539f5e2315e3ef1127c/1593500228704/?format=1500w";
    }
    //CoffeeHouse
    //Grillosophy
  }

  return (
    <div className="ordercard">
      <div className="orderText">
        <img src={vendorLogo(vendor.name)} className="vendorLogo" />
        <div>
          <span id="vendorHeader">
            <p id="vendorName">
              <strong>{vendor.name}</strong>
            </p>
            <a className="pinkText vendorLink" href="">
              Visit Store
            </a>
          </span>
          <p className="pinkText">
            <strong>{order.fulfillment}</strong>
          </p>
          <p>
            <DateFormatter date={order.createdAt} />
          </p>
          <p className="pinkText" onClick={detailsClick}>
            Details
          </p>
        </div>
      </div>

      <div>
        <hr class="solid"></hr>
        <p>
          {detailOpen ? (
            <strong>
              <OrderItemList items={items} />
            </strong>
          ) : null}
        </p>
      </div>

      <span className="tax-total">
        <p>
          <TotalAndTax items={items} />
        </p>
      </span>

      <hr class="solid"></hr>

      <span className="order_card_buttons">
        <button className="order_card_button">Reorder</button>
        <button className="order_card_button">Need Help?</button>
      </span>

      {order.fulfillment == "Placed" ? (
        <button onClick={handleCancelOrder}>Cancel Order</button>
      ) : null}
    </div>
  );
};

const OrderList = ({}) => {
  const history = useHistory();
  const [tab_selected_past, setTab] = useState(false);

  const {
    data: orderData,
    loading: orderLoading,
    error: orderError,
  } = useQuery(GET_PAST_ORDERS, { fetchPolicy: "network-only" });

  if (orderError) return <p>Errors...</p>;
  if (orderLoading) return <p>Loading...</p>;
  if (!orderData) return <p>No data...</p>;

  const orders = orderData.orderMany;

  function orders_tab(tab) {
    if (tab == "past") {
      setTab(true);
    } else {
      setTab(false);
    }
  }

  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Upcoming</Tab>
          <Tab>Past Orders</Tab>
        </TabList>

        <TabPanel>
          <div className="orderlist">
            {orders.map((order) => {
              return <OrderDetail order={order} />;
            })}
          </div>
        </TabPanel>
        <TabPanel>
          <h2>OrderDetail of Past Orders</h2>
        </TabPanel>
      </Tabs>

      {/* ///Deprecated///
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
	*/}

      <span className="bottom_bar">
        <p className="bottom_bar_buttons">New Order</p>
        <p className="bottom_bar_buttons">Sign Out</p>
      </span>
    </div>
  );
};

export default OrderList;
