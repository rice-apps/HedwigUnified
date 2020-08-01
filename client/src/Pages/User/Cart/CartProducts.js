import React, { Component, useState } from "react";
import Thumb from "./Thumb.js";
import logo from "./icons8-team-7LNatQYMzm4-unsplash.jpg";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const CartProduct = ({ product }) => {
	const [isMouseOver, setIsMouseOver] = useState(false);
	const [quantity, setQuantity] = useState(2);
	const handleMouseOver = () => {
		setIsMouseOver(true);
	};
	const handleMouseOut = () => {
		setIsMouseOver(false);
	};
	const increase = () => {
		setQuantity(quantity + 1);
	};

	const decrease = () => {
		setQuantity(quantity - 1);
	};

	const options = ["ASAP", "30 Minutes", "1 Hour"];
	const defaultOption = options[0];
	return (
		<div
			className={
				isMouseOver ? "shelf-item shelf-item--mouseover" : "shelf-item"
			}
		>
			<div
				className="shelf-item__del"
				onMouseOver={() => handleMouseOver()}
				onMouseOut={() => handleMouseOut()}
			/>

			<Thumb classes="shelf-item__thumb" src={logo} alt={"Thai Tea"} />
			{/* <DropDownList data={[ "ASAP",, "30 Minutes", "1 Hour", "1.5 Hours", "2 Hours", "3 Hours", "4 Hours"]} defaultValue="ASAP" />  */}
			<div className="shelf-item__title">
				<p>{product.title}</p>
				<p>{product.varients}</p>
			</div>

			<div className="shelf-item__quantity">
				<button onClick={decrease} disabled={quantity === 1}>
					-
				</button>
				<h5>{quantity}</h5>
				<button onClick={increase}>+</button>
			</div>
			<Dropdown
				className="dropdowncontainer"
				options={options}
				value={defaultOption}
				placeholder="Select an option"
			/>
			<div className="shelf-item__price">
				<p>${product.price * quantity}</p>
			</div>
		</div>
	);
};

export default CartProduct;
