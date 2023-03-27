import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useContext } from 'react'
import { Store } from '@/utils/Store'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import LoginModal from './LoginModal'
import { Menu } from '@headlessui/react'
import DropdownLink from './DropdownLink'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const Layout = ({title, children}) => {
    const {state, dispatch} = useContext(Store)
    const {cart, showModal} = state;

    const [cartItemsCount, setCartItemsCount] = useState(0);

    const { status, data: session } = useSession();

    useEffect(() => {
        setCartItemsCount(cart.items.reduce((accumulator, item) => accumulator + item.quantity, 0 ));
    }, [cart.items])

    const logoutClickHandler = () => {
        Cookies.remove('cart');
        dispatch({ type: 'CART_RESET' })
        signOut({ callbackUrl: '/' });
    }
    return (
        <>
            <Head>
                <title>{title ? `${title} - Nextrend` : 'Nextrend'}</title>
                <meta name="description" content="Ecommerce website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
                <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;400;500;700&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400&display=swap" rel="stylesheet"></link>
            </Head>

            <ToastContainer position='bottom-center' limit={1} />

            <div className='flex flex-col justify-between min-h-screen font-raleway'>
                <header>
                    <nav className='flex h-20 px-4 items-center shadow-md justify-between'>
                        <Link href="/" className='text-3xl font-light relative left-2/4 -translate-x-1/2 font-lato'>
                            N&nbsp;E&nbsp;X&nbsp;T&nbsp;R&nbsp;E&nbsp;N&nbsp;D
                        </Link>

                        <div className='w-100 flex items-center gap-4'>
                            <Link href="/cart" className='p-2 flex relative'>
                                <FontAwesomeIcon icon={faShoppingBag} className='w-6 h-full' />
                                { cartItemsCount > 0 && (
                                    <span className='rounded-full bg-red-600 px-1 h-4 text-xs font-bold text-white flex items-center absolute bottom-5 left-7'>
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                            
                                {
                                    status === 'loading' ? <p>Loading</p> : 
                                        (
                                            session?.user ?
                                            <Menu as="div" className='relative inline-block'>
                                                <Menu.Button className='text-blue-600'>
                                                    {session.user.name}
                                                </Menu.Button>
                                                <Menu.Items className='absolute right-0 w-56 origin-top-right shadow-lg bg-white'>
                                                    <Menu.Item>
                                                        <DropdownLink className='dropdown-link' href='/profile'>Perfil</DropdownLink>
                                                    </Menu.Item>

                                                    <Menu.Item>
                                                        <DropdownLink className='dropdown-link' href='/order-history'>Historial de compras</DropdownLink>
                                                    </Menu.Item>

                                                    <Menu.Item>
                                                        <DropdownLink className='dropdown-link' href='#' onClick={logoutClickHandler}>Cerrar sesión</DropdownLink>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Menu> 
                                            : 
                                            <button className='p-2' onClick={() => dispatch({type: 'SET_SHOW_MODAL', payload: true})}>Iniciar sesión</button>
                                        )
                                }
                        </div>
                    </nav>
                </header>

                {
                    showModal ? <LoginModal onClose={() => dispatch({type: 'SET_SHOW_MODAL', payload: false})} show={showModal} /> : '' 
                }
                
                <main className='container m-auto mt-4 px-4'>
                    {children}
                </main>

                <footer className='flex justify-center items-center shadow-inner h-10'>
                    Copyright &#169; 2023 Nextrend
                </footer>
            </div>
        </>
    )
}