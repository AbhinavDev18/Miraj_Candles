import { Order } from '../models/order.js';

const orderList = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { orderList };
