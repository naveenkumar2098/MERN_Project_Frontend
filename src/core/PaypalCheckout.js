import React, { useState, useEffect } from 'react'
import DropIn from 'braintree-web-drop-in-react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/CartHelper';
import { createOrder } from './helper/OrderHelper';
import { getmeToken, processPayment } from './helper/PaypalPayment'


const PaypalCheckout = (products,
    setReload = f => f,
    reload = undefined) => {

    // const productlist = Array.from(products)
    // console.log(productlist)
    const productlist = products.products;
    
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getmeToken(userId, token).then(response => {
            console.log(response);
            if(response.error){
                setInfo({...info, error: response.error})
            }else{
                const clientToken = response.clientToken;
                setInfo({clientToken: clientToken});
            }
        });
    };

    const showBrainTreeDropIn = (products) => {
        return(
            <div>
                {info.clientToken !== null && products.length > 0 ? (
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={instance => info.instance = instance}
                        />
                        <button className="btn btn-success" onClick={onPurcahse}>Pay with Paypal</button>
                    </div>
                ) : (
                    <h3 className="text-white">Please Login or Add something to cart</h3>
                )}
            </div>
        )
    }

    useEffect(() => {
        getToken(userId, token);
    }, [])

    const onPurcahse = () => {
        setInfo({loading: true})
        let nonce;
        let getNonce = info.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount(productlist)
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({...info, success: response.success, loading: false});
                        console.log("PAYMENT SUCCESS");
                        const orderData = {
                            products: productlist,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount
                        }
                        createOrder(userId, token, orderData);
                        cartEmpty(() => {
                            console.log("CRASHED??");
                        });
                        setReload(!reload);
                    })
                    .catch(error => {
                        setInfo({loading: false, success: false});
                        console.log("PAYMENT FAILED")
                    })
            });
    };

    const getAmount = (products) => {
        let amount = 0
        products.map(p => {
            amount += p.price;
        })
        return amount;
    }

    return (
        <div>
            <h3 className="text-white">Checkout using Paypal</h3>
            {console.log(products)}
            {showBrainTreeDropIn(productlist)}
        </div>
    )
}

export default PaypalCheckout;