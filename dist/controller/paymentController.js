"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOrderListPayment = exports.verifyPayment = exports.makeListPayment = exports.makePayment = void 0;
const mainError_1 = require("../error/mainError");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const paymentModel_1 = __importDefault(require("../model/paymentModel"));
const userMode_1 = __importDefault(require("../model/userMode"));
const orderModel_1 = __importDefault(require("../model/orderModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
const listModel_1 = __importDefault(require("../model/listModel"));
dotenv_1.default.config();
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, email } = req.body;
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
                "Content-Type": "application/json",
            },
        };
        const url = `https://api.paystack.co/transaction/initialize`;
        const params = JSON.stringify({
            email,
            amount: `${parseInt(amount) * 100}`,
            callback_url: `https://boundary-market1.web.app/verify-payment`,
            // callback_url: `http://localhost:5173/verify-payment`,
            metadata: {
                cancel_action: "https://boundary-market1.web.app/product",
                // cancel_action: "http://localhost:5173/product",
            },
        });
        const result = yield axios_1.default.post(url, params, config).then((res) => {
            return res.data.data;
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "sucessfully make payment",
            data: result,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error making payment ${error}`,
        });
    }
});
exports.makePayment = makePayment;
const makeListPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, email } = req.body;
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
                "Content-Type": "application/json",
            },
        };
        const url = `https://api.paystack.co/transaction/initialize`;
        const params = JSON.stringify({
            email,
            amount: `${parseInt(amount) * 100}`,
            callback_url: `https://boundary-market1.web.app/verify-payment`,
            // callback_url: `http://localhost:5173/list-verify-payment`,
            metadata: {
                cancel_action: "https://boundary-market1.web.app/product",
                // cancel_action: "http://localhost:5173/add-list",
            },
        });
        const result = yield axios_1.default.post(url, params, config).then((res) => {
            return res.data.data;
        });
        return res.status(mainError_1.HTTP.CREATED).json({
            message: "sucessfully make payment",
            data: result,
        });
    }
    catch (error) {
        return res.status(mainError_1.HTTP.BAD_REQUEST).json({
            message: `error making payment ${error}`,
        });
    }
});
exports.makeListPayment = makeListPayment;
// export const makePayments = async (req: Request, res: Response) => {
//   try {
//     const { amount, email, productIDs } = req.body;
//     // Validate product IDs
//     if (!Array.isArray(productIDs) || productIDs.length === 0) {
//       return res.status(400).json({
//         message: "Invalid product IDs",
//       });
//     }
//     // Find products
//     const products = await productModel.find({ _id: { $in: productIDs } });
//     if (products.length === 0) {
//       return res.status(404).json({
//         message: "Products not found",
//       });
//     }
//     // Process each product
//     for (const product of products) {
//       // Find the owner of the product
//       const owner = await userMode.findById(product.userID);
//       if (!owner) {
//         console.error(`Owner not found for product ${product._id}`);
//         continue;
//       }
//       if (!owner.subAccountCode) {
//         console.error(`Owner ${owner.email} does not have a subaccount code`);
//         continue;
//       }
//       // Calculate earnings for the owner
//       const ownerEarnings = product.amount;
//       // Create payment object
//       const payment = {
//         email: owner.email,
//         amount: ownerEarnings * 100,
//         subaccount: owner.subAccountCode,
//       };
//       console.log(`Payment for ${owner.email}:`, payment);
//       // Process payment
//       const paystackKey = process.env.PAYSTACKKEY;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${paystackKey}`,
//           "Content-Type": "application/json",
//         },
//       };
//       const params = {
//         ...payment,
//         callback_url: `https://boundary-market1.web.app/verify-payment`,
//         metadata: {
//           cancel_action: `https://boundary-market1.web.app/product`,
//           product_ids: productIDs,
//         },
//       };
//       const url = "https://api.paystack.co/transaction/initialize";
//       try {
//         const result = await axios.post(url, params, config);
//         console.log(`Payment result for ${owner.email}:`, result.data);
//       } catch (error: any) {
//         console.error(
//           `Paystack API Error for ${owner.email}:`,
//           error.response?.data
//         );
//         return res.status(500).json({
//           message: `Error processing payment for ${payment.email}: ${error.message}`,
//         });
//       }
//     }
//     return res.status(201).json({
//       message: "Successfully made payment",
//     });
//   } catch (error: any) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       message: `Error processing payment: ${error.message}`,
//     });
//   }
// };
// export const verifyPayment = async (req: Request, res: Response) => {
//   try {
//     const { refNumb, amount, email, userID } = req.body;
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;
//     const user = await userMode.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     //check for duplcate
//     const checkDuplicate = await paymentModel.findOne({ refNumb });
//     if (checkDuplicate) {
//       return res.status(404).json({
//         message: "Duplicate reference id",
//       });
//     }
//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });
//     console.log(result);
//     // Save payment data to database
//     // const session = await startSession();
//     // const paymentData = new paymentModel({
//     //   refNumb,
//     //   email,
//     //   address: user?.address,
//     //   phoneNumb: user?.telNumb,
//     //   amount: result?.amount / 100,
//     //   status: result?.status,
//     //   user: user._id,
//     //   // QTYOrder,
//     // });
//     // paymentData?.users?.push(new Types.ObjectId(userID?._id));
//     // await paymentData.save();
//     // // user?.payments.push(new Types.ObjectId(paymentData?._id))
//     // // console.log(paymentData);
//     // const order = new orderModel({
//     //   productOwner: user?.name,
//     //   amount: paymentData.amount,
//     //   address: user?.address,
//     //   phoneNumb: paymentData?.phoneNumb,
//     //   amountPaid: paymentData?.amount,
//     //   QTYOrder: paymentData?.QTYOrder,
//     //   status: paymentData?.status,
//     //   user: user?._id, // Associate order with user
//     // });
//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }
//     // Save payment data to database
//     const paymentData = new paymentModel({
//       refNumb,
//       email,
//       address: user.address,
//       phoneNumb: user.telNumb,
//       amount: result.amount / 100,
//       status: result.status,
//       user: user._id,
//     });
//     await paymentData.save();
//     // Create order
//     const order = new orderModel({
//       productOwner: user.name,
//       amount: paymentData.amount,
//       address: user.address,
//       phoneNumb: paymentData.phoneNumb,
//       amountPaid: paymentData.amount,
//       status: paymentData.status,
//       user: user._id,
//     });
//     await order.save();
//     // Update user document with new order ID
//     await userMode.findByIdAndUpdate(user._id, {
//       $addToSet: { orders: order._id },
//     });
//     // order?.users?.push(new Types.ObjectId(user?._id));
//     // await order.save();
//     // Update user document with new order ID
//     // await userMode.findByIdAndUpdate(user?._id, {
//     //   $addToSet: { orders: order._id },
//     // });
//     return res.status(HTTP.CREATED).json({
//       message: "ur payment is successful",
//       data: result,
//     });
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error making payment ${error?.message}`,
//     });
//   }
// };
// try {
//   const { refNumb, amount, email, userID } = req.body;
//   const config = {
//     headers: {
//       Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//       "Content-Type": "application/json",
//     },
//   };
//   const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;
//   const user = await userMode.findOne({ email });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   // Check for duplicate reference ID
//   const checkDuplicate = await paymentModel.findOne({ refNumb });
//   if (checkDuplicate) {
//     return res.status(404).json({ message: "Duplicate reference ID" });
//   }
//   // const subaccountCode = user?.subAccountCode;
//   // const params = {
//   //   email: user.email,
//   //   amount: parseInt(amount) * 100,
//   //   subaccount: subaccountCode,
//   // };
//   const result = await axios.get(url, config).then((res) => {
//     return res.data.data;
//   });
//   // Validate payment data
//   if (!result || result.status !== "success") {
//     return res.status(400).json({ message: "Invalid payment data" });
//   }
//   // Generate unique delivery code
//   let deliveryCode;
//   do {
//     deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();
//   } while (await orderModel.findOne({ deliveryCode }));
//   // Save payment data to database
//   const paymentData = new paymentModel({
//     refNumb,
//     email,
//     address: user.address,
//     phoneNumb: user?.telNumb,
//     amount: result.amount / 100,
//     status: result.status,
//     user: user._id,
//     customerCode: deliveryCode,
//   });
//   await paymentData.save();
//   console.log(paymentData);
//   // Create order
//   const order = new orderModel({
//     productOwner: user.name,
//     amount: paymentData.amount,
//     address: user.address,
//     phoneNumb: paymentData.phoneNumb,
//     amountPaid: paymentData.amount,
//     status: paymentData.status,
//     user: user._id,
//     customerCode: paymentData?.customerCode,
//   });
//   await order.save();
//   console.log(order);
//   // Update user document with payment and order IDs
//   await userMode.findByIdAndUpdate(user._id, {
//     $addToSet: {
//       payments: paymentData._id,
//       orders: order._id,
//     },
//   });
//   return res.status(201).json({
//     message: "Payment successful",
//     data: result.data,
//     order: order,
//   });
// } catch (error: any) {
//   console.error(error);
//   return res.status(400).json({
//     message: `Error making payment: ${error.message}`,
//   });
// }
// };
// export const initializeSplitPayment = async (req: Request, res: Response) => {
//   try {
//     const paystackKey = process.env.PAYSTACKKEY;
//     const config = {
//       headers: {
//         Authorization: `Bearer ${paystackKey}`,
//       },
//     };
//     const { userID } = req.params;
//     const { amount } = req.body;
//     const user = await userMode.findById(userID);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const subaccountCode = user?.subAccountCode;
//     const params = {
//       email: user.email,
//       amount: parseInt(amount) * 100,
//       subaccount: subaccountCode,
//     };
//     const url = `https://api.paystack.co/transaction/initialize`;
//     const response = await axios.post(url, params, config);
//     return res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Failed to initialize split payment" });
//   }
// };
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refNumb, amount, email, productIDs, quantities } = req.body;
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
                "Content-Type": "application/json",
            },
        };
        const url = `https://api.paystack.co/transaction/verify/${refNumb}`;
        const user = yield userMode_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check for duplicate reference ID
        const checkDuplicate = yield paymentModel_1.default.findOne({ refNumb });
        if (checkDuplicate) {
            return res.status(404).json({ message: "Duplicate reference ID" });
        }
        const result = yield axios_1.default.get(url, config).then((res) => {
            return res.data.data;
        });
        // Validate payment data
        if (!result || result.status !== "success") {
            return res.status(400).json({ message: "Invalid payment data" });
        }
        // Find products
        const products = yield productModel_1.default.find({ _id: { $in: productIDs } });
        // Split payment among product owners
        const splitPayments = yield Promise.all(products.map((product, index) => __awaiter(void 0, void 0, void 0, function* () {
            const owner = yield userMode_1.default.findById(product.userID);
            if (!owner || !owner.subAccountCode) {
                throw new Error(`Owner or subaccount code not found for product ${product._id}`);
            }
            const quantity = quantities[index];
            if (typeof quantity !== "number" || quantity <= 0) {
                throw new Error(`Invalid quantity for product ${product._id}`);
            }
            const productAmount = product.amount * quantity;
            if (isNaN(productAmount)) {
                throw new Error(`Invalid product amount for product ${product._id}`);
            }
            // Return split payment details
            return {
                subaccount: owner.subAccountCode,
                amount: productAmount,
                platformFee: productAmount * 0.1, // 10% platform fee
            };
        })));
        //give customer unique code
        function generateOrderCode(length = 8) {
            let code = "";
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            for (let i = 0; i < length; i++) {
                if (i % 2 === 0) {
                    code += letters.charAt(Math.floor(Math.random() * letters.length));
                }
                else {
                    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
                }
            }
            return code;
        }
        const customerCode = generateOrderCode(8);
        // Save payment data to database
        const paymentData = new paymentModel_1.default({
            refNumb,
            email,
            address: user === null || user === void 0 ? void 0 : user.address,
            phoneNumb: user === null || user === void 0 ? void 0 : user.telNumb,
            amount: (result === null || result === void 0 ? void 0 : result.amount) / 100,
            status: result === null || result === void 0 ? void 0 : result.status,
            user: user === null || user === void 0 ? void 0 : user._id,
            splitPayments: splitPayments,
            customerCode: customerCode,
        });
        yield paymentData.save();
        // Create order
        // const order = new orderModel({
        //   title: "Order", // Required field
        //   productOwner: user.name,
        //   status: "pending",
        //   phoneNumb: paymentData.phoneNumb,
        //   img: "", // Required field
        //   totalAmount: amount,
        //   amountPaid: amount,
        //   QTYOrder: quantities.reduce((acc: number, quantity: number) => {
        //     return acc + quantity;
        //   }, 0),
        //   address: user.address,
        //   date: new Date(),
        //   category: "", // Required field
        //   productDetails: products.map((product, index) => {
        //     const splitPayment = splitPayments.find(
        //       (split) => split?.subaccount === product.userID
        //     );
        //     return {
        //       productID: product._id,
        //       quantity: quantities[index],
        //       amount: product.amount * quantities[index],
        //       platformFee: splitPayment?.platformFee ?? 0,
        //       amountAfterFee: splitPayment?.amount ?? 0,
        //     };
        //   }),
        //   users: user._id,
        //   payments: [paymentData._id],
        //   splitPayments: paymentData?.splitPayments,
        // });
        // // Update user document with payment and order IDs
        // await userMode.findByIdAndUpdate(user._id, {
        //   $addToSet: {
        //     payments: paymentData._id,
        //     orders: order._id,
        //   },
        // });
        // Create order
        const order = new orderModel_1.default({
            title: "Order", // Required field
            productOwner: user.name,
            status: paymentData === null || paymentData === void 0 ? void 0 : paymentData.status,
            phoneNumb: paymentData.phoneNumb,
            img: "", // Required field
            totalAmount: amount,
            amountPaid: amount,
            customerCode: paymentData === null || paymentData === void 0 ? void 0 : paymentData.customerCode,
            // QTYOrder: quantities.reduce((acc: number, quantity: number) => {
            //   return acc + quantity;
            // }, 0),
            address: user.address,
            date: new Date(),
            category: "", // Required field
            productDetails: products.map((product, index) => {
                var _a, _b;
                const splitPayment = splitPayments.find((split) => (split === null || split === void 0 ? void 0 : split.subaccount) === product.userID);
                return {
                    productID: product._id,
                    quantity: quantities[index],
                    amount: product.amount * quantities[index],
                    platformFee: (_a = splitPayment === null || splitPayment === void 0 ? void 0 : splitPayment.platformFee) !== null && _a !== void 0 ? _a : 0,
                    amountAfterFee: (_b = splitPayment === null || splitPayment === void 0 ? void 0 : splitPayment.amount) !== null && _b !== void 0 ? _b : 0,
                };
            }),
            users: user._id,
            payments: [paymentData._id],
            splitPayments: paymentData === null || paymentData === void 0 ? void 0 : paymentData.splitPayments,
        });
        // Save order to database
        yield order.save();
        // Update user document with payment and order IDs
        yield userMode_1.default.findByIdAndUpdate(user._id, {
            $addToSet: {
                payments: paymentData._id,
                orders: order._id,
            },
        });
        return res.status(201).json({
            message: "Payment successful",
            paystackData: result, // Paystack transaction data
            splitPayments: paymentData.splitPayments, // Split payment data
            order: order,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: `Error making payment: ${error.message}`,
        });
    }
});
exports.verifyPayment = verifyPayment;
const verifyOrderListPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lists, customerCode, refNumb, email, userID, totalAmount } = req.body;
        if (!lists || !Array.isArray(lists)) {
            return res.status(400).json({ message: "Invalid lists array" });
        }
        const user = yield userMode_1.default.findOne({ _id: userID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const config = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
                "Content-Type": "application/json",
            },
        };
        const url = `https://api.paystack.co/transaction/verify/${refNumb}`;
        const result = yield axios_1.default.get(url, config).then((res) => {
            return res.data.data;
        });
        // Validate payment data
        if (!result || result.status !== "success") {
            return res.status(400).json({ message: "Invalid payment data" });
        }
        // Check for duplicate customer code
        const checkDuplicateOrder = yield orderModel_1.default.findOne({ customerCode });
        if (checkDuplicateOrder) {
            return res.status(404).json({ message: "Duplicate customer code" });
        }
        // Check for duplicate reference ID
        const checkDuplicatePayment = yield paymentModel_1.default.findOne({ refNumb });
        if (checkDuplicatePayment) {
            return res.status(404).json({ message: "Duplicate reference ID" });
        }
        // Generate unique order code
        let orderCode;
        do {
            orderCode = Math.floor(100000 + Math.random() * 900000).toString();
        } while (yield orderModel_1.default.findOne({ orderCode }));
        // Save payment data to database
        const paymentData = new paymentModel_1.default({
            refNumb,
            email: user === null || user === void 0 ? void 0 : user.email,
            amount: result.amount / 100,
            status: result.status,
            user: user._id,
            address: user === null || user === void 0 ? void 0 : user.address,
            phoneNumb: user === null || user === void 0 ? void 0 : user.telNumb,
            customerCode: orderCode,
        });
        yield paymentData.save();
        // Create orders for each item
        const orderPromises = lists.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (!item.title || !item.amount) {
                throw new Error("Invalid order item");
            }
            // Save order data to database
            const orderData = new orderModel_1.default({
                title: item.title,
                amount: item.amount,
                totalAmount: paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount,
                user: user === null || user === void 0 ? void 0 : user._id,
                customerCode: paymentData === null || paymentData === void 0 ? void 0 : paymentData.customerCode,
                payment: paymentData._id,
                productOwner: user === null || user === void 0 ? void 0 : user.name,
                status: paymentData === null || paymentData === void 0 ? void 0 : paymentData.status,
                address: paymentData === null || paymentData === void 0 ? void 0 : paymentData.address,
                phoneNumb: paymentData === null || paymentData === void 0 ? void 0 : paymentData.phoneNumb,
            });
            yield orderData.save();
            // Update user document with order ID
            yield userMode_1.default.findByIdAndUpdate(user._id, {
                $addToSet: {
                    orders: orderData._id,
                    payments: paymentData._id,
                },
            });
        }));
        const listData = new listModel_1.default({
            refNumb,
            title: "Order List",
            email: user.email,
            amount: totalAmount,
            totalAmount,
            customerCode: paymentData === null || paymentData === void 0 ? void 0 : paymentData.customerCode,
            userID: user === null || user === void 0 ? void 0 : user._id, // Convert to ObjectId
            orders: lists === null || lists === void 0 ? void 0 : lists.map((item) => item._id),
            lists: lists === null || lists === void 0 ? void 0 : lists.map((item) => ({ amount: item.amount, title: item.title })),
        });
        yield (listData === null || listData === void 0 ? void 0 : listData.save());
        yield orderModel_1.default.updateOne({ _id: req.params.id }, {
            $push: { lists: listData._id },
        });
        // Update user document with list ID
        yield user.updateOne({
            $push: { lists: listData._id }, // Use listData._id directly
        });
        yield listData.updateOne({
            $push: { lists: listData._id }, // Use listData._id directly
        });
        // Return response with order details
        return res.status(201).json({
            message: "Orders and payment created successfully",
            orderDetails: {
                customerCode: paymentData.customerCode,
                totalAmountPaid: paymentData.amount,
                orders: lists.map((item) => ({
                    title: item.title,
                    amount: item.amount,
                })),
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: `Error creating order and payment: ${error.message}`,
        });
    }
});
exports.verifyOrderListPayment = verifyOrderListPayment;
// export const verifyPaymented = async (req: Request, res: Response) => {
//   try {
//     const { refNumb, amount, email, productIDs } = req.body;
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;
//     const user = await userMode.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Check for duplicate reference ID
//     const checkDuplicate = await paymentModel.findOne({ refNumb });
//     if (checkDuplicate) {
//       return res.status(404).json({ message: "Duplicate reference ID" });
//     }
//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });
//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }
//     // Find products
//     const products = await productModel.find({ _id: { $in: productIDs } });
//     // Split payment among product owners
//     const splitPayments = await Promise.all(
//       products
//         .map(async (product) => {
//           const owner = await userMode.findById(product.userID);
//           if (!owner) {
//             console.error(`Owner not found for product ${product._id}`);
//             return null;
//           }
//           if (!owner.subAccountCode) {
//             console.error(
//               `Owner ${owner.email} does not have a subaccount code`
//             );
//             return null;
//           }
//           return {
//             subaccount: owner.subAccountCode,
//             amount: product.amount,
//           };
//         })
//         .filter(Boolean)
//     );
//     // Deduct platform fee
//     const totalAmount = products.reduce(
//       (acc, product) => acc + product.amount,
//       0
//     );
//     const platformFee = totalAmount * 0.1; // 10% platform fee
//     const netAmount = totalAmount - platformFee;
//     // Save payment data to database
//     const paymentData = new paymentModel({
//       refNumb,
//       email,
//       address: user.address,
//       phoneNumb: user?.telNumb,
//       amount: result.amount / 100,
//       status: result.status,
//       user: user._id,
//       splitPayments,
//       platformFee,
//       netAmount,
//     });
//     await paymentData.save();
//     // Create order
//     const order = new orderModel({
//       productOwner: user.name,
//       amount: paymentData.amount,
//       address: user.address,
//       phoneNumb: paymentData.phoneNumb,
//       amountPaid: paymentData.amount,
//       status: paymentData.status,
//       user: user._id,
//       splitPayments,
//     });
//     await order.save();
//     // Update user document with payment and order IDs
//     await userMode.findByIdAndUpdate(user._id, {
//       $addToSet: {
//         payments: paymentData._id,
//         orders: order._id,
//       },
//     });
//     return res.status(201).json({
//       message: "Payment successful",
//       paystackData: result, // Paystack transaction data
//       // splitPayments: paymentData.splitPayments, // Split payment data
//       order: order,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error making payment: ${error.message}`,
//     });
//   }
// };
// export const makeOrderListPayment = async (req: Request, res: Response) => {
//   try {
//     const { amount, email } = req.body;
//     // Validate input
//     if (!amount || !email) {
//       return res.status(400).json({ message: "Invalid input" });
//     }
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const url: string = `https://api.paystack.co/transaction/initialize`;
//     const params = JSON.stringify({
//       email,
//       amount: `${parseInt(amount) * 100}`,
//       callback_url: `http://localhost:5173/verify-payment-list`,
//       metadata: {
//         cancel_action: "http://localhost:5173/add-list",
//       },
//     });
//     const result = await axios.post(url, params, config);
//     console.log(result.data);
//     return res.status(201).json({
//       message: "Payment initialized successfully",
//       data: result.data.data,
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error initializing payment: ${error.message}`,
//     });
//   }
// };
// export const createOrderAndPayment = async (req: Request, res: Response) => {
//   try {
//     const { lists, refNumb, email, userID } = req.body;
//     const user = await userMode.findOne({ _id: userID });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Verify payment using Paystack's API
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const url: string = `https://api.paystack.co/transaction/verify/${refNumb}`;
//     const result = await axios.get(url, config).then((res) => {
//       return res.data.data;
//     });
//     // Validate payment data
//     if (!result || result.status !== "success") {
//       return res.status(400).json({ message: "Invalid payment data" });
//     }
//     // Save payment data to database
//     const paymentData = new paymentModel({
//       refNumb,
//       email,
//       amount: result.amount / 100,
//       status: result.status,
//       user: user._id,
//     });
//     await paymentData.save();
//     // Create orders for each item
//     lists.forEach(async (item) => {
//       const { title, amount, customerCode } = item;
//       // Check for duplicate customer code
//       const checkDuplicateOrder = await orderModel.findOne({ customerCode });
//       if (checkDuplicateOrder) {
//         return res.status(404).json({ message: "Duplicate customer code" });
//       }
//       // Generate unique order code
//       let orderCode;
//       do {
//         orderCode = Math.floor(100000 + Math.random() * 900000).toString();
//       } while (await orderModel.findOne({ orderCode }));
//       // Save order data to database
//       const orderData = new orderModel({
//         customerCode,
//         title,
//         amount,
//         user: user._id,
//         orderCode,
//         payment: paymentData._id,
//       });
//       await orderData.save();
//       // Update user document with order ID
//       await userMode.findByIdAndUpdate(user._id, {
//         $addToSet: {
//           orders: orderData._id,
//         },
//       });
//     });
//     return res.status(201).json({
//       message: "Orders and payment created successfully",
//     });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(400).json({
//       message: `Error creating orders and payment: ${error.message}`,
//     });
//   }
// };
// export const splitPayment = async (req: Request, res: Response) => {
//   try {
//     // const
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const { amount, email } = req.body;
//     const paystackAmount = amount * 0.01;h
//     const platformAmount = amount * 0.1;
//     const customerAmount = amount - paystackAmount - platformAmount;
//     // Split payment between accounts
//     const paystackData = {
//       email,
//       amount: paystackAmount,
//       subaccount: "3187286773",
//       transaction_charge: paystackAmount,
//     };
//     const platformData = {
//       email,
//       amount: platformAmount,
//       subaccount: "9126124352",
//       bearer: "subaccount",
//     };
//     const customerData = {
//       email,
//       amount: customerAmount,
//       subaccount: "customer_account_id",
//       bearer: "subaccount",
//     };
//     const paystackResult = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       paystackData,
//       config
//     );
//     const platformResult = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       platformData,
//       config
//     );
//     const customerResult = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       customerData,
//       config
//     );
//     return res.status(HTTP.OK).json({
//       message: "payment successfully split",
//       data: {
//         paystack: paystackResult.data.data,
//         platform: platformResult.data.data,
//         customer: customerResult.data.data,
//       },
//     });
//   } catch (error: any) {
//     return res.status(HTTP.BAD_REQUEST).json({
//       message: `error splitting payment ${error?.message}`,
//     });
//   }
// }
// export const splitPayment = (req: Request, res: Response) => {
//   try {
//     const { email, amount } = req.params;
//     //create a subAccount
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//         business_name: "Onyemaobi Ugochi Jecinta",
//         bank_code: "011",
//         account_number: "3187286773",
//         percentage_charge: 11,
//       },
//     };
//     const url = `https://api.paystack.co/subaccount`;
//     //initialize a split payment
//     const params = JSON.stringify({
//       email,
//       amount: `${parseInt(amount) * 100}`,
//       subaccount: "ACCT_xxxxxxxxx",
//     });
//  const url = `https://api.paystack.co/transaction/initialize`,
//   } catch (error) {}
// };
// export const splitPayment = async (req: Request, res: Response) => {
//   try {
//     // Ensure email and amount are provided
//     const { email, amount } = req.params;
//     // if (!email || !amount) {
//     //   return res.status(400).json({ message: 'Email and amount are required' });
//     // }
//     // Create a subaccount
//     const subaccountConfig = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//       business_name: "Onyemaobi Ugochi Jecinta",
//       bank_code: "011",
//       account_number: "3187286773",
//       percentage_charge: 11,
//     };
//     const subaccountUrl = `https://api.paystack.co/subaccount`;
//     const subaccountResponse = await axios.post(
//       subaccountUrl,
//       subaccountConfig,
//       {
//         headers: subaccountConfig.headers,
//       }
//     );
//     // Initialize a split payment
//     const initializeConfig = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const initializeParams = {
//       email,
//       amount: parseInt(amount) * 100,
//       subaccount: "ACCT_xxxxxxxxx",
//     };
//     const initializeUrl = `https://api.paystack.co/transaction/initialize`;
//     const initializeResponse = await axios.post(
//       initializeUrl,
//       initializeParams,
//       {
//         headers: initializeConfig.headers,
//       }
//     );
//     // Return the response
//     const result = await axios
//       .post(subaccountResponse, initializeResponse)
//       .then((res) => {
//         return res.data.data;
//       });
//     return res.status(HTTP.CREATED).json({
//       message: "successfully splited your payment",
//       data: result,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(HTTP.BAD_REQUEST)
//       .json({ message: "Failed to split payment" });
//   }
// };
// export const createSubaccount = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const user = await userMode.findById(userID);
//     if (!user) {
//       console.log("user not found");
//     }
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const data = {
//       business_name: user?.name,
//       bank_code: user?.bankCode,
//       account_number: user?.accountNumb,
//       percentage_charge: 11,
//     };
//     const url = `https://api.paystack.co/subaccount`;
//     const response = await axios
//       .post(url, data, { headers: config.headers })
//       .then((res) => {
//         return res.data.data;
//       });
//     return res.status(HTTP.CREATED).json({
//       message: "successfully created sub account",
//       data: response,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Failed to create subaccount" });
//   }
// };
// Initializes a split payment on Paystack
// export const initializeSplitPayment = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const { amount } = req.body;
//     const user = await userMode.findById(userID);
//     const config = {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACKKEY}`,
//         "Content-Type": "application/json",
//       },
//     };
//     const params = {
//       email: user?.email,
//       amount: parseInt(amount) * 100,
//       subaccount: user?.bankName,
//     };
//     const url = `https://api.paystack.co/transaction/initialize`;
//     const response = await axios.post(url, params, { headers: config.headers });
//     return res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Failed to initialize split payment" });
//   }
// };;
