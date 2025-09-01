import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, HeartIcon, ShareIcon, CameraIcon, CheckCircleIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLoading } from '../context/LoadingContext';
import toast from 'react-hot-toast';

// Sample products data
const sampleProducts = [
  {
    id: 'sample1',
    name: 'Lavender Dreams Candle',
    title: 'Lavender Dreams Candle',
    description: 'A soothing lavender scented candle perfect for relaxation.',
    price: 25.99,
    category: 'Scented Candles',
    imageUrl: '/images/candles/candle-collection-1.png',
    stock: 10,
    sales: 150,
    createdAt: new Date()
  },
  {
    id: 'sample2',
    name: 'Natural Soy Wax Candle',
    title: 'Natural Soy Wax Candle',
    description: 'Eco-friendly soy wax candle with vanilla scent.',
    price: 19.50,
    category: 'Soy Wax',
    imageUrl: '/images/candles/candle-collection-2.png',
    stock: 15,
    sales: 200,
    createdAt: new Date()
  },
  {
    id: 'sample3',
    name: 'Premium Gift Set',
    title: 'Premium Gift Set',
    description: 'A curated gift set for special occasions.',
    price: 75.00,
    category: 'Gift Sets',
    imageUrl: '/images/candles/candle-collection-3.png',
    stock: 8,
    sales: 90,
    createdAt: new Date()
  },
  {
    id: 'sample4',
    name: 'Elegant Decor Candle',
    title: 'Elegant Decor Candle',
    description: 'Decorative candle perfect for home styling.',
    price: 30.00,
    category: 'Decor Candles',
    imageUrl: '/images/candles/candle-collection-4.png',
    stock: 12,
    sales: 85,
    createdAt: new Date()
  },
  {
    id: 'sample5',
    name: 'Aromatherapy Blend',
    title: 'Aromatherapy Blend',
    description: 'Therapeutic candle with essential oils for wellness.',
    price: 35.75,
    category: 'Aromatherapy',
    imageUrl: '/images/candles/candle-collection-5.png',
    stock: 20,
    sales: 180,
    createdAt: new Date()
  }
];

// Mock data for enhanced product details
const mockProductData = {
  rating: 4.5,
  totalReviews: 120,
  totalSold: '5k',
  deliveryInfo: {
    freeDelivery: true,
    estimatedDays: 3,
    returnPolicy: '7 days easy return policy',
  },
  highlights: [
    'Hand-poured with natural soy wax',
    'Infused with premium essential oils',
    'Clean, long-lasting burn',
    'Eco-friendly and sustainable',
  ],
  specifications: {
    'Material': 'Soy Wax, Cotton Wick',
    'Scent': 'Lavender & Vanilla',
    'Burn Time': '40-50 hours',
    'Weight': '250g',
    'Dimensions': '3" x 4"',
  },
  ratingBreakdown: {
    '5': 80,
    '4': 25,
    '3': 10,
    '2': 3,
    '1': 2,
  },
  reviews: [
    {
      id: 1,
      name: 'Alice Smith',
      rating: 5,
      date: '2 days ago',
      review: 'Absolutely love this candle! The scent is amazing and it burns so cleanly.',
      verified: true,
      helpful: 15,
    },
    {
      id: 2,
      name: 'Bob Johnson',
      rating: 4,
      date: '1 week ago',
      review: 'Great candle, good value for money. The packaging was also very nice.',
      verified: true,
      helpful: 8,
    },
    {
      id: 3,
      name: 'Charlie Brown',
      rating: 3,
      date: '3 weeks ago',
      review: 'It was okay, the scent was a bit too subtle for my liking.',
      verified: false,
      helpful: 2,
    },
  ],
  customerPhotos: [
    '/images/customer-photos/photo1.jpg',
    '/images/customer-photos/photo2.jpg',
    '/images/customer-photos/photo3.jpg',
    '/images/customer-photos/photo4.jpg',
  ],
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { setLoading } = useLoading();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [localWishlisted, setLocalWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // Create products with proper IDs from sample data
    const productsWithIds = sampleProducts.map((product, index) => ({
      ...product,
      id: `sample_${index + 1}`,
      createdAt: new Date()
    }));

    // Find the product by ID
    const foundProduct = productsWithIds.find(p => p.id === id);

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/products');
    }

    setLoading(false);
  }, [id, navigate, setLoading]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      toast.success(`${quantity} x ${product.title} added to cart!`);
    } else {
      toast.error('Product is out of stock!');
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const handleOrderNow = () => {
    if (product && product.stock > 0) {
      // Add to cart first
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }

      // Show success message
      toast.success('Product added to cart! Redirecting to checkout...', {
        duration: 2000,
        icon: '🛒',
      });

      // Navigate to cart/checkout
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    } else {
      toast.error('Product is out of stock!');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const renderStars = (rating: number, size = 'w-5 h-5') => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`${size} ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-w-1 aspect-h-1 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced image gallery
  const images = [
    product.imageUrl,
    '/images/candles/candle-collection-1.png',
    '/images/candles/candle-collection-2.png',
    '/images/candles/candle-collection-3.png'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-sm text-gray-500 mb-6"
        >
          <button onClick={() => navigate('/')} className="hover:text-gray-700">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/products')} className="hover:text-gray-700">Products</button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative mb-4">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-96 lg:h-[500px] object-cover object-center rounded-lg"
              />
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200"
              >
                <HeartIcon className={`w-6 h-6 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={handleShare}
                className="absolute top-4 right-16 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200"
              >
                <ShareIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Customer Photos */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Customer Photos</h3>
              <div className="grid grid-cols-4 gap-2">
                {mockProductData.customerPhotos.slice(0, 4).map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-gray-600 text-sm mb-3">Brand: Miraj Candles</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-orange-500 mr-2">{mockProductData.rating}</span>
                  <div className="flex items-center">
                    {renderStars(Math.floor(mockProductData.rating))}
                  </div>
                </div>
                <span className="text-gray-600">({mockProductData.totalReviews} reviews)</span>
                <span className="text-green-600 font-medium">{mockProductData.totalSold} sold</span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ₹{(product.price * 80).toFixed(0)}
              </div>
              <p className="text-green-600 text-sm">Inclusive of all taxes</p>
              {mockProductData.deliveryInfo.freeDelivery && (
                <p className="text-blue-600 text-sm">Free delivery</p>
              )}
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Highlights</h3>
              <ul className="space-y-2">
                {mockProductData.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TruckIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">Delivery Information</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Free delivery in {mockProductData.deliveryInfo.estimatedDays} business days
              </p>
              <p className="text-sm text-gray-600">
                {mockProductData.deliveryInfo.returnPolicy}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity and Actions */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Add to Cart
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOrderNow}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Order Now
                  </motion.button>
                </div>
              </div>
            )}

            {/* Security */}
            <div className="flex items-center text-sm text-gray-600">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Secure transaction • 100% authentic products
            </div>
          </motion.div>
        </div>

        {/* Detailed Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100"
        >
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                    selectedTab === tab
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab === 'reviews' && ` (${mockProductData.totalReviews})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                <p className="text-gray-600 leading-relaxed">
                  Our premium candles are crafted with the finest natural soy wax and essential oils,
                  providing a clean, long-lasting burn that fills your space with delightful fragrance.
                  Each candle is hand-poured in small batches to ensure quality and consistency.
                </p>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(mockProductData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="text-4xl font-bold text-gray-900 mr-4">{mockProductData.rating}</span>
                      <div>
                        <div className="flex items-center mb-1">
                          {renderStars(Math.floor(mockProductData.rating))}
                        </div>
                        <p className="text-sm text-gray-600">{mockProductData.totalReviews} global ratings</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {Object.entries(mockProductData.ratingBreakdown).reverse().map(([stars, count]) => (
                      <div key={stars} className="flex items-center mb-2">
                        <span className="text-sm text-gray-600 w-12">{stars} star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${(count / mockProductData.totalReviews) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {mockProductData.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{review.name}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">{renderStars(review.rating, 'w-4 h-4')}</div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.review}</p>
                          <button className="text-sm text-gray-500 hover:text-gray-700">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;