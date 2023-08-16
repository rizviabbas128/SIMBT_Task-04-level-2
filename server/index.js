const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const AuthRoute = require('./routes/Auths');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const secret = 'abbas';


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.use('/abbas', (req, res , next) => {
  const token = req.headers.authorization;// if bearer in token before then (token = req.headers.authorization?.split("Bearer")[1];)
  if(token) {
      jwt.verify(token, secret , function(err, decoded) {
          if(err) {
              return res.status(403).json({
                  status: "Failed",
                  message: "Token is not Valid"
              })
          }
          req.user = decoded.data;
          next();
        });
  }else {
      res.status(403).json({
          status: "Failed",
          message: "User is not authenticated"
      })
  }
})

app.use("/api/auth", AuthRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
