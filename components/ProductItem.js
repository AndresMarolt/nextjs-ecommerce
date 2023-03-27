import React from 'react'
import Link from 'next/link'

export const ProductItems = ({product}) => {

    return (
        <div className='card h-full'>
            <Link href={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} className=' h-full w-full'/>

                <div className='flex flex-col items-start justify-center py-3 text-sm '>
                    <h3 className=''>{product.name}</h3>
                    <p>${product.price}</p>
                </div>

            </Link> 
        </div>
    )
}