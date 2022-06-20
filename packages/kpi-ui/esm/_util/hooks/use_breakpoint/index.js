import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useEffect, useState } from 'react';
import MediaObserver, { initMatches } from './media_observer'; // 断点
// TODO: 是否应该只返回最大的某一个值呢?

export default function useBreakpoint() {
  var _useState = useState(function () {
    return initMatches;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      matches = _useState2[0],
      updateMatches = _useState2[1];

  useEffect(function () {
    var observer = new MediaObserver(updateMatches);
    return observer.unsubscribe;
  }, []);
  return matches;
}