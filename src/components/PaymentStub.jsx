import React, { useState } from "react";

export default function PaymentStub({ amount, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [fail, setFail] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const simulate = (method) => {
    setLoading(true);
    setFail(false);
    setSelectedMethod(method);

    setTimeout(() => {
      const success = method === "cod" || Math.random() < 0.9;

      setLoading(false);

      if (!success) {
        setFail(true);
        return;
      }

      onSuccess({
        method,
        status: "paid",
        transactionId: "TX-" + Math.random().toString(36).slice(2, 9).toUpperCase(),
        amount: amount,
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: "bg-blue-500 hover:bg-blue-600 border-blue-500",
      description: "Pay securely with your card"
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "bg-purple-500 hover:bg-purple-600 border-purple-500",
      description: "Instant payment using UPI apps"
    },
    {
      id: "cod",
      name: "Cash on Service",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: "bg-green-500 hover:bg-green-600 border-green-500",
      description: "Pay cash when service is delivered"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h3>
        <div className="text-3xl font-bold text-green-600 mb-1">₹{amount}</div>
        <p className="text-gray-500 text-sm">Secure and encrypted payment</p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => simulate(method.id)}
            disabled={loading}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.02]'}
              ${selectedMethod === method.id ? method.color.replace('hover:', '') + ' text-white' : 'border-gray-200 text-gray-700 hover:border-gray-300'}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${selectedMethod === method.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
                {method.icon}
              </div>
              <div className="text-left">
                <div className="font-semibold">{method.name}</div>
                <div className="text-sm opacity-75">{method.description}</div>
              </div>
            </div>
            {selectedMethod === method.id && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-semibold text-blue-700">Processing Payment</span>
            </div>
            <div className="text-sm text-blue-600 font-medium">
              {selectedMethod === 'card' && 'Verifying card...'}
              {selectedMethod === 'upi' && 'Opening UPI app...'}
              {selectedMethod === 'cod' && 'Confirming order...'}
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {fail && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-shake">
          <div className="flex items-center space-x-2 text-red-700">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-semibold">Payment Failed!</div>
              <div className="text-sm">Please try again or use another payment method.</div>
            </div>
          </div>
          <button
            onClick={() => setFail(false)}
            className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Security Badge */}
      <div className="text-center pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>100% Secure & Encrypted</span>
        </div>
      </div>
    </div>
  );
}