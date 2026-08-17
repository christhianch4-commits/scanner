'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Zap, Shield, Truck, Star } from 'lucide-react';
import { useShopStore } from '@/stores/useShopStore';
import { scannersData } from '@/data/scannersData';

export function CartDrawer() {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, getTotalPrice, getCartCount } = useShopStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-hud-dark border-l border-primary/30 z-50 shadow-2xl shadow-primary/20"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-hud-border">
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart ({getCartCount()} items)
                </h2>
                <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-background/50 border border-hud-border rounded-xl p-4"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white line-clamp-2">{item.title}</h3>
                          <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t border-hud-border p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-2xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-primary to-secondary text-background font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all transform hover:scale-[1.02]">
                    Checkout Securely
                  </button>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Secure</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Fast Shipping</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ComparisonDrawer() {
  const { isComparisonOpen, toggleComparison, comparisonList, removeFromComparison, clearComparison } = useShopStore();
  const selectedScanners = scannersData.filter(s => comparisonList.includes(s.id));

  return (
    <AnimatePresence>
      {isComparisonOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleComparison}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-hud-dark border-t border-primary/30 z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-hud-border">
                <h2 className="text-xl font-bold text-primary">Compare Scanners ({selectedScanners.length}/3)</h2>
                <div className="flex gap-2">
                  <button onClick={clearComparison} className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    Clear All
                  </button>
                  <button onClick={toggleComparison} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto p-6">
                {selectedScanners.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Select up to 3 scanners to compare</p>
                ) : (
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="text-left p-4 text-gray-400">Feature</th>
                        {selectedScanners.map(scanner => (
                          <th key={scanner.id} className="p-4 min-w-[200px]">
                            <div className="relative">
                              <button
                                onClick={() => removeFromComparison(scanner.id)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500/20 rounded-full hover:bg-red-500/40"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-2">
                                <Zap className="w-8 h-8 text-primary" />
                              </div>
                              <p className="font-semibold text-sm">{scanner.title}</p>
                              <p className="text-primary font-bold">${scanner.price}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Category', key: 'category' },
                        { label: 'Target Audience', key: 'targetAudience' },
                        { label: 'Rating', key: 'rating', format: (v: number) => `${v} ${'★'.repeat(Math.round(v))}` },
                        { label: 'Protocols', key: 'protocols', format: (v: string[]) => v.join(', ') },
                        { label: 'Key Features', key: 'features', format: (v: string[]) => v.slice(0, 3).join(', ') },
                      ].map(row => (
                        <tr key={row.label} className="border-t border-hud-border">
                          <td className="p-4 text-gray-400 font-medium">{row.label}</td>
                          {selectedScanners.map(scanner => (
                            <td key={scanner.id} className="p-4">
                              {/* @ts-ignore */}
                              {row.format ? row.format(scanner[row.key]) : scanner[row.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
