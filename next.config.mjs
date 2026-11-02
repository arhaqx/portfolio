import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  async rewrites() {
    return {
      // Keep the demo URL and storage origin while the Expo app deploys independently.
      beforeFiles: [
        {
          source: "/demos/vinty-pos/:path*",
          destination: "https://veloce-landing-page.vercel.app/demos/vinty-pos/:path*",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/learning",
        permanent: false,
      },
      {
        source: "/gallery",
        destination: "/projects",
        permanent: false,
      },
    ];
  },
};

export default withMDX(nextConfig);
