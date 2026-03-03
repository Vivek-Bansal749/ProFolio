const { default:axios } = require("axios");


export const BASE_URL = "https://profolio-lu8b.onrender.com"

export const clientServer = axios.create({
    baseURL:BASE_URL,
})