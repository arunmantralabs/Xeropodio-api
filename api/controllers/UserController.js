/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var podioAppMainDataObjLocal = podioAppMainDataObjLocal;
var request = require("request");
var rp = require('request-promise');
var podioAuth, elanceAuth, userInfo;

module.exports = {

	signup: function (req, res) {
        res.send('Yup!! Controlller is working :) ')
    },

    podiologin :function(req, res){
    res.redirect('https://podio.com/oauth/authorize?client_id='+sails.config.globals.podioAppMainDataObjLocal.client_id_podio+'&redirect_uri='+sails.config.globals.podioAppMainDataObjLocal.webredirecrUrlPodio);
    },

    podioauth : function(req, res){

        rp({
            uri: "https://podio.com/oauth/token?grant_type=authorization_code&client_id="+sails.config.globals.podioAppMainDataObjLocal.client_id_podio+"&redirect_uri="+sails.config.globals.podioAppMainDataObjLocal.webredirecrUrlPodio+"&client_secret="+sails.config.globals.podioAppMainDataObjLocal.client_secret_podio+"&code="+req.param('code'),
            method: "POST"
        }).then(function (body) {

            var Tokendata = JSON.parse(body);
            Tokendata.tokenName = "podio";
            sails.config.globals.podioAppMainDataObjLocal.tokenDataPodio = Tokendata;
            podioAuth = Tokendata;

            rp('https://api.podio.com/user/profile?oauth_token=' + Tokendata.access_token)
                .then(function (body) {
                    var _data = JSON.parse(body);
                    var userInfo = _data;
                    sails.config.globals.podioAppMainDataObjLocal.userInfo = userInfo;

                    var reqUserData = {};
                    reqUserData.userInfo = userInfo;
                    reqUserData.elanceAuth = elanceAuth;
                    reqUserData.podioAuth = podioAuth;

                    return User.saveUser(reqUserData, function (err, users) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(users);
                            sails.config.globals.podioAppMainDataObjLocal.userData = users;
                            console.log(users)
                        }
                    });
                   

                })
                .catch(function (error) {
                    console.log(error);
                });



        })
            .catch(function(error){
                console.log(error);
            });

    }
};

