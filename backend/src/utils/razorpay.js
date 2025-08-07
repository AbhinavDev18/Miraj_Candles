import Razorpay from 'razorpay';

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy123',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy123',
});

export { instance };
