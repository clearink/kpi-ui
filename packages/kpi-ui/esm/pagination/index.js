import { withDefault } from '../_utils';
import { usePrefix } from '../_hooks';
import usePaginationClass from './hooks/use_pagination_class'; // import { PaginationProps } from './props';
// TODO: 待开发

import { jsx as _jsx } from "react/jsx-runtime";

function Pagination() {
  var name = usePrefix('pagination');
  var className = usePaginationClass(name);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: "pagination"
  });
}

export default withDefault(Pagination, {
  direction: 'horizontal',
  size: 'small',
  wrap: false
});