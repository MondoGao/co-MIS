import * as R from "ramda";

export function mapRouteConfig({
  config = [],
  ctx = {},
  renderNode = R.identity,
  renderLeaf = R.identity
}) {
  return R.map(item => {
    if ("children" in item) {
      return renderNode({ item, ctx, renderLeaf, renderNode });
    }

    return renderLeaf({ item, ctx, renderNode, renderLeaf });
  })(config);
}
