import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import { usePrefix } from '../_util/hooks';
import useBreadcrumbClass from './hooks/use_breadcrumb_class';
import withDefaultProps from '../_util/hocs/withDefaultProps';
import { jsx as _jsx } from "react/jsx-runtime";

// TODO: 待开发
function Breadcrumb(props) {
  _objectDestructuringEmpty(props);

  var name = usePrefix('breadcrumb');
  var className = useBreadcrumbClass(name, props);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: "breadcrumb"
  });
}

export default withDefaultProps(Breadcrumb, {
  direction: 'horizontal',
  size: 'small',
  wrap: false
});