"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = test;
var _gulp = require("gulp");
function test() {
  console.log(123);
  return (0, _gulp.src)('./src/**/*.tsx?').pipe((0, _gulp.dest)('libs/'));
}