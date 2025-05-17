import CartProduct from '../components/cartProduct';
import Nav from '../components/nav';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useSelector } from 'react-redux'; // Import useSelector
import axios from '../axiosConfig'; // <--- use your configured axios

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);

    const fetchCartItems = async () => {
        if (!email) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/v2/product/cartproducts?email=${email}`);
            const cart = response.data.cart;
            if (Array.isArray(cart)) {
                const formattedProducts = cart.map(product => ({
                    _id: product.productId?._id || '',
                    name: product.productId?.name || 'Product Name',
                    images: product.productId?.images || [],
                    quantity: product.quantity || 1,
                    price: product.productId?.price || 0
                }));
                setProducts(formattedProducts);
            } else {
                console.error("Cart is not an array:", cart);
                setProducts([]);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [email]);

    const handlePlaceOrder = () => {
        navigate('/select-address');
    };

    return (
        <div className='w-full min-h-screen bg-[#222831]'>
            <Nav />
            <div className='w-full h-full justify-center items-center flex py-8'>
                <div className='w-full md:w-4/5 lg:w-4/6 2xl:w-2/3 h-full bg-[#31363F] rounded-xl shadow-lg border border-[#76ABAE]/20 flex flex-col'>
                    <div className='w-full h-16 flex items-center justify-center border-b border-[#76ABAE]/20'>
                        <h1 className='text-2xl font-semibold text-[#EEEEEE]'>Shopping Cart</h1>
                    </div>
                    <div className='w-full flex-grow overflow-auto px-6 py-4 gap-y-4'>
                        {isLoading ? (
                            <div className="text-center text-[#EEEEEE] py-8">
                                Loading cart items...
                            </div>
                        ) : products.length > 0 ? (
                            products.map(product => (
                                <CartProduct 
                                    key={product._id} 
                                    {...product}
                                    onQuantityUpdate={fetchCartItems}
                                    onRemove={fetchCartItems}
                                />
                            ))
                        ) : (
                            <div className="text-center text-[#EEEEEE] py-8">
                                Your cart is empty
                            </div>
                        )}
                    </div>

                    {/* Place Order Button */}
                    {!isLoading && products.length > 0 && (
                        <div className='w-full p-6 flex justify-end border-t border-[#76ABAE]/20'>
                            <button
                                onClick={handlePlaceOrder}
                                className='bg-[#76ABAE] text-[#222831] px-8 py-3 rounded-lg font-semibold hover:bg-[#5b8d90] transition duration-300 shadow-md hover:shadow-lg'
                            >
                                Place Order
                            </button>
                        </div>
                    )}
                </div> 
            </div>
        </div>
    );
}
export default Cart;