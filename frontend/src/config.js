// In production (served by same backend), use relative path
// In development, use localhost
const BASE_URL = import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

const RETRY_TIME = 3 * 1000;

export {
  BASE_URL,
  RETRY_TIME,
};