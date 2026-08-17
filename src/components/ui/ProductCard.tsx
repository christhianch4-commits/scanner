'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, ShoppingCart, GitCompare, Shield, Truck, Award } from 'lucide-react';
import { Scanner, categories } from '@/data/scannersData';
import { useShopStore } from '@/stores/useShopStore';

interface ProductCardProps {
  scanner: Scanner;
}

export function ProductCard({ scanner }: ProductCardProps) {
  const { addToCart, addToComparison, comparisonList } = useShopStore();
  const isInComparison = comparisonList.includes(scanner.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-hud-dark/80 backdrop-blur-xl border border-hud-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
    >
      {/* Badge */}
      {scanner.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-primary to-secondary text-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {scanner.badge}
          </span>
        </div>
      )}

      {/* Compare Toggle */}
      <button
        onClick={() => addToComparison(scanner.id)}
        disabled={isInComparison || comparisonList.length >= 3}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
          isInComparison
            ? 'bg-primary text-background'
            : 'bg-white/10 text-gray-400 hover:bg-primary/20 hover:text-primary'
        }`}
      >
        <GitCompare className="w-4 h-4" />
      </button>

      {/* Image Area */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-50" />
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl flex items-center justify-center group-hover:from-primary/50 group-hover:to-secondary/50 transition-all"
        >
          <Zap className="w-12 h-12 text-primary" />
        </motion.div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Rating */}
        <div>
          <h3 className="font-bold text-lg text-white line-clamp-2 mb-2">{scanner.title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(scanner.rating) ? 'fill-current' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-400">({scanner.reviews})</span>
          </div>
        </div>

        {/* Features Preview */}
        <ul className="space-y-2">
          {scanner.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Protocols */}
        <div className="flex flex-wrap gap-2">
          {scanner.protocols.slice(0, 3).map((protocol, i) => (
            <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-400 border border-white/10">
              {protocol}
            </span>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="pt-4 border-t border-hud-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-primary">${scanner.price}</span>
              {scanner.supplierCost > 0 && (
                <span className="text-sm text-gray-500 line-through ml-2">${(scanner.price * 1.5).toFixed(0)}</span>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-green-400 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                {scanner.shippingDays}-Day Shipping
              </div>
              <div className="text-xs text-gray-400">
                {scanner.inStock ? 'In Stock' : 'Pre-order'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(scanner)}
              className="bg-gradient-to-r from-primary to-secondary text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              Details
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-xl" />
      </div>
    </motion.div>
  );
}

export function CategoryFilter() {
  const { selectedCategory, setCategory } = useShopStore();

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCategory(category.id)}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-primary to-secondary text-background shadow-lg shadow-primary/30'
              : 'bg-hud-dark/50 text-gray-400 border border-hud-border hover:border-primary/50 hover:text-white'
          }`}
        >
          {category.label}
        </motion.button>
      ))}
    </div>
  );
}

export function TrustBadges() {
  const badges = [
    { icon: Shield, text: '2-Year Warranty', color: 'text-primary' },
    { icon: Truck, text: 'Global Express Shipping', color: 'text-secondary' },
    { icon: Award, text: 'Authorized Dealer', color: 'text-accent' },
    { icon: Zap, text: 'Lifetime Support', color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      {badges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-4 bg-hud-dark/50 rounded-xl border border-hud-border"
        >
          <badge.icon className={`w-8 h-8 ${badge.color}`} />
          <span className="font-medium text-white">{badge.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function LiveOrderTicker() {
  const notifications = [
    'Someone in Texas bought Autel MK808S',
    'Workshop in California purchased Launch CRP919X',
    'DIYer in Florida ordered ThinkScan 689BT',
    'Professional in NY bought XTOOL N9EV',
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden lg:block">
      <AnimatePresence>
        {notifications.map((note, i) => (
          <motion.div
            key={i}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ delay: i * 3, duration: 0.5 }}
            className="bg-hud-dark/90 backdrop-blur border border-primary/30 rounded-lg px-4 py-2 mb-2 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300">{note}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
