import React, { useContext, useEffect, useState } from "react";
import currency from "currency.js";
import "./product.css";

const VariantSelection = ({ variant }) => {
	let { question, description, options } = variant;
	return (
		<div className="variant">
			<div className="heading">
				<h1>{question}</h1>
				{description ? <p>{description}</p> : null}
			</div>
			<div className="options">
				{options.map((option) => (
					<div className="optionSet">
						<label>
							<input type="radio" name={question} />

							<span className="customRadio" />
							<p>{option.name}</p>
							<p>
								{currency(option.price).format({
									symbol: "$",
									format: "USD",
								})}
							</p>
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

const ModifierSelection = ({ modifier }) => {
	let { question, description, multiSelect, options } = modifier;
	return (
		<div className="modifier">
			<div className="heading">
				<h1>{question}</h1>
				{description ? <p>{description}</p> : null}
			</div>
			<div className="options">
				{options.map((option) => (
					<div className="optionSet">
						<label>
							{multiSelect ? (
								<React.Fragment>
									<input type="checkbox" name={question} />
									<span className="customCheck" />
								</React.Fragment>
							) : (
								<React.Fragment>
									<input type="radio" name={question} />
									<span className="customRadio" />
								</React.Fragment>
							)}
							<p>{option.name}</p>
							<p>
								{currency(option.price).format({
									symbol: "$",
									format: "USD",
								})}
							</p>
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

const Product = ({}) => {
	const product = {
		name: "Oreo Milk Tea",
		description:
			"Super sweet tea with the small chunks of oreos. You can choose to added fresh and chewy bobas for an adventurous taste.",
		variants: [
			{
				question: "Select your size",
				description: "",
				options: [
					{ name: "Medium (16oz)", price: 3.5 },
					{ name: "Large (20oz)", price: 4.0 },
				],
			},
		],
		modifiers: [
			{
				question: "Pick your topping(s)",
				description: "One included. $0.50 for each additional topping.",
				multiSelect: true,
				options: [
					{ name: "Oreo" },
					{ name: "Lychee Jelly" },
					{ name: "Tapioca Pearls (Boba)" },
				],
			},
		],
	};

	return (
		<div className="container">
			<img
				className="heroImage"
				src="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"
			/>
			<div className="itemHeading">
				<h2>{product.name}</h2>
				<p>{product.description}</p>
			</div>
			<div className="variantsContainer">
				{product.variants.map((variant) => {
					return <VariantSelection variant={variant} />;
				})}
			</div>
			<div className="modifiersContainer">
				{product.modifiers.map((modifier) => {
					return <ModifierSelection modifier={modifier} />;
				})}
			</div>
            <div className="quantityContainer">
                <button>-</button>
                <p>1</p>
                <button>+</button>
            </div>
            <div className="submitContainer">
                <button className="submitButton">Add</button>
            </div>
		</div>
	);
};

export default Product;
