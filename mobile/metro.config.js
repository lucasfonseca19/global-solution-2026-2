const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// Compartilha apenas o módulo puro da IoT, sem infraestrutura de monorepo.
config.watchFolders = [path.resolve(__dirname, '../iot')];
module.exports = config;
