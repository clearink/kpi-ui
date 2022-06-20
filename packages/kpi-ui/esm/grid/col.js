import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import { usePrefix } from '../_util/hooks';
import useColClass from './hooks/use_col_class';
import withDefaultProps from '../_util/hocs/withDefaultProps';
import { jsx as _jsx } from "react/jsx-runtime";

function Col(props) {
  _objectDestructuringEmpty(props);

  var name = usePrefix('col');
  var className = useColClass(name, props);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: "grid"
  });
}

export default withDefaultProps(Col, {});