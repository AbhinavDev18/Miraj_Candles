import { instance as razorpay } from '../utils/razorpay.js';
import { Product } from '../models/product.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const purchase = async (req, res) => {
    try {
        const { userId, productId, num } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }
        if (product.quantity < num) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        const amount = Math.round(product.price * num * 100);

        if (amount < 100) {
            return res.status(400).json({ error: "Amount must be at least ₹1" });
        }

        const options = {
            amount,
            currency: "INR",
            receipt: `order_${uuidv4().substring(0, 15)}`,
            notes: {
                productId,
                userId,
                quantity: num
            }
        };
        console.log(options);
        const razorpayOrder = await razorpay.orders.create(options);
        console.log(req.body);
        console.log(razorpayOrder);
        return res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    }
    catch (error) {
        console.error("Purchase Error:", error);
        return res.status(500).json({
            error: error.error?.description || error.message || "Something went wrong"
        });
    }
};

export { purchase };





// import { User } from '../models/user.js';
// import { sendEmail } from '../helper/mail.js';
// import { Product } from '../models/product.js';
// import { Order } from '../models/order.js';

// const purchase = async (req, res) => {
//     try {
//         const { userId, productId, num } = await req.body;
//         if (product.quantity < num) {
//             return res.status(400).json({ error: 'Insufficient stock' });
//         }
//         const product = await Product.findById(productId);
//         if(!product) return res.json({error: 'Product not found'}, {status: 400});
//         await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -num }, $inc: { sold: +num } });
//         const order = new Order({ user: userId, products: { product: productId, quantity: num } });
//         await order.save();
//         await User.findByIdAndUpdate(userId, { $push: { purchased: { product: productId, quantity: num } } }, { new: true });
//         await sendEmail({ userId, emailType: 'ORDER', orderId: order._id });
//         return res.json({message: 'Order placed successfully'});
//     }
//     catch(error) {
//         return res.status(500).json(error.message);
//     }
// }

// export { purchase };
