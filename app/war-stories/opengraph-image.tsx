import { notFound } from "next/navigation";

export const alt = "FrankenTUI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  // War Stories section removed. Keep the OG image route as 404 without deleting files.
  notFound();
}
