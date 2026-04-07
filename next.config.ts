import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/events/calibrate", destination: "/calibrate", permanent: true },
      { source: "/events/calibrate/book-a-call", destination: "/calibrate/book-a-call", permanent: true },
      { source: "/events/calibrate/dashboard", destination: "/calibrate/dashboard", permanent: true },
      { source: "/events/calibrate/report", destination: "/calibrate/report", permanent: true },
      { source: "/events/exec-breakfast", destination: "/exec-breakfast", permanent: true },
      { source: "/dashboard", destination: "/calibrate/dashboard", permanent: false },
      { source: "/report", destination: "/calibrate/report", permanent: false },
      { source: "/book-a-call", destination: "/calibrate/book-a-call", permanent: false },
    ];
  },
};

export default nextConfig;
