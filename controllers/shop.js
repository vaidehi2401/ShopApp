const Product = require('../models/product');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      console.log("This is product>>>>>>>",
        product
      )
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};
exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products=>{
    res.render('shop/product-list', {
      prods:products,
      pageTitle: 'All products',
      path: '/products'
    })
  })
  .catch(err=>{
    console.log(err)
  })
};
exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId') // no execPopulate
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product=>{
    return req.user.addToCart(product);
  })
  .then(result=>{
    console.log(result, "Added to cart")
    res.redirect('/cart')
  })
//   let fetchedCart;
//   let newQuantity = 1;
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then(products => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }

//       if (product) {
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product;
//       }
//       return Product.findById(prodId);
//     })
//     .then(product => {
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity }
//       });
//     })
//     .then(() => {
//       res.redirect('/cart');
//     })
 .catch(err => console.log(err));

 };

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const cart = req.user.cart.items;
      const updatedItems = cart.filter(item => item.productId.toString()!==prodId);
      req.cart.items = updatedItems;
   user.save()
  .then(() => {
    res.redirect('/cart'); // ← chained cleanly
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const db = getDb();
    db.collection('orders').find({'user._id': req.user._id}).toArray()
    .then(orders => {
      console.log("tHESE are orders", orders)
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
