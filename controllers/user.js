'use strict';
var LdapClient = require('promised-ldap');
var ssha = require('ssha');

var bind = function*(cn, userPassword) {
  var dn = 'cn=' + cn + ',' + process.env.LDAP_BASE_DN;
  var client = new LdapClient({url: process.env.LDAP_URL});
  try {
    yield client.bind(dn, userPassword);
    return client;
  } catch(e) {
    var error = new Error();
    error.status = 401;
    throw error;
  }
};

var toObject = function(attrs) {
  var obj = {};
  for(var i = 0; i < attrs.length; i++) {
    if(attrs[i].type === 'userPassword') {
      obj[attrs[i].type] = 'secret';
    } else {
      obj[attrs[i].type] = attrs[i].vals[0];
    }
  }
  return obj;
};

var searchEntries = function(client, base, opts) {
  return new Promise(function(resolve, reject) {
    var searchCallback = function(err, result) {
      var entries = [];

      result.on('searchEntry', function(entry) {
        entries.push(entry);
      });

      result.on('end', function(result) {
        if (result.status === 0) {
          resolve(entries);
        } else {
          reject(new Error('Error: ' + result.status));
        }
      });

      result.on('error', function(err) {
        if(err.name === 'SizeLimitExceededError') {
          resolve(entries);
        } else {
          reject(err);
        }
      });
    };

    client._search(base, opts, searchCallback);
  });
};


var getDn = function(cn) {
  return 'cn=' + cn + ',' +process.env.LDAP_BASE_DN;
};

var getAttributes = function*(client, body) {
  var opts = {
    scope: 'base',
    filter: '(objectClass=*)'
  };
  var entries = (yield client.search(getDn(body.key), opts)).entries;
  return toObject(entries[0].attributes);
};

var searchUsers = function*(client, body) {
  var key = body.key;
  var filter = '(uid=*)';
  if(key) {
    filter = '|(uid=*' + key + '*)(givenName=*' + key + '*)(sn=*' + key + '*)(displayName=*' + key + '*)';
  }

  var opts = {
    sizeLimit: 10,
    scope:'one',
    filter: filter
  };
  var entries = yield searchEntries(client, process.env.LDAP_BASE_DN, opts);
  var users = [];
  for(var i = 0; i < entries.length; i++) {
    var obj = toObject(entries[i].attributes);
    users.push(obj);
  }

  var unique = false;
  if(key) {
    opts.filter = '(cn=' + key + ')';
    unique = (yield searchEntries(client, process.env.LDAP_BASE_DN, opts)).length === 0;
  }

  if(users.length > 1) {
    users = users.sort(function(a, b){
      return a.cn.localeCompare(b.cn);
    });
  }

  return {
    users: users,
    unique: unique
  };
};

var getUser = function*(client, body) {
  var attrs = yield getAttributes(client, body);
  return {
    users: [ attrs ],
    unique: true
  };
};

var pushChange = function(changes, obj, operation) {
  var keys = Object.keys(obj);
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = obj[key];
    var modification = {};
    modification[key] = value? [value] : [];
    changes.push({
      operation: operation,
      modification: modification
    });
  }
};

var getChanges = function(attr, user) {
  var replaced = {};
  var added = {};

  var keys = Object.keys(user);
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = user[key];
    if(key === 'userPassword') {
      if(value !== 'secret') {
        replaced[key] = ssha.create(value);
      }
    } else if(attr[key] === undefined) {
      if(value) {
        added[key] = value;
      }
    } else if(attr[key] !== value) {
      replaced[key] = value;
    }
  }

  var changes = [];
  if(user.cn === 'admin') {
    pushChange(changes, replaced, 'replace');
  } else {
    pushChange(changes, added, 'add');
    pushChange(changes, replaced, 'replace');
  }
  return changes;
};

var toAttributes = function(user) {
  user.userPassword = ssha.create(user.userPassword);
  user.objectclass = ['inetOrgPerson', 'top'];
  user.uid = user.cn;
  if(!user.labeledURI) {
    delete user.labeledURI;
  }
  return user;
};

var saveUser = function*(client, body) {
  var dn = getDn(body.user.cn);
  var attrs;
  try {
    attrs = yield getAttributes(client, {key: body.user.cn});
  } catch(e) {
    // ignore
  }

  if(attrs) {
    yield client.modify(dn, getChanges(attrs, body.user));
  } else {
    yield client.add(dn, toAttributes(body.user));
  }
};

var delUser = function*(client, body) {
  yield client.del(getDn(body.user.cn));
};

var execute = function*(request, func) {
  var body = request.body;
  var client = yield bind(body.cn, body.userPassword);
  var res = yield func(client, body);
  yield client.unbind();
  return res;
};

module.exports.search = function*() {
  var func = (this.request.body.cn === 'admin')? searchUsers : getUser;
  this.body = yield execute(this.request, func);
};

module.exports.login = function*() {
  this.body = yield execute(this.request, function*(){
    return {result: 'OK'};
  });
};

module.exports.save = function*() {
  this.body = yield execute(this.request, saveUser);
};

module.exports.del = function*() {
  this.body = yield execute(this.request, delUser);
};
