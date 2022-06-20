import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import { usePrefix } from '../_util/hooks';
import useRowClass from './hooks/use_row_class';
import withDefaultProps from '../_util/hocs/withDefaultProps';
import { jsx as _jsx } from "react/jsx-runtime";

function Row(props) {
  _objectDestructuringEmpty(props);

  var name = usePrefix('row');
  var className = useRowClass(name, props);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: "grid"
  });
}

export default withDefaultProps(Row, {
  align: 'top',
  gutter: 0,
  justify: 'start',
  wrap: true
});