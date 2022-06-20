import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import { usePrefix } from '../_util/hooks';
import usePaginationClass from './hooks/use_pagination_class';
import withDefaultProps from '../_util/hocs/withDefaultProps';
import { PaginationProps } from './props'; // TODO: 待开发

import { jsx as _jsx } from "react/jsx-runtime";

function Pagination(props) {
  _objectDestructuringEmpty(props);

  var name = usePrefix('pagination');
  var className = usePaginationClass(name, props);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: "pagination"
  });
}

export default withDefaultProps(Pagination, {
  direction: 'horizontal',
  size: 'small',
  wrap: false
}); // 导出组件属性

export { PaginationProps };