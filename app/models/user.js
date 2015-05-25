var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var bcrypt = require('bcryptjs');
var settings = require('../../config/settings');

var availableRoles = settings.roles;

var userSchema = mongoose.Schema({
  email         : {
                    type: String,
                    unique: true,
                    required: 'Email is required',
                    validate: validators.isEmail()
                  },
  username      : {
                    type: String,
                    unique: true,
                    required: 'Username is required',
                    validate: validators.isLength(3, 20)
                  },
  password      : {
                    type: String,
                    required: 'Password is required'
                  },
  firstName     : {
                    type: String,
                    required: 'First name is required',
                    validate: [validators.isAlpha(), validators.isLength(2, 100)]
                  },
  lastName      : {
                    type: String,
                    required: 'Last name is required',
                    validate: [validators.isAlpha(), validators.isLength(2, 150)]
                  },
  role          : {
                    type: String,
                    required: 'A role is required',
                    validate: validators.isIn({ message: 'Available roles are ' + availableRoles.join(', ') }, availableRoles)
                  },
  isActive      : {
                    type: Boolean,
                    required: true,
                    default: true
                  }
});

userSchema.plugin(uniqueValidator, { message: '{VALUE} is already registered' });
userSchema.plugin(timestamps);

userSchema.methods.hashPassword = function() {
  if( this.password )
    this.password = bcrypt.hashSync(this.password, 8);
};

userSchema.methods.passwordValidFor = function(rawPassword) {
  if( rawPassword ) 
    return bcrypt.compareSync(rawPassword, this.password);
};

userSchema.methods.serialize = function() {
  return {
    username    : this.username,
    email       : this.email,
    firstName   : this.firstName,
    lastName    : this.lastName,
    role        : this.role,
    isActive    : this.isActive,
    createdAt   : this.createdAt,
    updatedAt   : this.updatedAt
  };
};

module.exports = mongoose.model('User', userSchema);
