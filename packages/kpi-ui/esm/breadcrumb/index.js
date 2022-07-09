import { usePrefix } from '../_hooks';
import { withDefault } from '../_utils';
import useBreadcrumbClass from './hooks/use_breadcrumb_class'; // import { BreadcrumbProps } from './props';
// TODO: 待开发

import { jsx as _jsx } from "react/jsx-runtime";

function Breadcrumb() {
  var name = usePrefix('breadcrumb');
  var className = useBreadcrumbClass(name);
  return /*#__PURE__*/_jsx("div", {
    className: className,
    children: "breadcrumb"
  });
}

export default withDefault(Breadcrumb, {});