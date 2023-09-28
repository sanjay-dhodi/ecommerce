const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const productsRoutes = require("./routes/products");
const shopRoutes = require("../e-commerce app/routes/shop");
const authRoutes = require("../e-commerce app/routes/auth");

app.use(bodyparser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", shopRoutes);
app.use("/", productsRoutes);
app.use("/", authRoutes);

app.use((req, resp) => {
  resp.send("<h1>404 page not found</h1>");
});

// app.get("/login",(req,resp)=>{
//   resp.render("login")
// })

app.listen(1888, () => {
  console.log("server is running on port 1888");
});
