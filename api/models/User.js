/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  },

      saveUser : function(userObj, callback){

        User.destroy({"userInfo.user_id" : userObj.userInfo.user_id}).exec(function (errror, tokens) {
            if (!errror) {
                User.create(userObj).exec(function (err, token) {
                    if (!err) {
                        User.find().exec(function (err, users) {
                            if (!err) {
                                return callback(null, users);

                            } else {
                                return callback(err, {"status": "failed"});
                            }
                        });
                    } else {
                        return callback(err, {"status": "failed"});
                    }
                });
            } else {
                return callback(err, {"status": "failed"});
            }
        });


    }
};

