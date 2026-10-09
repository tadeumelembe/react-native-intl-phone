const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolve the library from its TypeScript source so edits in ../src hot-reload
// without running `yarn build` first.
config.resolver.unstable_conditionNames = [
  'source',
  ...(config.resolver.unstable_conditionNames ?? ['require', 'react-native']),
];

module.exports = config;
