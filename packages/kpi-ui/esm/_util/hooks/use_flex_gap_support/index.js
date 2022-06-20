import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useEffect, useState } from 'react';
import detectFlexGap from './detect_flex_gap'; // 是否支持 flex gap 属性 用于 Space 组件

export default function useFlexGapSupport() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      support = _useState2[0],
      setSupport = _useState2[1];

  useEffect(function () {
    setSupport(detectFlexGap());
  }, []);
  return support;
}