
const _data = require('./data');
const helpers = require('./helpers');





const handlers = {};


handlers.sample = (data, callback) => {
    callback(406, {'message' : 'The best stop for a pizza treat'})
};

handlers.notFound = (data, callback) => {
    callback(404, {'message' : 'Page not found'})
};




handlers.users = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete']
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers.temUsers[data.method](data, callback)
    } else {
        callback(405)
    }
}


handlers.temUsers = {};

handlers.temUsers.post = function(data, callback) {
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const emailAddress = typeof(data.payload.emailAddress) === 'string' && data.payload.emailAddress.trim().length > 0 ? data.payload.emailAddress.trim() : false;
    const streetAddress = typeof(data.payload.streetAddress) === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim(): false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;



    if(firstName && lastName && emailAddress && streetAddress && password) {
        _data.read('users', emailAddress, function(err, data) {
            if(err) {
                const hashedPassword = helpers.hash(password);
                if(hashedPassword) {
                    const userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'emailAddress' : emailAddress,
                        'streetAddress' : streetAddress,
                        'hashedPassword' : hashedPassword
                    };

                    _data.create('users', emailAddress, userObject, function(err) {
                        if(!err) {
                            callback(200)
                        } else {
                            callback(500, {'Error' : 'Could not create new user'})
                        }
                    })
                } else {
                    callback(500, {'Error' : 'Could nor hash user\'s password'})
                }


            } else {
                callback(400,{'Error' : 'User already exists'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required fields'})
    }


};


handlers.temUsers.get = function(data, callback) {
    const emailAddress = typeof(data.queryStringObject.emailAddress) === 'string' && data.queryStringObject.emailAddress.trim().length > 0 ? data.queryStringObject.emailAddress.trim() : false;

    if(emailAddress) {
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        handlers.tempTokens.verifyToken(token, emailAddress, function(tokenIsValid) {
            if(tokenIsValid) {
                _data.read('users', emailAddress, function(err, data) {
                    if(!err && data) {
                        delete data.hashedPassword;
                        callback(200, data)
                    } else {
                        callback(404)
                    }
                })
            } else {
                callback(403, {'Error' : 'Missing required tokenn in header, or token is invalid'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required fields'})
    }
};


handlers.temUsers.put = function(data, callback) {
    const emailAddress = typeof(data.queryStringObject.emailAddress) === 'string' && data.queryStringObject.emailAddress.trim().length > 0 ? data.queryStringObject.emailAddress.trim() : false;



    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const streetAddress = typeof(data.payload.streetAddress) === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(emailAddress) {
        if(firstName || lastName || streetAddress || password) {

            const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

            handlers.tempTokens.verifyToken(token, emailAddress, function(tokenIsValid) {
                if(tokenIsValid) {
                    _data.read('users', emailAddress, function(err, userData) {
                        if(!err && userData) {
                            if(firstName) {
                                userData.firstName = firstName;
                            }
                            if(lastName) {
                                userData.lastName = lastName
                            }
                            if(streetAddress) {
                                userData.streetAddress = streetAddress
                            }
                            if(password) {
                                userData.hashedPassword = helpers.hash(password)
                            }
        
                            _data.update('users', emailAddress, userData, function(err) {
                                if(!err) {
                                    callback(200)
                                } else {
                                    callback(500, {'Error' : 'Could not update the user'})
                                }
                            })
                        } else {
                            callback(400, {'Error' : 'Specified user does not exist'})
                        }
                    })
                    
                } else {
                    callback(403, {'Error' : 'Missing required token in header, or toekn is invalid'})
                }
            })
        } else {
            callback(400, {'Error' : 'Missing fields to update'})
        }
    } else {
        callback(400, {'Error' : 'Missing required fields'})
    }


};


handlers.temUsers.delete = function(data, callback) {
    const emailAddress = typeof(data.queryStringObject.emailAddress) === 'string' && data.queryStringObject.emailAddress.trim().length > 0 ? data.queryStringObject.emailAddress.trim() : false;

    if(emailAddress) {

        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        handlers.tempTokens.verifyToken(token, emailAddress, function(tokenIsValid) {
            if(tokenIsValid) {
                _data.read('users', emailAddress, function(err,data) {
                    if(!err && data) {
                        _data.delete('users', emailAddress, function(err) {
                            if(!err) {
                                callback(200)
                            } else {
                                callback(500, {'Error' : 'Could not delete the specified user'})
                            }
                        })
                    } else {
                        callback(400, {'Error' : 'Could not find the specified user'})
                    }
                })

            } else {
                callback(403, {'Error' : 'Missing required token in header, or token is invalid'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required fields'})
    }
}



handlers.tokens = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
        handlers.tempTokens[data.method](data, callback)
    } else {
        callback(405)
    }
};


handlers.tempTokens.post = function(data, callback) {
    const emailAddress = typeof(data.payload.emailAddress) === 'string' && data.payload.emailAddress.trim().length > 0 ? data.payload.emailAddress.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(emailAddress && password) {
        _data.read('users', emailAddress, function(err, userData) {
            if(!err && userData) {
                const hashedPassword = helpers.hash(password);
                if(hashedPassword === userData.hashedPassword) {
                    const tokenId = helpers.createRandomString(16);
                    const expires = Date.now() + 1000 * 60 * 60 *24;

                    const tokenObject = {
                        'emailAddress' : emailAddress,
                        'id' : tokenId,
                        'expires' : expires
                    };

                    _data.create('tokens', tokenId, tokenObject, function(err) {
                        if(!err) {
                            callback(200, tokenObject)
                        } else {
                            callback(500, {'Error' : 'Could not create the new token'})
                        }
                    })

                } else {
                    callback(400, {'Error' : 'Password did not match the specified user\'s password'})
                }
            } else {
                callback(400, {'Error' : 'Could not find the specified user'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required fields'})
    }
};


handlers.tempTokens.get = function(data, callback) {
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 16 ? data.queryStringObject.id.trim() : false;

    if(id) {
        _data.read('tokens', id, function(err, tokenData) {
            if(!err && tokenData) {
                callback(200, tokenData)
            } else {
                callback(404)
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required field or field invalid'})
    }
};

handlers.tempTokens.put = function(data, callback) {
    const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 16 ? data.payload.id.trim() : false;
    const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    if(id && extend) {
        _data.read('tokens', id, function(err, tokenData) {
            if(!err && tokenData) {
                if(tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    _data.update('tokens', id, tokenData, function(err) {
                        if(!err) {
                            callback(200)
                        } else {
                            callback(500, {'Error' : 'Could not update the token\'s expiration'})
                        }
                    })
                } else {
                    callback(400, {'Error' : 'The token has already expired and can no longer be extended'})
                }
            } else {
                callback(400, {'Error' : 'Specified user does not exist'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required field(s) or field(s) are invalid'})
    }
};


handlers.tempTokens.delete = function(data, callback) {
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 16 ? data.queryStringObject.id.trim() : false;

    if(id) {
        _data.read('tokens', id, function(err, tokenData) {
            if(!err && tokenData) {
                _data.delete('tokens', id, function(err) {
                    if(!err) {
                        callback(200)
                    } else {
                        callback(500, {'Error' : 'Could not delete the specified token'})
                    }
                })
            } else {
                callback(400, {'Error' : 'Could not find the specified user'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required fields'})
    }
};



handlelrs.tempTokens.verifyToken = function(id, emailAddress, callback) {
    _data.read('tokens', id, function(err, tokenData) {
        if(!err && tokenData) {
            if(tokenData.emailAddress === emailAddress && tokenData.expires > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}








module.exports = handlers