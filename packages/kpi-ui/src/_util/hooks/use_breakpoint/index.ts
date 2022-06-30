import { useEffect, useState } from 'react';
import MediaObserver, { initMatches } from './media_observer';

// 断点
// TODO: 是否应该只返回最大的某一个值呢?
export default function useBreakpoint() {
  const [matches, updateMatches] = useState(() => initMatches);
  useEffect(() => {
    const observer = new MediaObserver(updateMatches);
    return observer.unsubscribe;
  }, []);
  return matches;
}
