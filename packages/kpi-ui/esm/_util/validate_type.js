import _typeof from "@babel/runtime/helpers/typeof";
// 判断类型
export var validateType = function validateType(obj, type) {
  return Object.prototype.toString.call(obj) === "[object ".concat(type, "]");
};
export var isObject = function isObject(obj) {
  return validateType(obj, 'Object');
};
export var isPlainObject = function isPlainObject(obj) {
  return obj !== null && _typeof(obj) === 'object';
};
export var isArray = Array.isArray;
export var isUndefined = function isUndefined(obj) {
  return validateType(obj, 'Undefined');
};
export var isNull = function isNull(obj) {
  return validateType(obj, 'Null');
};
export var isNumber = function isNumber(obj) {
  return validateType(obj, 'Number');
};
export var isString = function isString(obj) {
  return validateType(obj, 'String');
};
export var isBoolean = function isBoolean(obj) {
  return validateType(obj, 'Boolean');
};
export var isFunction = function isFunction(obj) {
  return typeof obj === 'function';
};
export var isSymbol = function isSymbol(obj) {
  return validateType(obj, 'Symbol');
};
export var isBigInt = function isBigInt(obj) {
  return validateType(obj, 'BigInt');
};
export var isMap = function isMap(obj) {
  return validateType(obj, 'Map');
};
export var isNullUndefined = function isNullUndefined(obj) {
  return isNull(obj) || isUndefined(obj);
};