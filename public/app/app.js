function app() {
  var self = {};

  riot.observable(self);

  self.users = [];
  self.account = {
    admin: false,
    cn: '',
    userPassword: ''
  };

  var update = function(user, del) {
    $.ajax({
      url: (del)? '/del' : '/save',
      type: 'POST',
      dataType: 'json',
      data: {
        user: user,
        cn: self.account.cn,
        userPassword: self.account.userPassword
      }
    }).done(function(data, textStatus){
      self.trigger('updated');
    });
  };

  self.del = function(user) {
    update(user, true);
  };

  self.save = function(user) {
    update(user, false);
  };

  self.search = function(keyWord) {
    $.ajax({
      url: '/search',
      type: 'POST',
      dataType: 'json',
      data: {
        key: keyWord,
        cn: self.account.cn,
        userPassword: self.account.userPassword
      }
    }).done(function(data, textStatus){
      self.users = data.users;
      self.unique = data.unique;
      self.trigger('found');
    });
  };

  self.login = function(cn, userPassword) {
    var account = {
      cn: cn,
      userPassword: userPassword
    };

    $.ajax({
      url: '/login',
      type: 'POST',
      dataType: 'json',
      data: account
    }).done(function(data, textStatus){
      self.account = account;
      self.account.admin = self.account.cn === 'admin';
      self.trigger('authenticated');
    }).fail(function(){
      location.reload();
    });

  }

  return self;
}
