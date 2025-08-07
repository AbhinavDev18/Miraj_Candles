import crypto from 'crypto';
import { Product } from '../models/product.js';
import { Order } from '../models/order.js';
import { User } from '../models/user.js';
import { sendEmail } from '../helper/mail.js';

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            productId,
            quantity
        } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }
        const product = await Product.findById(productId);
        if (!product || product.quantity < quantity) {
            return res.status(400).json({ error: 'Product issue during payment verification' });
        }
        await Product.findByIdAndUpdate(productId, {
            $inc: { quantity: -quantity, sold: +quantity }
        });
        const order = new Order({
            user: userId,
            products: { product: productId, quantity },
            paymentStatus: 'paid',
            paymentId: razorpay_payment_id,
            paymentMode: 'razorpay'
        });
        await order.save();
        await User.findByIdAndUpdate(userId, {
            $push: {
                purchased: { product: productId, quantity }
            }
        });
        await sendEmail({
            userId,
            emailType: 'ORDER',
            orderId: order._id
        });
        return res.json({ success: true, message: 'Payment verified and order placed' });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { verifyPayment };
