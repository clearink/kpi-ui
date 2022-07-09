import { useMemo } from 'react';
import cls from 'classnames'; // import { BreadcrumbProps } from '../props';

export default function useBreadcrumbClass(name) {
  return useMemo(function () {
    return cls(name, {});
  }, [name]);
}