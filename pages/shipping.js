import { Layout } from "@/components/Layout";
import React, { useEffect } from "react";
import CheckoutWizard from "@/components/CheckoutWizard";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const ShippingScreen = () => {

    const {
        handleSubmit,
        register,
        formState: {errors},
        setValue,
    } = useForm();

    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {cart} = state;
    const {shippingAddress} = cart;

    useEffect(() => {
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('province', shippingAddress.province);
        setValue('postalCode', shippingAddress.postalCode);
    }, [shippingAddress]);

    const submitHandler = ({fullName, address, city, province, postalCode}) => {
        dispatch({type: 'SAVE_SHIPPING_ADDRESS', payload: {fullName, address, city, province, postalCode}})
        Cookies.set('cart', JSON.stringify({...cart, shippingAddress: { fullName, address, city, province, postalCode } } ));

        router.push('/payment')
    }

    return(
        <Layout title="Datos de envío">
            <CheckoutWizard activeStep={1}></CheckoutWizard>

            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
                <h1 className="mb-4 text-xl">Datos de envío</h1>
                <div className="mb-4">
                    <label htmlFor="fullName">Nombre completo</label>
                    <input type="text" className="w-full" id="fullName" autoFocus  
                        { ...register('fullName', {
                            required: 'Por favor ingrese su nombre completo'
                        })}
                    />
                    {errors.fullName && (
                        <p className="text-red-500">{errors.fullName.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="address">Domicilio</label>
                    <input type="text" className="w-full" id="address" autoFocus  
                        { ...register('address', {
                            required: 'Por favor ingrese su domicilio',
                            minLength: { value: 3, message: 'El domicilio de envío debe tener más de dos caracteres' }
                        })}
                    />
                    {errors.address && (
                        <p className="text-red-500">{errors.address.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="city">Ciudad</label>
                    <input type="text" className="w-full" id="city" autoFocus  
                        { ...register('city', {
                            required: 'Por favor ingrese su ciudad'
                        })}
                    />
                    {errors.city && (
                        <p className="text-red-500">{errors.city.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="city">Provincia</label>
                    <input type="text" className="w-full" id="province" autoFocus  
                        { ...register('province', {
                            required: 'Por favor ingrese su provincia'
                        })}
                    />
                    {errors.province && (
                        <p className="text-red-500">{errors.province.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="postalCode">Código postal</label>
                    <input type="text" className="w-full" id="postalCode" autoFocus  
                        { ...register('postalCode', {
                            required: 'Por favor ingrese su código postal'
                        })}
                    />
                    {errors.postalCode && (
                        <p className="text-red-500">{errors.postalCode.message}</p>
                    )}
                </div>

                <div className="mb-4 flex justify-between">
                    <button className="primary-button">Continuar</button>
                </div>
            </form>
        </Layout>
    )
}

ShippingScreen.auth = true;

export default ShippingScreen;