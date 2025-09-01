import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/mongodb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import cookieParser from "cookie-parser";
// const { default: User } = await import('./models/User.js');
import { sendEmail } from './lib/mail.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5001', 'https://*.replit.dev', 'https://*.repl.co'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Miraj Candles Server is running with MongoDB!' });
});

app.post('/api/login', async (req, res) => {
  try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(400).json({
                error: "User does not exists"
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(404).json({error: "Invalid password"});
        }
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        };
        return res.status(200).cookie('token', token, options).json({user: tokenData, message: "User logged in successfully"});
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

app.post('/api/register', async (req, res) => {
      try {
          const { email, name, password, phone } = req.body;
          if(
              [name, email, password].some((field) => field?.trim() === "")
          ) {
              throw new Error("All fields are required");
          }

          const existedUser = await User.findOne({
              $or: [ { name }, { email } ]
          });

          if(existedUser) {
              throw new Error("user already exists");
          }
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash(password, salt);
          const user = await User.create({
              name,
              email,
              phone,
              password: hashedPassword,
              isVerified: false
          });
          const createdUser = await User.findById(user._id).select("-password");
          await sendEmail({ email, emailType: 'VERIFY', userId: createdUser._id  });
          return res.status(201).json({
              message: 'User created successfully, verify your email',
              success: true,
              user: createdUser,
          });
      }
      catch(error) {
          return res.status(500).json({error: error.message});
      }
});

app.get('/api/logout', async (req, res) => {
  try {
        const options = {
            httpOnly: true,
            secure: true
        };
        return res.status(200).cookie('token', '', options).json({message: 'User logged out successfully'});
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
})

app.get('/api/isLoggedin', async (req, res) => {
  try {
        const token = req.cookies.token;
        if(!token) return res.status(400).json({error: 'User not logged in'});
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        return res.status(200).json({ user });
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({error: 'User not found'});
        await sendEmail({ email, emailType: 'RESET', userId: user._id });
        return res.status(200).json({message: 'Reset password email sent'});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
});

app.post('/api/reset-password', async (req, res) => {
  try {
          const { email, password, otp } = await req.body;
          const user = await User.findOne({ email });
          if(!user) return res.status(400).json({error: 'User not found'});
          if(otp === user.verifyOTP) {
              user.isVerified = true;
              user.verifyOTP = null;
              user.verifyOTPExpiry = null;
              user.verifyToken = null;
              user.verifyTokenExpiry = null;
              const salt = await bcrypt.genSalt(12);
              const hashedPassword = await bcrypt.hash(password, salt);
              user.password = hashedPassword;
              await user.save();
              return res.status(200).json({message: 'Password reset successfully', user: user});
          }
          return res.status(400).json({message: 'Invalid OTP'});
      }
      catch(error) {
          return res.status(500).json(error.message);
      }
});

app.post('/api/verify-email', async (req, res) => {
  try {
          const { email, otp } = req.body;
          console.log(email + otp);
          const user = await User.findOne(
              { email, verifyOTP: otp, verifyOTPExpiry: { $gt: Date.now() }
          });
          if(!user) return res.status(400).json({error: 'User not found'});
          if(otp === user.verifyOTP) {
              user.isVerified = true,
              user.verifyOTP = null,
              user.verifyOTPExpiry = null,
              user.verifyToken = null,
              user.verifyTokenExpiry = null,
              await user.save();
              return res.status(200).json({message: 'Email verified successfully', user: user});
          }
          return res.status(200).json({message: 'Invalid OTP'});
      }
      catch(error) {
          return res.status(500).json(error.message);
      }
});

app.get('/api/products', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const orders = await Order.find({}).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: 'Failed to create user' });
  }
});

connectToDatabase()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on the port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
})

