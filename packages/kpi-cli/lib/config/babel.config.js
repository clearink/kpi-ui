"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = babelConfig;

function babelConfig(mode) {
  var isCjs = mode === 'cjs';
  return {
    presets: [[require.resolve('@babel/preset-env'), {
      modules: isCjs ? undefined : false
    }], require.resolve('@babel/preset-react'), require.resolve('@babel/preset-typescript')],
    plugins: [[require.resolve('@babel/plugin-transform-runtime'), {
      regenerator: true
    }], require.resolve('@babel/plugin-proposal-class-properties')]
  };
}