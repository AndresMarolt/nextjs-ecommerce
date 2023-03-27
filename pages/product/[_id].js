import React, {useContext, useEffect, useState} from 'react'
import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Store } from '@/utils/Store';
import db from '@/utils/db';
import Product from '@/models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductScreen = (props) => {

    const {product} = props;

    const {state, dispatch} = useContext(Store)
    const [itemStock, setItemStock] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
        const fetchStock = async () => {
            const {data} = await axios.get(`/api/products/${product._id}`);
            setItemStock(data.stock);
        }
        fetchStock();
    }, []);

    if(!product) {
        return <Layout title={"Producto no encontrado"}>Product Not Found</Layout>
    }

    const addToCartHandler = async () => {
        const existingItem = state.cart.items.find(item => item.id === product.id );
        const quantity = existingItem ? existingItem.quantity+1 : 1;

        const {data} = await axios.get(`/api/products/${product._id}`)
        setItemStock(data.stock);
        if(itemStock < quantity) {
            alert('Sorry. Product is out of stock');
        }

        dispatch({type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        toast.success('Producto agregado al pedido correctamente')
        // router.push('/cart');
    } 

    return(
        <Layout title={product.name}>
            <div className='py-2'>
                <Link href="/" >
                    Volver
                </Link>
            </div>

            <div className='grid md:grid-cols-4 md:gap-3'>
                <div className='md:col-span-2'>
                    <Image
                        src={`/${product.image}`}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout="responsive"
                    ></Image>
                </div>

                <div>
                    <ul>
                        <li>
                            <h1 className='text-lg'>{product.name}</h1>
                        </li>

                        <li>
                            <h1 className='text-lg'>{product.category}</h1>
                        </li>

                        <li>
                            <h1 className='text-lg'>{product.brand}</h1>
                        </li>

                        <li>
                            <h1 className='text-lg'>{product.rating} of {product.numReviews} reviews</h1>
                        </li>

                        <li>
                            <h1 className='text-lg'>{product.description}</h1>
                        </li>
                    </ul>
                </div>

                <div>
                    <div className='card p-5'>
                        <div className='mb-2 flex justify-between'>
                            <p>Price</p>
                            <p>${product.price}</p>
                        </div>

                        <div className='mb-2 flex justify-between'>
                            <p>Status</p>
                            <p>{itemStock > 0 ? 'Hay stock' : 'No disponible en este momento'}</p>
                        </div>

                        <button className='primary-button w-full' onClick={addToCartHandler}>Agregar al Carrito</button>
                    </div>
                </div>
            </div>


        </Layout>
    )
}

export default ProductScreen;

export const getServerSideProps = async (context) => {
    const {params} = context;
    const {_id} = params;

    await db.connect();

    try {
        const product = await Product.findById(_id).lean();
        await db.disconnect();
        return {
            props: {
                product: db.convertDocToObjects(product)
            }
        }
    } catch (error) {
        await db.disconnect();
        return {
            props: {
                product: null
            }
        }
    }

}