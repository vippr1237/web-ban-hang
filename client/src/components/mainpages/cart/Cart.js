import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)

    useEffect(() =>{
        const getTotal = () =>{
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            },0)

            setTotal(total)
        }

        getTotal()

    },[cart])

    const addToCart = async (cart) =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }


    const increment = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                item.quantity += 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id =>{
        if(window.confirm("Bạn có thực sự muốn xóa sản phẩm này?")){
            cart.forEach((item, index) => {
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })

            setCart([...cart])
            addToCart(cart)
        }
    }

    const tranSuccess = async(paymentID, address) => {

        await axios.post('/api/payment', {cart, paymentID, address}, {
            headers: {Authorization: token}
        })

        setCart([])
        addToCart([])
        alert("Đặt hàng thành công.")
    }


    if(cart.length === 0) 
        return <h2 style={{textAlign: "center", fontSize: "5rem"}}>Cart Empty</h2> 

    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart" key={product._id}>
                        <img src={product.images.path} alt="" />

                        <div className="box-detail">
                            <h2>{product.title}</h2>

                            <h3>{product.price * product.quantity}VND</h3>
                            <p>{product.description}</p>
                            <p>{product.content}</p>

                            <div className="amount">
                                <button onClick={() => decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                            </div>
                            
                            <div className="delete" 
                            onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <h3>Total: $ {total}</h3>
                <PayPalScriptProvider options={{ "client-id": "Af3mzyH_GRt-CBFXSh_uHlDWz57decr9l7Ffh4bKofAlEa_RzQ-NW_4GFP3ZBODDzXMing-MMGPQMqRN" }}>
                    <PayPalButtons style={{ layout: "horizontal" }} 
                    createOrder={(data, actions) => {
                        const changeToUSD = total/24824;
                        console.log(changeToUSD.toFixed(2))
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: changeToUSD.toFixed(2).toString(),
                                    },
                                },
                            ],
                        });
                    }} 
                    onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        console.log(details)
                        const address = details.purchase_units[0].shipping.address;
                        console.log(address)
                        const paymentId = details.purchase_units[0].payments.captures[0].id
                        tranSuccess(paymentId, address);
                    });
                }}/>
                </PayPalScriptProvider>
            </div>
        </div>
    )
}

export default Cart
