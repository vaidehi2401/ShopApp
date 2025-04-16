const mongodb = require('mongodb');
const { get } = require('../routes/admin');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;
class User{
  constructor(name, email, cart, id){
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save(){
    const db = getDb();
    return db.collection('users')
    .insertOne(this)
    .then((result)=>{
      console.log(result);
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  addToCart(product) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new ObjectId(this._id) })
      .then(user => {
        const cart = user.cart || { items: [] };
        const updatedCartItems = [...cart.items];
  
        const productIndex = updatedCartItems.findIndex(cp =>
          cp.productId.toString() === product._id.toString()
        );
  
        if (productIndex >= 0) {
          updatedCartItems[productIndex].quantity += 1;
        } else {
          updatedCartItems.push({
            productId: new ObjectId(product._id),
            quantity: 1
          });
        }
  
        return db.collection('users').updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: updatedCartItems } } }
        );
      });
  }
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => i.productId);
  
    return db.collection('products')
      .find({ _id: { $in: productIds } })  // ✅ correct $in usage
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i =>
              i.productId.toString() === p._id.toString()
            ).quantity
          };
        });
      });
  }
  
  static findById(userId){
    const db = getDb();
    return db.collection('users')
    .find({_id: new mongodb.ObjectId(userId)})
    .next()
    .then(user=>{
      console.log(user);
      return user;
    })
    .catch(err=>{
      console.log(err);
    })
  }
}

module.exports = User;
