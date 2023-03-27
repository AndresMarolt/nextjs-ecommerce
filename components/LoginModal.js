import React, {useEffect, useState} from 'react'
import { ReactDOM } from 'react';
import { Layout } from './Layout';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {signIn, useSession} from 'next-auth/react'
import { getError } from '@/utils/error';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify'


const LoginModal = ({show, onClose}) => {
    const router = useRouter();
    const {redirect} = router.query;

    const handleCloseClick = (e) => {
    }
    
    const { handleSubmit, register, formState: {errors} } = useForm();
    
    const { data: session } = useSession();
    
    useEffect(() => {
        if(session?.user) {
            router.push(redirect || '/');
        }
    }, [router, session, redirect]);
    
    const submitHandler = async ({email, password}) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            });
            
            if(result.error) {
                toast.error(result.error);
            };
            onClose();
        } catch (error) {
            toast.error(getError(error))
        }
    }

    return(
        <div className='absolute h-full w-full z-0 bg-black/60'>
            <div className='relative bg-gray-100 w-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <form className='mx-auto lg:w-full p-8' onSubmit={handleSubmit(submitHandler)} noValidate>
                    <div className='mb-4 flex items-center justify-between'>
                        <h1 className='font-bold text-2xl'>Iniciar Sesión</h1>
                        <FontAwesomeIcon icon={faTimes} className='w-3 cursor-pointer' onClick={onClose}/>
                    </div>
                    
                    <div className='mb-4'>
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" className='w-full' id='email' autoFocus
                            {...register('email', {
                                required: 'Por favor ingrese su dirección de email',
                                pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i, message: "Por favor ingrese un email válido" }
                            })}
                        ></input>
                        {errors.email && (<p className='text-red-500'>{errors.email.message}</p>)}
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" className='w-full' id='password' autoFocus
                            {...register('password', {
                                required: 'Por favor ingrese la contraseña',
                                minLength: { value: 5, message: "Por favor ingrese una contraseña de al menos 5 caracteres" }
                            })}
                        />
                        {errors.password && (<p className='text-red-500'>{errors.password.message}</p>)}
                    </div>

                    <div className='mb-4'>
                        <button className='primary-button w-full'>Iniciar Sesión</button>
                    </div>

                    <div className='mb-4'>
                        <p>¿No tenés una cuenta? <Link href="register" className='underline'>Registrate</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginModal;