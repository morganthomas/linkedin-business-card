var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  linkedInId: String,
  name: String,
  headline: String,
  location: String,
  specialties: String,
  // Array of objects { title : String, company : String }.
  positions: Array,
  pictureUrl: String,
  linkedInUrl: String,
  email: String,
  phone: String
});

var User = mongoose.model('user', userSchema);
module.exports = User;
