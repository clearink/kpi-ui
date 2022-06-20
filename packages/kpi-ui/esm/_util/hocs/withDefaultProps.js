export default function withDefaultProps(WrappedComponent, defaultProps) {
  WrappedComponent.defaultProps = defaultProps;
  WrappedComponent.displayName = WrappedComponent.name;
  return WrappedComponent;
}