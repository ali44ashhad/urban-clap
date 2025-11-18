import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartSidebar({ onClose }) {
  const { state } = useCart();

  // Calculate total
  const totalAmount = state.items.reduce((total, item) => total + (item.qty * item.unitPrice), 0);
  const totalItems = state.items.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9" />
            </svg>
            Your Cart
            {totalItems > 0 && (
              <span className="bg-blue-600 text-white text-sm rounded-full px-2 py-1 min-w-6 h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some items to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div
                    key={`${item.id}-${item.variant}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                  >
                    {/* Item Image (if available) */}
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        Variant: {item.variant}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm font-medium text-gray-700">
                          Qty: {item.qty}
                        </div>
                        <div className="text-sm font-bold text-blue-600">
                          ₹{item.qty * item.unitPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-700">Total:</span>
                <span className="text-green-600">₹{totalAmount}</span>
              </div>

              {/* Free Shipping Message */}
              {totalAmount < 500 && (
                <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                  Add ₹{500 - totalAmount} more for free shipping!
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  View Full Cart
                </Link>
                
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Checkout Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}