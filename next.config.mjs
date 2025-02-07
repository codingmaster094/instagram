/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["s3-us-west-2.amazonaws.com", "scontent.cdninstagram.com" , "scontent-iad3-2.cdninstagram.com"], // Add this line
    },
  };
  
  export default nextConfig;
  