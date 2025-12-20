import { tokenSignature } from "@/lib/apiSigner";
import { generateUUID } from '@/lib/uuid';

export async function securePost(path, method = "POST", body = null) {
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;
  const ORIGIN = process.env.ORIGIN;
  const token = localStorage.getItem("token");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateUUID();

  const bodyString = body ? JSON.stringify(body) : "";

  const payload =
    method +
    path +
    bodyString +
    timestamp +
    nonce;

  const signature = await tokenSignature(payload, API_SECRET);

  const res = await fetch(API_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Origin": ORIGIN,
      "Authorization": `Bearer ${token}`,
      "X-API-KEY": API_KEY,
      "X-TIMESTAMP": timestamp,
      "X-NONCE": nonce,
      "X-SIGNATURE": signature,
    },
    body: bodyString || undefined,
  });

  return res.json();
}
