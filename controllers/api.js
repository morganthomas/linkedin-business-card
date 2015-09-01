var User = require('../models/user.js');

var apiController = {
  save: function(req, res) {
    console.log(req.body);
    var user = req.body.user;

    if (!(req.user && req.user.id === user._id)) {
      return res.status(401).send("Not authorized to modify this business card; maybe your session expired?");
    }

    // Don't update the special properties _id and __v.
    delete user._id;
    delete user.__v;

    User.update({ id: user.id }, { $set: user }, function(err) {
      if (err) {
        return res.status(500).send(JSON.stringify(err));
      }

      res.send("Saved!");
    });
  }
}

module.exports = apiController;
