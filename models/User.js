const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [ true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        require: [ true, 'Please enter a Password'],
        minlength: [6, 'Minum length is 6 characters']
    }
});

// fire a function after something happens = doc saved to databae 
// userSchema.post('save', function(doc, next) {
//     console.log('new user was created and saved', doc);
//     // next();
// })

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    
    throw Error('incorrect email');
}

// fire before something happens = doc sent to database
userSchema.pre('save', async function(next) {
    // console.log('user about to be created and saved', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;