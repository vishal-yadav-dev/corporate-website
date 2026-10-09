import type { NextConfig } from "next";
import { STAFFING } from "./lib/data";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.4"],
  async redirects() {
    return [
      { source: "/us-staffing", destination: "/solutions", permanent: true },
      ...STAFFING.map(({ id, group }) => ({
        source: `/us-staffing/${id}`,
        destination: `/solutions/${group}-solutions/${id}`,
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    return [
      { source: "/solutions", destination: "/us-staffing" },
      { source: "/solutions/technology-solutions/:slug", destination: "/us-staffing/:slug" },
      { source: "/solutions/workforce-solutions/:slug", destination: "/us-staffing/:slug" },
    ];
  },
};

export default nextConfig;
