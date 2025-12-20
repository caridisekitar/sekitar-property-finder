import { tokenSignature } from "@/lib/apiSigner";
import { generateUUID } from '@/lib/uuid';

export async function secureGet(path, query = {}) {
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;
  const API_SECRET = process.env.API_SECRET;
  const ORIGIN = process.env.ORIGIN;
  const token = localStorage.getItem("token");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateUUID();


  const queryString = new URLSearchParams(query).toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;

  const payload =
    "GET" +
    path +
    queryString +
    timestamp +
    nonce;


  const signature = await tokenSignature(payload, API_SECRET);

  const res = await fetch(API_URL + fullPath, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Origin": ORIGIN,
      "Authorization": `Bearer ${token}`,
      "X-API-KEY": API_KEY,
      "X-TIMESTAMP": timestamp,
      "X-NONCE": nonce,
      "X-SIGNATURE": signature,
    },
  });

  return res.json();
}
