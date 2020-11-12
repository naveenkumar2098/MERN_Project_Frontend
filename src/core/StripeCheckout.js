import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/CartHelper';
import createOrder from './helper/OrderHelper'
import StripeCheckoutButton from 'react-stripe-checkout'
import { API } from '../backend';


const StripeCheckout = ({products,
        setReload = f => f,
        reload = undefined
    }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    });

    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    const getCartAmount = () => {
        let amount = 0;
        products.map(p => {
            amount += p.price;
        })
        return amount;
    };

    const makePayment = token => {
        const body = {
            token,
            products
        }
        const headers = {
            "Content-Type": "application/json"
        }

        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        }).then(response => {
            console.log(response);
            const { status } = response;
            // cartEmpty()
        }).catch(error => console.log(error));
    }

    const showStripeButton = () => {
        return isAuthenticated() ? (
            <StripeCheckoutButton
                stripeKey = {process.env.REACT_APP_STRIPE_PUBLISH_KEY}
                token = {makePayment}
                amount = {getCartAmount() * 100}
                name = "Buy Product"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success">Pay with Stripe</button>
            </StripeCheckoutButton>
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">Signin</button>
            </Link>
        )
    }

    return (
        <div>
            <h3 className="text-white">Checkout using Stripe</h3>
            {showStripeButton()}
        </div>
    )
};

export default StripeCheckout;