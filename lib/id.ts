import { randomBytes } from "crypto";
// Short, URL-safe, sortable-enough unique id.
export function cuid(): string {
  return "c" + Date.now().toString(36) + randomBytes(8).toString("hex");
}
