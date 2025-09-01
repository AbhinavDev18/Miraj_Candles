
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CandleSubcategories: React.FC = () => {
  const navigate = useNavigate();

  const subcategories = [
    {
      name: 'Scented Candles',
      image: '/images/candles/candle-collection-1.png',
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
      description: 'Luxurious fragrances for every mood and occasion',
      icon: '🌸',
      productCount: 25
    },
    {
      name: 'Soy Wax',
      image: '/images/candles/candle-collection-2.png',
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      description: 'Natural and eco-friendly candle options',
      icon: '🌿',
      productCount: 18
    },
    {
      name: 'Decor Candles',
      image: '/images/candles/candle-collection-3.png',
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      description: 'Beautiful designs for home styling',
      icon: '🏠',
      productCount: 20
    },
    {
      name: 'Aromatherapy',
      image: '/images/candles/candle-collection-4.png',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      description: 'Therapeutic scents for wellness and relaxation',
      icon: '💧',
      productCount: 15
    },
    {
      name: 'Luxury Collection',
      image: '/images/candles/candle-collection-5.png',
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      description: 'Premium handcrafted luxury candles',
      icon: '✨',
      productCount: 8
    },
    {
      name: 'Gift Sets',
      image: '/images/candles/candle-collection-10.jpg',
      color: 'bg-gradient-to-br from-red-400 to-red-600',
      description: 'Curated candle gift sets for special occasions',
      icon: '🎁',
      productCount: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-orange-200 mb-6 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Candle Categories
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Explore our complete range of candle collections, each crafted with love and attention to detail
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.name}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform perspective-1000"
              >
                <Link to={`/products?category=${subcategory.name.toLowerCase().replace(' ', '-')}`}>
                  <div className={`${subcategory.color} h-48 relative`}>
                    <motion.div 
                      className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-500"
                      whileHover={{ background: "linear-gradient(45deg, rgba(0,0,0,0.1), rgba(255,255,255,0.1))" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="text-6xl transform group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 360,
                          transition: { duration: 0.8 }
                        }}
                      >
                        {subcategory.icon}
                      </motion.div>
                    </div>
                    <motion.div
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: 20, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-white bg-opacity-20 rounded-full p-2">
                        <ArrowRightIcon className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="p-6">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {subcategory.name}
                    </motion.h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {subcategory.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {subcategory.productCount} products
                      </span>
                      <motion.span 
                        className="text-orange-500 font-medium group-hover:text-orange-600 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        Explore →
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CandleSubcategories;
