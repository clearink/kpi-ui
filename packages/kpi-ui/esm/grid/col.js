import { usePrefix } from '../_hooks';
import { withDefault } from '../_utils';
import useColClass from './hooks/use_col_class';
import { jsx as _jsx } from "react/jsx-runtime";

function Col(props) {
  var children = props.children;
  var name = usePrefix('col');
  var className = useColClass(name, props);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: children
  });
}

export default withDefault(Col, {});