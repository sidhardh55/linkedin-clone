const { default: axios } = require('axios');

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const clientServer = axios.create({
  baseURL: apiBaseUrl,
});
