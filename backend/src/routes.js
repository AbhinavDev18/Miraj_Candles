import { Router } from 'express';
import { registerUser } from './routes/register.js';
import { login } from './routes/login.js';
import { verifyEmail } from './routes/verifyEmail.js';
import { logout } from './routes/logout.js';
import { resetPassword } from './routes/resetPassword.js';
import { forgotPassword } from './routes/forgotPassword.js';
import { addToCart } from './routes/addCart.js';
import { removeFromCart } from './routes/removeCart.js';
import { insertProduct } from './admin/insertProduct.js';
import { orderList } from './admin/orders.js';
import { comments } from './routes/comments.js';
import { logData } from './routes/isLoggedin.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/verifyemail").post(verifyEmail);
router.route("/logout").get(logout);
router.route("/resetpassword").post(resetPassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/addtocart").post(addToCart);
router.route("/removefromcart").post(removeFromCart);
router.route("/insertProduct").post(upload.single('file'), insertProduct);
router.route("/orders").get(orderList);
router.route("/comments").post(comments);
router.route("/isLoggedin").get(logData);

export default router;
