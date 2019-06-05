export const {
  PROTO = "http",
  HOST = "localhost",
  PORT = 4000,
  DB_NAME = "neverForgetBeDB",
  DB_URI = `mongodb://localhost:27017/neverForgetBeDB`,
  SESS_NAME = 'sessionId',
  SESS_SECRET = 'test-secret',
  SESS_LIFETIME = 1000 * 60 * 60 
} = process.env;

