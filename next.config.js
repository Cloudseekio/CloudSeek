module.exports = {
  // ...other config
  async redirects() {
    return [
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blogs/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ]
  },
} 