import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Thumb from './Thumb.js'
import { DropDownList } from '@progress/kendo-react-dropdowns';

class CartProduct extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired,

  };
  
  state = {
    isMouseOver: false,
    quantity: 2
  };

  handleMouseOver = () => {
    this.setState({ isMouseOver: true })
  };

  handleMouseOut = () => {
    this.setState({ isMouseOver: false })
  };
  increase = () => {
    this.setState({ quantity: this.state.quantity + 1})
  };
  decrease = () => {
    this.setState({ quantity: this.state.quantity - 1})
  };
  render() {
    const { product } = this.props
    // quantity = product.quantity
    const classes = ['shelf-item']
    const sports = [ "Baseball", "Basketball", "Cricket", "Field Hockey", "Football", "Table Tennis", "Tennis", "Volleyball" ]
    if (!!this.state.isMouseOver) {
      classes.push('shelf-item--mouseover')
    }
    
    return (
      <div className={classes.join(' ')}>
       <DropDownList data={[ "ASAP",, "30 Minutes", "1 Hour", "1.5 Hours", "2 Hours", "3 Hours", "4 Hours"]} defaultValue="ASAP" /> 
        <div
          className="shelf-item__del"
          onMouseOver={() => this.handleMouseOver()}
          onMouseOut={() => this.handleMouseOut()}
        />
         
                    
         
        <Thumb
          classes="shelf-item__thumb"
          
          alt={product.product.name}
        />
        <div className="shelf-item__details">
          <p className="title">{product.product.name}</p>
        <div>
          <div className="quantityCss">
            <button onClick={this.decrease} disabled={this.state.quantity === 1}>-</button>
            <h5>{this.state.quantity}</h5>
            <button onClick={this.increase}>+</button>
          </div>
        </div>
        </div>
        <div className="shelf-item__price">
          <p>${product.product.price * this.state.quantity}</p>
        </div>
      </div>
    
    )
  }
}

export default CartProduct
