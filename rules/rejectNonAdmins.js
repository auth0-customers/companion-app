function (user, context, callback) {
  user.app_metadata = user.app_metadata || {};
  if (context.clientMetadata.adminsOnly === 'true') {
    if (user.app_metadata.role !== 'admin')
      return callback(new UnauthorizedError('You must be an admin to access this app'));
  }

  return callback(null, user, context);
}