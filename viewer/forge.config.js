module.exports = {
  packagerConfig: {
    icon: "./assets/app_icon",
    overwrite: true,
    osxSign: {
      identity: "takiguchi-yu",
    }
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "clapped-audience"
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: [ "darwin" ]
    }
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "takiguchi-yu",
          name: "clapped-audience"
        }
      }
    }
  ],
  hooks: {
    postPackage: async (forgeConfig, options) => {
      if (options.spinner) {
        options.spinner.info(`Completed packaging for ${options.platform} / ${options.arch} at ${options.outputPaths[0]}`);
      }
    }
  }
}
