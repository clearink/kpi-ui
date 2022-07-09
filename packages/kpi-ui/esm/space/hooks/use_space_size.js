import { useMemo } from 'react';
import { SPACE_SIZE } from '../../_shard/constant';
export default function useSpaceSize(size, hasSplit) {
  return useMemo(function () {
    var sizes = Array.isArray(size) ? size : [size, size];
    var denominator = hasSplit ? 2 : 1;
    return sizes.map(function (item) {
      if (typeof item === 'string') return (SPACE_SIZE[item] || 0) / denominator;
      return (item || 0) / denominator;
    });
  }, [size, hasSplit]);
}