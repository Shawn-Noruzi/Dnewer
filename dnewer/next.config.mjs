/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  async redirects() {
    return [
      { source: '/advantage.html', destination: '/about', permanent: true },
      { source: '/advanced-eye-exam.html', destination: '/eye-exam', permanent: true },
      { source: '/advantage-838910.html', destination: '/contact-lenses', permanent: true },
      { source: '/deals.html', destination: '/deals', permanent: true },
      { source: '/brands.html', destination: '/brands', permanent: true },
      { source: '/reviews.html', destination: '/reviews', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/online-catalog', destination: 'https://shop.factoryoptical.net', permanent: true },
    ]
  },
}
export default nextConfig
