import { Layout } from '@/components/Layout';
import { Store } from '@/utils/Store'
import React, { useState } from 'react'
import { useContext } from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import LoginModal from '@/components/LoginModal';

const CartScreen = () => {
    const { state, dispatch } = useContext(Store);
    const { cart: { items } } = state;
    const router = useRouter();
    const { data: session } = useSession();

    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    }

    const updateCartHandler = (item, qty) => {
        const quantity = Number(qty);
        dispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity} });
    }

    const checkoutClickHandler = () => {
        session?.user ? router.push('/shipping') : dispatch({type: 'SET_SHOW_MODAL', payload: true});
    }

    return (
        <Layout title={"Carrito"}>
            <h1 className='mb-4 text-xl'>Carrito</h1>

            {
                !items.length ? 
                ( <div>Carrito vacío. <Link href="/" className='text-blue-600'> Volver a la tienda</Link></div> ) 
                :
                (
                        <div className='grid md:grid-cols-4 md:gap-5'>
                            <div className='overflow-x-auto md:col-span-3'>
                                <table className='min-w-full'>
                                    <thead className='border-b'>
                                        <tr>
                                            <th className='px-5 text-left'>Item</th>
                                            <th className='p-5 text-right'>Cantidad</th>
                                            <th className='p-5 text-right'>Precio</th>
                                            <th className='p-5 text-center'>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.map(item => (
                                            <tr key={item.id} className="border-b">
                                                <td>
                                                    <Link href={`/product/${item.id}`} className='flex items-center'>
                                                        <img src={`/${item.image}`} alt={item.name} className='w-20' />
                                                        &nbsp;
                                                        {item.name}
                                                    </Link>
                                                </td>

                                                <td className='p-5 text-right'>
                                                    <select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                                                        {
                                                            [...Array(item.stock).keys()].map(x => (
                                                                <option value={x+1} key={x+1}>
                                                                    {x+1}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </td>

                                                <td className='p-5 text-right'>
                                                    ${item.price}
                                                </td>

                                                <td className='p-5 text-center'>
                                                    <button onClick={() => removeItemHandler(item)}>
                                                        <FontAwesomeIcon icon={faTimesCircle} className='h-5 w-5 m-auto'></FontAwesomeIcon>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className='card p-5'>
                                <ul>
                                    <li>
                                        <h3 className='pb-3 text-xl'>
                                            Subtotal ({items.reduce((accumulator, item) => accumulator + item.quantity, 0)})
                                            {' '}
                                            : $
                                            {items.reduce((accumulator, item) => accumulator + (item.quantity * item.price), 0)}
                                        </h3>
                                    </li>

                                    <li>
                                        <button onClick={checkoutClickHandler} className='primary-button w-full'>
                                            Tramitar pedido
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

export default dynamic(() => Promise.resolve(CartScreen), {ssr: false})