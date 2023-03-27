import React, { useContext, useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import CheckoutWizard from "@/components/CheckoutWizard";
import Link from "next/link";
import Image from "next/image";
import { Store } from "@/utils/Store";
import { useRouter } from "next/router";
import { getError } from "@/utils/error";
import {toast} from 'react-toastify'
import axios from "axios";
import Cookies from "js-cookie";

const PlaceOrderScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {state, dispatch} = useContext(Store);
    const {cart} = state;
    const {items, shippingAddress, paymentMethod} = cart;

    const round2 = (num) => {
        return Math.round(num * 100 + Number.EPSILON) / 100;
    }

    const itemsPrice = round2(items.reduce((accumulator, item) => accumulator + item.quantity * item.price, 0));
    const shippingPrice = itemsPrice > 200 ? 0 : 700;
    const totalPrice = round2(itemsPrice + shippingPrice);

    const PlaceOrderHandler = async () => {
        try {
            setLoading(true);
            const {data} = await axios.post('api/orders', {
                orderItems: items,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingAddress,
                shippingPrice,
                totalPrice
            })
            setLoading(false);
            dispatch({type: 'CLEAR_CART_ITEMS'})
            Cookies.set('cart', JSON.stringify({ ...cart, items: [] }));
            router.push(`/order/${data._id}`);
        } catch (error) {
            setLoading(false);
            toast.error(getError(error));
        }
    }

    useEffect(() => {
        if(!paymentMethod) {
            router.push('/payment')
        }
    }, [paymentMethod, router]);

    return (
        <Layout title={"Confirmar compra"}>
            <CheckoutWizard activeStep={3} />
            <h1 className="mb-4 text-xl">Confirmar compra</h1>
            {
                !items.length ?
                    (
                        <p>El carrito está vacío. <Link href={"/"} className="text-blue-600">Volver a la tienda</Link></p>
                    )
                :
                    (
                        <div className="grid md:grid-cols-4 md:gap-5">
                            <div className="overflow-x-auto md:col-span-3">
                                <div className="card p-5">
                                    <h2 className="mb-2 text-lg font-bold">Datos de envío</h2>
                                    <div>
                                        <p>Nombre completo: {shippingAddress.fullName}</p>
                                        <p>Domicilio: {shippingAddress.address},</p>
                                        <p>Ciudad: {shippingAddress.city}</p>
                                        <p>Código postal: {shippingAddress.postalCode}</p>
                                        <p>Provincia: {shippingAddress.province}</p>
                                    </div>
                                    <Link className="text-blue-600" href={"/shipping"}>Editar</Link>
                                </div>

                                <div className="card p-5">
                                    <h2 className="mb-2 text-lg font-bold">Método de pago</h2>
                                    <p>{paymentMethod}</p>
                                    <Link className="text-blue-600" href={"/payment"}>Editar</Link>
                                </div>

                                <div className="card p-5">
                                    <h2 className="mb-2 text-lg font-bold">Finalizar compra</h2>
                                    <table className="min-w-full">
                                        <thead className="border-b">
                                            <tr>
                                                <th className="px-5 text-left">Producto</th>
                                                <th className="p-5 text-right">Cantidad</th>
                                                <th className="p-5 text-right">Precio</th>
                                                <th className="p-5 text-right">Subtotal</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                items.map(item => (
                                                    <tr key={item._id} className="border-b">
                                                        <td>
                                                            <Link href={`/product/${item._id}`}>
                                                                <Image 
                                                                    src={`/${item.image}`}
                                                                    alt={item.name}
                                                                    width={50}
                                                                    height={50}
                                                                    className='inline'
                                                                ></Image>
                                                                &nbsp;
                                                                {item.name}
                                                            </Link>
                                                        </td>

                                                        <td className="p-5 text-right">{item.quantity}</td>
                                                        <td className="p-5 text-right">${item.price}</td>
                                                        <td className="p-5 text-right">${item.price * item.quantity}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>

                                    <div>
                                        <Link href={"/cart"}>Editar</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-5">
                                <h2 className="mb-2 text-lg">Resumen de compra</h2>
                                <ul>
                                    <li>
                                        <div className="mb-2 flex justify-between">
                                            <h3>Artículos</h3>
                                            <p>${itemsPrice}</p>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="mb-2 flex justify-between">
                                            <h3>Envío</h3>
                                            <p>${shippingPrice}</p>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="mb-2 flex justify-between">
                                            <h3>Total</h3>
                                            <p>${totalPrice}</p>
                                        </div>
                                    </li>

                                    <li>
                                        <button 
                                            className="primary-button w-full"
                                            disabled={loading}
                                            onClick={PlaceOrderHandler}
                                        >
                                            {loading ? 'Cargando...' : 'Finalizar compra'}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
            }
        </Layout>
    )
}

PlaceOrderScreen.auth = true;

export default PlaceOrderScreen