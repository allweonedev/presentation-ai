import { type TElement } from "platejs";
import { type SlateElementProps, SlateElement } from "platejs/static";

import { ARROW_LIST, PYRAMID_GROUP, TIMELINE_GROUP } from "../../lib";
import { type TArrowListElement } from "../../plugins/arrow-plugin";
import { type TTimelineGroupElement } from "../../plugins/timeline-plugin";
import ArrowListStatic from "../static/arrow-list-static";
import PyramidStatic from "../static/pyramid-static";
import TimelineStatic from "../static/timeline-static";

export default function VisualizationListElementStatic(
  props: SlateElementProps,
) {
  const { element, className, children, ...rest } = props;
  const visualizationType = element.visualizationType as
    | "arrow"
    | "pyramid"
    | "timeline";

  const renderer = () => {
    switch (visualizationType) {
      case "pyramid": {
        const pyramidElement = {
          ...element,
          children: element.children,
          type: PYRAMID_GROUP,
        };

        return (
          <PyramidStatic
            element={pyramidElement as TElement}
            className={className}
            {...rest}
          >
            {children}
          </PyramidStatic>
        );
      }
      case "arrow": {
        const arrowElement = {
          ...element,
          children: element.children,
          type: ARROW_LIST,
        };
        return (
          <ArrowListStatic
            element={arrowElement as TArrowListElement}
            className={className}
            {...rest}
          >
            {children}
          </ArrowListStatic>
        );
      }
      case "timeline": {
        const timelineElement = {
          ...element,
          children: element.children,
          type: TIMELINE_GROUP,
          orientation: "vertical",
          sidedness: "single",
        };

        return (
          <TimelineStatic
            element={timelineElement as TTimelineGroupElement}
            className={className}
            {...rest}
          >
            {children}
          </TimelineStatic>
        );
      }
      default:
        return <div>{children}</div>;
    }
  };

  return (
    <SlateElement element={element} className={className} {...rest}>
      {renderer()}
    </SlateElement>
  );
}


