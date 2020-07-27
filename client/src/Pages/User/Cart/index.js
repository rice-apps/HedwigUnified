/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Modal from 'react-modal'
import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation, useApolloClient } from '@apollo/client';
import { useParams, useHistory } from 'react-router';
import logo from './tealogo.png'; 
import './cart.scss'
import { centerCenter, row, column, startStart, centerStart,startCenter } from '../../../Styles/flex';
import CartProduct from './CartProducts'
Modal.bind("#app");

const FIND_OR_CREATE_CART = gql`
    mutation FindOrCreateCart($vendorID:MongoID!){
        findOrCreateCart(record:{vendor:$vendorID}) {
            _id
            __typename
            items {
                product {
                    _id
                    name
                    price
                }
                quantity
                comments
            }
            fulfillment
        }
    }
`

const CREATE_ORDER_MUTATION = gql`
    mutation CreateOrder($userID:MongoID!, $vendorID:MongoID!, $items:[OrdersItemsInput] ) {
        orderCreateOne(record:{user:$userID, vendor:$vendorID, items:$items}) {
            record {
                _id
                createdAt
                items {
                    product {
                        name
                    }   
                    comments
                }
            }
            recordId
        }
    }
`

const CREATE_CART_MUTATION = gql`
    mutation CreateCart($userID:MongoID!, $vendorID:MongoID!) {
        orderCreateOne(record:{user:$userID, vendor:$vendorID}) {
            record {
                _id
            }
            recordId
        }
    }
`

const GET_CART = gql`
    query GetCart {
        cart @client {
            vendor @client {
                name
                items {
                    product {
                        _id 
                        price
                    }
                    quantity
                    comments
                }
            }
        }
    }
`

const PLACE_ORDER = gql`
    mutation PlaceOrder($_id: MongoID!) {
        orderUpdateOne(filter: { _id: $_id } , record: { fulfillment: Placed } ){
            record {
                _id
                __typename
                fulfillment
            }
        }
    }
`

const quantityCss = css`
        border-radius: 10px;  
        border: 2px solid #00CB2C;
        padding: 5px;
        justify-content: center;
        margin: 8px;
        width: 60px;
        display: flex;
        flex-direction: row;
`

const cardCss = css`
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 100%;
    height: 60vh;
    border-radius: 0 0 20px 20px;
`
const bottomCardCss = css`
    box-shadow: 8px 0 4px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    width: 100%;
    height: 50%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 20px 20px 0 0;
`

const modalCss = css`
	margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	height: 25%;
	width: 25%;
	margin-top: 35vh;
	background-color: white;
`


const savingModalTextContainer = [
  column,
  centerCenter,
  css`
    position: relative;

    width: 100%;
    height: 100%;
  `,
]

const CartItem = ({ item }) => {
    const history = useHistory();
    const { slug, product } = useParams();
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const [quantity, setQuantity] = useState(item.quantity)
    const increase = () =>{
        setQuantity(prevCount => prevCount + 1)
    }

    const decrease = () => {
        setQuantity(prevCount => prevCount - 1)
    }
    const handleDeleteClick = () => {
}

    return (
    <div css={[row], {margin: '20px'}}>
        <div css={[column]}>
            <h3 css={{margin: '16px', width: '100px'}}>{item.product.name}</h3>
            <p css={{margin: '16px', width: '100px'}}>Oreo, Boba</p>
        </div>
        <div css={[row, quantityCss]}>
            <div css={{height: '20px'}} onClick={decrease} disabled={quantity === 1}>-</div>
            <h5 css={{width: '10px', margin: '0 5px 0 5px'}}>{quantity}</h5>
            <div css={{height: '20px'}} onClick={increase}>+</div>
        </div>
        <p css={{margin: '16px'}}>${item.product.price * quantity}</p>
        <h4 onClick={openModal}>Customize</h4>
        <Modal
            css={modalCss}
            isOpen={modalOpen}
            onRequestClose={closeModal}
            >
            <p>Hola</p>
        </Modal>
    </div>
    )
}

const CartDetail = ({ }) => {
    const history = useHistory();
   

    const [findOrCreateCart, { data, loading, error } ] = useMutation(FIND_OR_CREATE_CART);
    const [placeOrder, { data: placeOrderData, loading: placeOrderLoading, error: placeOrderError } ] = useMutation(PLACE_ORDER);

    // Move this to a utils folder
    const transformToOrderItems = (cart) => {
        return cart.map(item => {
            return {
                product: item.product._id,
                addons: item.addons.map(addon => addon._id),
                quantity: 1,
                comments: item.comments
            }
        });
    }

    useEffect(() => {
        let vendorID = "5ecf473841ccf22523280c3b";
        findOrCreateCart({ variables: { vendorID: vendorID } });
    }, []);

    useEffect(() => {
        if (placeOrderData) {
            history.push("/user/orders");
        }
    }, [placeOrderData]);

    if (placeOrderLoading) return <p>Creating order...</p>;
    if (placeOrderError) return <p>Error while placing order...</p>;

    if (error) return <p>Errors...</p>;
    if (loading) return <p>Loading...</p>
    if (!data) return (<p>No data...</p>);

    const { _id, items, fulfillment } = data.findOrCreateCart;

    // let orderVariables = { userID: userID, vendorID: vendorID };

    const handleConfirmClick = () => {
        // Submit order
        placeOrder({ variables: { _id: _id } });

        // createOrder({ variables: {...orderVariables, items: transformToOrderItems(cart) }});
        // Then navigate back to order detail page
    }


    return (
        <div className="float-cart">
        <div className="float-cart__content">
          <div className="float-cart__shelf-container">
            
            <div css={[centerCenter, row]}>
                <img src={logo} className="logo" alt="Logo" />
                <div>
                <p css={{margin: '16px 0 0 10px'}}>East West Tea</p>
                <p css={{margin: '0 0 0 10px', color: 'grey'}}>Houston, TX</p>
                </div>
      
            </div>
            {items.map(item => {
                return (<CartProduct product={item} key={item.id} />)
            })}
           
            </div>
            <div className="float-cart__footer">
            <div className="sub">SUBTOTAL</div>
            <div className="sub-price">
              <p className="sub-price__val">$ 10</p>
            </div>
            <div className="buy-btn" title={"Confirm"} onClick={handleConfirmClick}>Confirm Order</div>
            </div>
     </div>
</div>
    );
}

export default CartDetail;
