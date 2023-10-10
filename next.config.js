/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol:"https",
                hostname:"raw.githubusercontent.com",
                port: "",
            }
        ]
    },
    output: "export",
    basePath:"/pokedoku-unlimited",
    assetPrefix:"/pokedoku-unlimited"
}

module.exports = nextConfig
