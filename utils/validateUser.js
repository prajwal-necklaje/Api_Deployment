function validateUser(name, email) {
  return typeof name === 'string' &&
         typeof email === 'string' &&
         email.includes('@');
}

module.exports = validateUser;
