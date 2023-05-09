const { defineConfig } = require('cypress')

module.exports = defineConfig({
  'projectId': '4b7344',
  e2e: {
    setupNodeEvents(on, config) {

      const version = config.env.VERSION || 'local'

      const urls = {
        local: "http://localhost:8080",
        staging: "http://35.228.21.158",
        prod: "https://example.com"
      }

      // choosing version from urls object
      config.baseUrl = urls[version]

      return config
    },
  },
})
