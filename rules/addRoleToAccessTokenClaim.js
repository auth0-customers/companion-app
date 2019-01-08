function (user, context, callback) {
  user.app_metadata = user.app_metadata || {};
  context.accessToken['http://claims.com/role'] = user.app_metadata.role;
  context.accessToken['http://claims.com/email'] = user.email;
  callback(null, user, context);
}