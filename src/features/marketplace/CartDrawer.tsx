import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Smartphone, CheckCircle, ShieldCheck, ArrowRight, WifiOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { LazyImage } from '../../components/common/LazyImage';
import { databaseService } from '../../services/supabaseClient';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotalKes,
    formatPrice,
    queueOfflineOrder,
  } = useAppStore();

  const isOnline = useOnlineStatus();
  const [phoneNumber, setPhoneNumber] = useState('0712 345 678');
  const [paymentProvider, setPaymentProvider] = useState<'mpesa' | 'airtel' | 'card'>('mpesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<null | { id: string; isOffline: boolean }>(null);

  if (!isCartOpen) return null;

  const totalKes = getCartTotalKes();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (!isOnline) {
        queueOfflineOrder(cart, totalKes);
        const orderId = `DALA-${Math.floor(100000 + Math.random() * 900000)}`;
        const firstStall = cart[0]?.item.stallName || 'Dala Merchant';
        databaseService.simulateRealtimeTransaction(firstStall, totalKes, 'consumer_cart_checkout');
        clearCart();
        setOrderComplete({ id: orderId, isOffline: false });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside aria-label="Shopping Cart Drawer" className="w-screen max-w-md bg-white border-l border-stone-200 text-stone-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-heading text-stone-900">Your Street Basket</h2>
                <p className="text-xs text-stone-500">
                  {cart.length === 0 ? 'Empty basket' : `${cart.length} unique storefront item(s)`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {orderComplete ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-stone-900">
                    {orderComplete.isOffline ? 'Queued for Offline Sync' : 'STK Push Prompt Dispatched!'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                    {orderComplete.isOffline
                      ? 'Your order is saved locally. As soon as connectivity returns, your M-Pesa prompt will be initiated.'
                      : `Check your phone (${phoneNumber}) and enter your M-Pesa PIN to complete checkout for order #${orderComplete.id}.`}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span>Transaction Code</span>
                    <span className="font-mono text-emerald-700 font-bold">{orderComplete.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span className="font-bold text-stone-900">{formatPrice(totalKes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storefront Settlement</span>
                    <span className="text-stone-700 font-medium">Instant M-Pesa Split</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOrderComplete(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition"
                >
                  Continue Street Exploration
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-stone-800">Your basket is empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Walk down Retail Avenue or Hospitality Hills and peek inside stalls to add goods.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition"
                >
                  Browse Storefronts
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="flex gap-3 p-3 rounded-2xl bg-stone-50/80 border border-stone-200"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-stone-200">
                        <LazyImage
                          src={cartItem.item.thumbnail}
                          alt={cartItem.item.title}
                          aspectRatio="aspect-square"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-amber-700 font-bold block truncate">
                          {cartItem.item.stallName}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 truncate">{cartItem.item.title}</h4>
                        <p className="text-xs font-extrabold text-stone-900 mt-0.5 font-mono">
                          {formatPrice(cartItem.item.priceKes * cartItem.quantity)}
                        </p>
                        {cartItem.bookingDate && (
                          <p className="text-[10px] text-sky-700 font-semibold mt-0.5">📅 {cartItem.bookingDate}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-0.5">
                            <button
                              onClick={() => updateCartQuantity(cartItem.item.id, -1)}
                              className="p-1 rounded text-stone-500 hover:text-stone-900 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1.5 text-stone-900">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(cartItem.item.id, 1)}
                              className="p-1 rounded text-stone-500 hover:text-stone-900 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(cartItem.item.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* East Africa Payment Gateway */}
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">Mobile Money Gateway</span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Daraja Secured
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentProvider('mpesa')}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        paymentProvider === 'mpesa'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">M-PESA</span>
                      <span className="text-[9px] text-stone-500">STK Push</span>
                    </button>
                    <button
                      onClick={() => setPaymentProvider('airtel')}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        paymentProvider === 'airtel'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">Airtel</span>
                      <span className="text-[9px] text-stone-500">Money</span>
                    </button>
                    <button
                      onClick={() => setPaymentProvider('card')}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        paymentProvider === 'card'
                          ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">Card</span>
                      <span className="text-[9px] text-stone-500">Visa / Master</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      {paymentProvider === 'mpesa' ? 'Safaricom M-Pesa Phone Number' : 'Billing Number / Phone'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712 345 678"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                      />
                      <Smartphone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  {!isOnline && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      <WifiOff className="w-4 h-4 flex-shrink-0 text-amber-600" />
                      <span>Offline: Order will queue and trigger prompt once online.</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer with Total and Pay Button */}
          {!orderComplete && cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">{formatPrice(totalKes)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Processing & Virtual Kiosk Tax</span>
                  <span className="text-emerald-700 font-bold">Waived</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Due</span>
                  <span className="text-amber-700 font-mono text-base">{formatPrice(totalKes)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-stone-950 text-xs font-black shadow-md transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>
                  {isProcessing
                    ? 'Transmitting STK Prompt...'
                    : !isOnline
                    ? 'Queue Offline Checkout'
                    : `Pay ${formatPrice(totalKes)} with M-Pesa`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
