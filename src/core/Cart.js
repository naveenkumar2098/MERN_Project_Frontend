import React, { useState, useEffect } from 'react'
import {API} from '../backend'
import "../styles.css"
import Base from './Base'
import Card from './Card'
import { loadCart } from './helper/CartHelper'
import PaypalCheckout from './PaypalCheckout'
import StripeCheckout from './StripeCheckout'

const Cart = () => {
    
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setProducts(loadCart())
    }, [reload])

    const loadAllProducts = (productlist) => {
        return(
            <div>
                <h2>Products Section</h2>
                <br/>
                {productlist.map((product, index) => {
                    return(
                        <Card 
                            key={index}
                            product={product}
                            addtoCart = {false}
                            removeFromCart = {true}
                            setReload = {setReload}
                            reload = {reload}
                        />
                    )
                })}
            </div>
        )
    };

    const loadCheckout = () => {
        return(
            <div>
                <h2>Checkout Section</h2>
            </div>
        )
    };

    return (
        <Base title="Cart Page" desciption="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">
                    {products.length > 0 ? (
                        loadAllProducts(products)
                    ) : (
                        <h3>No Products in Cart</h3>
                    )}
                </div>
                <div className="col-6">
                    {loadCheckout()}
                    <br/>
                    <StripeCheckout 
                        products = {products}
                        setReload = {setReload}
                    />
                    <br/>
                    {console.log("List of products after stripe", products)}
                    <PaypalCheckout products={products} setReload={setReload} />
                </div>
            </div>
        </Base>
    )
};

export default Cart;
