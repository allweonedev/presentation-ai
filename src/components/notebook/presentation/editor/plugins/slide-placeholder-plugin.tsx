import { type AnyPluginConfig } from "platejs";
import { createTPlatePlugin, type RenderNodeWrapper } from "platejs/react";
import PlaceHolderCard from "../custom-elements/placeholder-card";

const elementsToIncludeTheTemplate = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
const PlaceHolderWrapper: RenderNodeWrapper<AnyPluginConfig> = (props) => {
  const { editor, element } = props;
  const isEmpty = editor.api.isEmpty();
  const readonly = editor.api.isReadOnly();

  if (
    readonly ||
    (!isEmpty && !elementsToIncludeTheTemplate.includes(element.type))
  )
    return (props) => props.children;

  return (props) => <PlaceHolderCard {...props} />;
};

export const CustomPlaceholderPlugin = createTPlatePlugin({
  key: "customPlaceholder",
  render: {
    aboveNodes: PlaceHolderWrapper,
  },
});
