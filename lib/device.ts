// lib/device.ts
import { generateUUID } from '@/lib/uuid';

export function getDeviceId() {
  let id = localStorage.getItem('device_id');
  if (!id) {
    localStorage.setItem('device_id', generateUUID());
  }
  return id;
}
