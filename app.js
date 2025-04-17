const path = require('path');
const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
//const mongoConnect = require('./util/database').mongoConnect;
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
 User.findById('6800e326c0b85f3d21dedd7f')
    .then(user => {
     req.user = user;
     next();
    })
   .catch(err => console.log(err));
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('')
.then(()=>{
   User.findOne().then(user=>{
      if(!user){
         const user = new User({
            name: 'Vaidehi',
            email: 'vaidehi@gmail.com',
            cart:{
               items: []
            }
         });
         user.save();
      }
   })
   
   app.listen(3007);
})
.catch((err)=>{
   console.log(err)
})