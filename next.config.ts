import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render için output ayarı
  // Static export için: output: 'export'
  // Web Service için: output ayarı gerekmez (default)
  // Dynamic routes olduğu için Web Service kullanmalıyız
  output: undefined, // Web Service için undefined (default)
};

export default nextConfig;
