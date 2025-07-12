import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/axiosInstance';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { token } = useAuth();
  
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    full_name: '',
    email: '',
    phone: '',
    delivery_method: 'delivery', // 'delivery' or 'pickup'
    pickup_time: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Auto-set payment method based on delivery method
  useEffect(() => {
    if (shippingData.delivery_method === 'pickup') {
      setPaymentMethod('pickup');
    } else if (shippingData.delivery_method === 'delivery') {
      setPaymentMethod('cod');
    }
  }, [shippingData.delivery_method]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const shippingCost = 50;
  const total = getTotal() + shippingCost;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // Debug: Check authentication
      console.log('Token:', token);
      console.log('LocalStorage token:', localStorage.getItem('token'));
      console.log('Cart items:', cart);
      
      // Prepare request body according to backend schema
      const orderData = {
        full_name: shippingData.full_name,
        email: shippingData.email,
        phone: shippingData.phone,
        delivery_method: shippingData.delivery_method,
        pickup_time: shippingData.delivery_method === 'pickup' ? shippingData.pickup_time : null,
        // For pickup orders, don't send address fields (backend will use pickup location)
        // For delivery orders, send address fields
        ...(shippingData.delivery_method === 'delivery' ? {
          address: shippingData.address || '',
          city: shippingData.city || '',
          state: shippingData.state || '',
          zip: shippingData.zip || '',
          country: shippingData.country || 'India'
        } : {
          // For pickup, send minimal address info (backend will override with pickup location)
          address: '',
          city: '',
          state: '',
          zip: '',
          country: 'India'
        }),
        // Send cart items
        cart_items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      // Debug: Log the data being sent
      console.log('Sending order data:', orderData);
      
      // Send order to backend
      const response = await api.post('/checkout/', orderData);
      
      console.log('Order placed successfully:', response.data);
      
      // Clear the cart after successful order
      clearCart();
      
      // Generate order number for display
      const newOrderNumber = 'ORD-' + Date.now();
      setOrderNumber(newOrderNumber);
      setOrderPlaced(true);
      
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        console.log('Backend error response:', errorData);
        if (errorData && errorData.detail) {
          errorMessage = errorData.detail;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid order data. Please check your information and try again.';
        } else if (error.response.status === 401) {
          errorMessage = 'Please login again to continue.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login to Checkout</h2>
        <p className="text-gray-600 mb-4">You need to be logged in to complete your purchase.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-4">Add some products to your cart before checkout.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-100 rounded-lg p-8 mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-green-700 mb-4">Thank you for your purchase.</p>
            <p className="text-lg font-semibold">Order Number: {orderNumber}</p>
            <p className="text-sm text-green-600 mt-2">Your cart has been cleared.</p>
          </div>
                      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Order Details</h3>
              <div className="space-y-2 text-left">
                <p><strong>Items:</strong> {cart.length} products</p>
                <p><strong>Total:</strong> Rs.{total}</p>
                <p><strong>Delivery Method:</strong> {shippingData.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                <p><strong>Payment Method:</strong> 
                  {paymentMethod === 'cod' && ' 💵 Cash on Delivery'}
                  {paymentMethod === 'pickup' && ' 🏪 Store Pickup'}
                </p>
                <p><strong>Shipping Address:</strong></p>
                <p className="ml-4">
                  {shippingData.full_name}<br />
                  {shippingData.address}<br />
                  {shippingData.city}, {shippingData.state} {shippingData.zip}<br />
                  {shippingData.country}
                </p>
              </div>
            </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2">Shipping</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2">Payment</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingData.full_name}
                      onChange={(e) => setShippingData({...shippingData, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={shippingData.email}
                        onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="delivery_method"
                          value="delivery"
                          checked={shippingData.delivery_method === 'delivery'}
                          onChange={(e) => setShippingData({...shippingData, delivery_method: e.target.value})}
                          className="mr-3"
                        />
                        <span>Home Delivery</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="delivery_method"
                          value="pickup"
                          checked={shippingData.delivery_method === 'pickup'}
                          onChange={(e) => setShippingData({...shippingData, delivery_method: e.target.value})}
                          className="mr-3"
                        />
                        <span>Store Pickup</span>
                      </label>
                    </div>
                  </div>

                  {shippingData.delivery_method === 'pickup' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                      <input
                        type="datetime-local"
                        required
                        value={shippingData.pickup_time}
                        onChange={(e) => setShippingData({...shippingData, pickup_time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {shippingData.delivery_method === 'delivery' && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          required
                          value={shippingData.address}
                          onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={shippingData.city}
                            onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={shippingData.state}
                            onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            required
                            value={shippingData.zip}
                            onChange={(e) => setShippingData({...shippingData, zip: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="text-blue-600 text-xl mr-3">💡</div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Payment Information</h4>
                      <p className="text-blue-700 text-sm">
                        For Cash on Delivery and Store Pickup, you'll pay when you receive your order or collect from our store. 
                        No payment is required now.
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4 mb-6">
                    {/* Show Cash on Delivery only for delivery orders */}
                    {shippingData.delivery_method === 'delivery' && (
                      <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'cod' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">💵</div>
                          <div>
                            <div className="font-semibold">Cash on Delivery</div>
                            <div className="text-sm text-gray-600">Pay when you receive your order</div>
                          </div>
                        </div>
                      </label>
                    )}

                    {/* Store Pickup - Available for both delivery and pickup orders */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'pickup' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="pickup"
                        checked={paymentMethod === 'pickup'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">🏪</div>
                        <div>
                          <div className="font-semibold">Store Pickup</div>
                          <div className="text-sm text-gray-600">Pay at store when collecting</div>
                        </div>
                      </div>
                    </label>


                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Continue to Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Order Review</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                    <p className="text-gray-700">
                      <strong>Name:</strong> {shippingData.full_name}<br />
                      <strong>Email:</strong> {shippingData.email}<br />
                      <strong>Phone:</strong> {shippingData.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                    <p className="text-gray-700">
                      <strong>Method:</strong> {shippingData.delivery_method === 'pickup' ? 'Store Pickup' : 'Home Delivery'}<br />
                      {shippingData.delivery_method === 'pickup' && (
                        <><strong>Pickup Time:</strong> {new Date(shippingData.pickup_time).toLocaleString()}<br /></>
                      )}
                      {shippingData.delivery_method === 'delivery' && (
                        <>
                          <strong>Address:</strong><br />
                          {shippingData.address}<br />
                          {shippingData.city}, {shippingData.state} {shippingData.zip}<br />
                          {shippingData.country}
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                    <div className="flex items-center">
                      {paymentMethod === 'cod' && <span className="text-2xl mr-2">💵</span>}
                      {paymentMethod === 'pickup' && <span className="text-2xl mr-2">🏪</span>}
                      <span className="text-gray-700 capitalize">
                        {paymentMethod === 'cod' && 'Cash on Delivery'}
                        {paymentMethod === 'pickup' && 'Store Pickup'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img src={item.product_image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">Rs.{item.price * item.quantity}</p>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs.{getTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Rs.{shippingCost}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>Rs.{total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage; 