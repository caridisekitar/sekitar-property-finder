import { tokenSignature } from "@/lib/apiSigner";
import { generateUUID } from "@/lib/uuid";
import { getDeviceId } from "@/lib/device";

export async function secureGet(path, query = {}, extraHeaders = {}) {
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;

  const token = localStorage.getItem("token");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateUUID();

  const queryString = new URLSearchParams(query).toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;

  // 🔐 SIGNATURE PAYLOAD MUST MATCH REQUEST
  const payload =
    "GET" +
    fullPath +
    timestamp +
    nonce;

  const signature = await tokenSignature(payload, API_SECRET);

  const headers = {
    "X-API-KEY": API_KEY,
    "X-TIMESTAMP": timestamp,
    "X-NONCE": nonce,
    "X-SIGNATURE": signature,

    // 🔥 REQUIRED FOR SINGLE DEVICE
    "X-Device-Id": getDeviceId(),

    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + fullPath, {
    method: "GET",
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw {
      status: res.status,
      ...data,
    };
  }

  return data;
}
