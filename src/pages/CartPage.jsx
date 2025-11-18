// import React from "react";
// import { useCart } from "../context/CartContext";
// import { Link } from "react-router-dom";

// export default function CartPage() {
//   const { state, dispatch } = useCart();

//   const subtotal = state.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

//   const remove = (it) =>
//     dispatch({ type: "REMOVE", payload: { id: it.id, variant: it.variant } });

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//       {state.items.length === 0 ? (
//         <p>
//           Your cart is empty. <Link to="/">Browse services</Link>
//         </p>
//       ) : (
//         <>
//           <div className="space-y-3">
//             {state.items.map((it) => (
//               <div
//                 key={`${it.id}-${it.variant}`}
//                 className="flex items-center justify-between p-3 border rounded"
//               >
//                 <div>
//                   <div className="font-semibold">
//                     {it.title} <span className="text-sm">({it.variant})</span>
//                   </div>
//                   <div className="text-sm mt-1">
//                     Qty:{" "}
//                     <input
//                       type="number"
//                       min={1}
//                       value={it.qty}
//                       onChange={(e) =>
//                         dispatch({
//                           type: "UPDATE",
//                           payload: { id: it.id, variant: it.variant, qty: Number(e.target.value) },
//                         })
//                       }
//                       className="w-20 border p-1 rounded"
//                     />
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <div className="font-bold">₹{it.qty * it.unitPrice}</div>
//                   <button
//                     onClick={() => remove(it)}
//                     className="text-sm text-red-600 mt-2"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 flex justify-between items-center">
//             <div className="text-lg font-bold">Subtotal: ₹{subtotal}</div>
//             <Link to="/checkout" className="px-4 py-2 bg-blue-600 text-white rounded">
//               Proceed to Checkout
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const subtotal = state.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  const totalItems = state.items.reduce((total, item) => total + item.qty, 0);

  const removeItem = (item) =>
    dispatch({ type: "REMOVE", payload: { id: item.id, variant: item.variant } });

  const updateQuantity = (item, newQty) => {
    if (newQty < 1) return;
    dispatch({
      type: "UPDATE",
      payload: { id: item.id, variant: item.variant, qty: newQty },
    });
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch({ type: "CLEAR" });
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added any services to your cart yet. Explore our services and find what you need!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9" />
                </svg>
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </span>
              <button
                onClick={clearCart}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add More Services
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={`${item.id}-${item.variant}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg truncate">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Variant: <span className="font-medium">{item.variant}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <span className="w-12 text-center font-semibold text-gray-800">
                            {item.qty}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item, item.qty + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{item.qty * item.unitPrice}
                        </div>
                        <div className="text-sm text-gray-600">
                          ₹{item.unitPrice} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Summary Items */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  
                  {/* Discount Code (Optional) */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Discount code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-800">Total Amount</span>
                    <span className="text-2xl text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Proceed to Checkout
                </button>

                {/* Security Badge */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure & Encrypted Checkout</span>
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