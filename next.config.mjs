/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
    ],
      domains: ["s3-us-west-2.amazonaws.com", "scontent.cdninstagram.com" ,"scontent-iad3-1.cdninstagram.com", "scontent-iad3-2.cdninstagram.com"], // Add this line
    },
  };
  
  export default nextConfig;
  