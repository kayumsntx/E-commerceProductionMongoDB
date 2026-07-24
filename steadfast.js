// ==========================================
// STEADFAST COURIER API CLIENT (Using Axios)
// ==========================================
const axios = require('axios');

const BASE_URL = process.env.STEADFAST_BASE_URL || "https://portal.steadfast.com.bd/api/v1";
const API_KEY = process.env.STEADFAST_API_KEY;
const SECRET_KEY = process.env.STEADFAST_SECRET_KEY;

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Api-Key": API_KEY,
    "Secret-Key": SECRET_KEY,
  };
}

async function request(path, method = "GET", data = null) {
  if (!API_KEY || !SECRET_KEY) {
    throw new Error("Steadfast API credentials are missing. Set STEADFAST_API_KEY and STEADFAST_SECRET_KEY in .env");
  }

  try {
    const response = await axios({
      url: BASE_URL + path,
      method: method,
      headers: authHeaders(),
      data: data,
      timeout: 15000 // ১৫ সেকেন্ড টাইমআউট
    });

    return response.data;
  } catch (error) {
    const resData = error.response?.data;
    const message = resData?.message || error.message || `Steadfast API error (HTTP ${error.response?.status || 500})`;
    const err = new Error(message);
    err.status = error.response?.status || 500;
    err.response = resData;
    throw err;
  }
}

async function createOrder(order) {
  return request("/create_order", "POST", {
    invoice: order.invoice,
    recipient_name: order.recipient_name,
    recipient_phone: order.recipient_phone,
    recipient_address: order.recipient_address,
    cod_amount: order.cod_amount,
    note: order.note || "",
    item_description: order.item_description || "",
  });
}

async function createBulkOrder(orders) {
  return request("/create_order/bulk-order", "POST", { data: orders });
}

async function statusByConsignmentId(cid) {
  return request(`/status_by_cid/${encodeURIComponent(cid)}`, "GET");
}

async function statusByInvoice(invoice) {
  return request(`/status_by_invoice/${encodeURIComponent(invoice)}`, "GET");
}

async function statusByTrackingCode(trackingCode) {
  return request(`/status_by_trackingcode/${encodeURIComponent(trackingCode)}`, "GET");
}

async function getBalance() {
  return request("/get_balance", "GET");
}

function getTrackingUrl(trackingCode) {
  return `https://steadfast.com.bd/t/${trackingCode}`;
}

module.exports = {
  createOrder,
  createBulkOrder,
  statusByConsignmentId,
  statusByInvoice,
  statusByTrackingCode,
  getBalance,
  getTrackingUrl,
};