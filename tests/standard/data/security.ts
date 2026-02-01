export const injectionInputs = {
  sql: "' OR '1'='1",
  xss: '<img src=x onerror=alert(1)>',
};

export const invalidLogin = {
  email: 'no-user@example.com',
  password: 'wrong-password',
};
