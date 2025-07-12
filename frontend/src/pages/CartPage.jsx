import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-600">Your cart is empty.</p>
        <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map(item => (
            <div key={item.id} className="flex items-center border-b py-4">
              <img src={item.product_image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">Rs.{item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs.{getTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Rs.50</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>Rs.{getTotal() + 50}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage; 