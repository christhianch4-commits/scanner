'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ShoppingCart, GitCompare, Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopStore } from '@/stores/useShopStore';
import { scannersData, categories } from '@/data/scannersData';
import { ProductCard, CategoryFilter, TrustBadges, LiveOrderTicker } from '@/components/ui/ProductCard';
import { CartDrawer, ComparisonDrawer } from '@/components/ui/Drawers';
import { DiagnosticMatcher } from '@/components/ui/DiagnosticMatcher';

// Dynamic import for 3D canvas to avoid SSR issues
const ScannerHeroCanvas = dynamic(() => import('@/components/3d/ScannerHeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-0">
      <div className="text-primary text-xl">Loading 3D Experience...</div>
    </div>
  ),
});

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, toggleComparison, getCartCount, comparisonList, selectedCategory } = useShopStore();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? scannersData
    : scannersData.filter(s => s.category === selectedCategory);

  return (
    <main className="relative min-h-screen">
      {/* 3D Background Canvas */}
      <ScannerHeroCanvas />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-hud-dark/90 backdrop-blur-lg border-b border-hud-border' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <span className="text-xl font-bold text-gradient">OBD2 PRO</span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#products" className="text-gray-300 hover:text-primary transition-colors">Products</a>
              <a href="#compare" className="text-gray-300 hover:text-primary transition-colors">Compare</a>
              <a href="#support" className="text-gray-300 hover:text-primary transition-colors">Support</a>
              <a href="#about" className="text-gray-300 hover:text-primary transition-colors">About</a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleComparison}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <GitCompare className="w-5 h-5" />
                {comparisonList.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-xs font-bold rounded-full flex items-center justify-center">
                    {comparisonList.length}
                  </span>
                )}
              </button>
              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <CartCountBadge />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 bg-hud-dark z-30 md:hidden border-b border-hud-border"
          >
            <div className="p-6 space-y-4">
              <a href="#products" className="block text-gray-300 hover:text-primary">Products</a>
              <a href="#compare" className="block text-gray-300 hover:text-primary">Compare</a>
              <a href="#support" className="block text-gray-300 hover:text-primary">Support</a>
              <a href="#about" className="block text-gray-300 hover:text-primary">About</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-6">
              🔥 Professional Grade Diagnostic Tools
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Next-Gen{' '}
              <span className="text-gradient">OBD2 Scanners</span>
              <br />
              for Modern Vehicles
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Professional automotive diagnostic tools with EV/Hybrid support, 
              Chinese brand coverage, and bidirectional control. Trusted by 50,000+ technicians worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="#products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                Shop All Scanners
              </motion.a>
              <motion.a
                href="#quiz"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                Find My Perfect Scanner
              </motion.a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '100%', label: 'Authentic Products' },
              { value: '2-Year', label: 'Warranty' },
              { value: '24/7', label: 'Expert Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <TrustBadges />
        </div>
      </section>

      {/* Diagnostic Matcher Quiz */}
      <section id="quiz" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Find Your <span className="text-gradient">Perfect Scanner</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Answer 3 quick questions and we'll recommend the ideal diagnostic tool for your needs
            </p>
          </motion.div>
          <DiagnosticMatcher />
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Premium <span className="text-gradient">Diagnostic Tools</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Professional-grade OBD2 scanners for every need and budget
            </p>
            <CategoryFilter />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((scanner) => (
              <ProductCard key={scanner.id} scanner={scanner} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison CTA */}
      <section id="compare" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/30 rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              Compare & Choose <span className="text-gradient">Wisely</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Select up to 3 scanners to compare features, protocols, and pricing side-by-side
            </p>
            <motion.button
              onClick={toggleComparison}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-bold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Open Comparison Tool ({comparisonList.length}/3 selected)
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hud-border py-12 relative z-10 bg-hud-dark/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-background" />
                </div>
                <span className="text-lg font-bold">OBD2 PRO</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional automotive diagnostic tools for technicians and enthusiasts worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary">All Scanners</a></li>
                <li><a href="#" className="hover:text-primary">EV/Hybrid Tools</a></li>
                <li><a href="#" className="hover:text-primary">Mobile Dongles</a></li>
                <li><a href="#" className="hover:text-primary">Key Programmers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Shipping Info</a></li>
                <li><a href="#" className="hover:text-primary">Returns</a></li>
                <li><a href="#" className="hover:text-primary">Warranty</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-hud-border pt-8 text-center text-gray-500 text-sm">
            © 2024 OBD2 Scanner Pro. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Drawers */}
      <CartDrawer />
      <ComparisonDrawer />
      
      {/* Live Order Ticker */}
      <LiveOrderTicker />
    </main>
  );
}

// Cart count badge component
function CartCountBadge() {
  const count = useShopStore((state) => state.getCartCount());
  
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-xs font-bold rounded-full flex items-center justify-center">
      {count}
    </span>
  );
}
