import { usePrefix } from '../_hooks';
import { withDefault } from '../_utils';
import useRowClass from './hooks/use_row_class';
import { jsx as _jsx } from "react/jsx-runtime";

function Row(props) {
  var children = props.children;
  var name = usePrefix('row');
  var className = useRowClass(name);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: children
  });
}

export default withDefault(Row, {
  align: 'top',
  gutter: 0,
  justify: 'start',
  wrap: true
});