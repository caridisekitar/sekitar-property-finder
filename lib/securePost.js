import { tokenSignature } from "@/lib/apiSigner";
import { generateUUID } from "@/lib/uuid";
import { getDeviceId } from "@/lib/device";

export async function securePost(
  path,
  method = "POST",
  body = null,
  extraHeaders = {}
) {
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;
  const ORIGIN = process.env.ORIGIN;

  const token = localStorage.getItem("token");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateUUID(); // ✅ nonce ONLY

  const isFormData = body instanceof FormData;

  const payload =
    method +
    path +
    (isFormData ? "" : JSON.stringify(body ?? {})) +
    timestamp +
    nonce;

  const signature = await tokenSignature(payload, API_SECRET);

  const headers = {
    Origin: ORIGIN,
    "X-API-KEY": API_KEY,
    "X-TIMESTAMP": timestamp,
    "X-NONCE": nonce,
    "X-SIGNATURE": signature,

    // 🔐 SINGLE DEVICE SUPPORT
    "X-Device-Id": getDeviceId(),

    ...extraHeaders, // 🔥 allow override / extend
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(API_URL + path, {
    method,
    headers,
    body: isFormData ? body : JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      ...data,
    };
  }

  return data;
}
