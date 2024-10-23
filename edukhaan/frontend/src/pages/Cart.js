import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helper/displayINRCurrency';
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";


const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context);
    const loadingCart = new Array(4).fill(null);

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        });

        const responseData = await response.json();

        if (responseData.success) {
            setData(responseData.data);
        }
    };

    const handleLoading = async () => {
        await fetchData();
    };

    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    }, []);

    const increaseQty = async (id, qty) => {
        if (qty < 10) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty + 1
                })
            });
    
            const responseData = await response.json();
    
            if (responseData.success) {
                fetchData();
            }
        } else {
            toast.error("Maximum quantity reached.", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,
                style: {
                    backgroundColor: "#FFFFF", // light red background color
                    color: "#333333", // dark text color
                    border: "1px solid #FFFF", // red border to match error
                },
                icon: '❗',  // You can replace this with any error icon or keep the default
            });
            
        }
    };
    

    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            });

            const responseData = await response.json();

            if (responseData.success) {
                fetchData();
            }
        } else {
            // If qty is 1, delete the product instead of decreasing quantity
            await deleteCartProduct(id);
        }
    };

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            fetchData();
            toast.success(responseData.message);

            context.fetchUserAddToCart();
        }
    };

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0);
    return (
        <div className='container mx-auto'>

            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5'>No Data</p>
                    )
                }
            </div>

            <div className='flex flex-col lg:flex-row lg: justify-center gap-5 p-4'>

                {/***view product */}
                <div className='w-full max-w-3xl px-20'>
                    {
                        loading ? (
                            loadingCart?.map((el, index) => {
                                return (
                                    <div key={el + "Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })

                        ) : (
                            data.map((product, index) => {
                                return (
                                    <div key={product?._id + "Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]'>
                                        <div className='w-32 h-32 bg-slate-200'>
                                            <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply transition' />
                                        </div>
                                        <div className='px-4 py-2 relative'>
                                            {/**delete product */}
                                            <div className='absolute right-0 text-purple-600 rounded-full p-2 hover:bg-purple-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product?._id)}>
                                                <MdDelete />
                                            </div>

                                            <h2 className='text-lg lg:text-2xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                            <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                            <div className='flex items-center justify-between'>
                                                <p className='text-purple-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                <p className='text-purple-900 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                            </div>
                                            <div className='flex items-center gap-3 mt-1'>
                                                <button className='border border-purple-600 text-purple-600 font-extrabold hover:bg-purple-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => decraseQty(product?._id, product?.quantity)}>-</button>
                                                <span>{product?.quantity}</span>
                                                <button className='border border-purple-600 font-extrabold text-purple-600 hover:bg-purple-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>
                {/* Summary */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    {
                        loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>
                            </div>
                        ) : (
                            <div className='h-auto bg-white shadow-lg'>
                                <h2 className='text-white bg-purple-600 px-4 py-1 flex justify-center text-xl font-medium'>Summary</h2>

                                {/* Display product names and their quantities */}
                                <div className='px-4 py-2'>
                                    {data.map((product, index) => (
                                        <div key={product?._id + "Summary Product"} className='flex justify-between my-2'>
                                            {/* Truncate product names */}
                                            <span className='text-lg text-slate-700 max-w-[200px] truncate'>
                                                {product?.productId?.productName}
                                            </span>
                                            <span className='text-lg text-slate-700'>x {product?.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Display total quantity */}
                                <div className='flex items-center justify-between px-4 py-2 gap-2 font-medium text-lg text-slate-600'>
                                    <p>Total Quantity</p>
                                    <p>{totalQty}</p>
                                </div>

                                {/* Display total price */}
                                <div className='flex items-center justify-between px-4 py-2 gap-2 font-medium text-lg text-slate-600'>
                                    <p>Product Total</p>
                                    <p>{displayINRCurrency(totalPrice)}</p>
                                </div>

                                {/* Add shipping charges */}
                                <div className='flex items-center justify-between px-4 py-2 gap-2 font-medium text-lg text-slate-600'>
                                    <p>Shipping Charges</p>
                                    <p>{displayINRCurrency(200)}</p>
                                </div>

                                {/* Display grand total (product total + shipping charges) */}
                                <div className='flex items-center justify-between px-4 py-2 gap-2 font-bold text-lg text-slate-700 border-t border-slate-300 mt-2'>
                                    <p>Grand Total</p>
                                    <p>{displayINRCurrency(totalPrice + 200)}</p>
                                </div>

                                {/* Payment Button */}
                                <button className='bg-purple-600 p-2 text-white w-full mt-2 transition-all duration-300 hover:bg-purple-700 text-xl font-medium'>
                                    CheckOut
                                </button>
                            </div>
                        )
                    }
                </div>


            </div>
        </div>
    )
}

export default Cart