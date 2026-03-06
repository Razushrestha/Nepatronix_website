module.exports = {
  apps: [
    {
      name: "nepatronix",
      cwd: "/var/www/nepatronix",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",

        // Admin
        ADMIN_SECRET: "adminnepatronix",

        // Sanity CMS
        NEXT_PUBLIC_SANITY_PROJECT_ID: "nnwsol6o",
        NEXT_PUBLIC_SANITY_DATASET: "production",
        NEXT_PUBLIC_SANITY_API_VERSION: "2024-01-16",
        SANITY_API_TOKEN: "skcsdujSMMQQBw18x22rfBn6DpCwLBxLjSl38ewczWmQMmBFpYWJMLeWn6c3Y2TrR8Je19ShCMfgNFsqRYVVRNgT1PiQvkSCW5mvIKRGN48jC3F5hGAcxM9p50mEeG0onTy5tWlAKKhOCRTknoI0cgK0Blynp76raonoWUvPNOHgcjYTF3hb",

        // Web3Forms
        WEB3FORMS_KEY: "b9d6d9b9-90b0-4df5-bede-d2f41c54f18b",

        // Base URL
        NEXT_PUBLIC_BASE_URL: "https://nepatronix.org",

        // Certificate Assets
        LOGO_URL: "/logo.png",
        NEXT_PUBLIC_LOGO_URL: "/logo.png",
        SIGNATORY_IMAGE_URL: "/signature.png",
        NEXT_PUBLIC_SIGNATORY_IMAGE_URL: "/signature.png",
        SIGNATORY_NAME: "Raju Shrestha",
        NEXT_PUBLIC_SIGNATORY_NAME: "Raju Shrestha",
        SIGNATORY_TITLE: "CEO and Founder",
        NEXT_PUBLIC_SIGNATORY_TITLE: "CEO and Founder",
        PARTNER_LOGO_1_URL: "/pravartak.png",
        NEXT_PUBLIC_PARTNER_LOGO_1_URL: "/pravartak.png",
        PARTNER_LOGO_2_URL: "/innovator.png",
        NEXT_PUBLIC_PARTNER_LOGO_2_URL: "/innovator.png"
      }
    }
  ]
}
