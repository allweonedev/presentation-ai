"use client";

import { PlateElement, type StyledPlateElementProps } from "platejs/react";
import { ARROW_LIST, PYRAMID_GROUP, TIMELINE_GROUP } from "../../lib";
import { type TArrowListElement } from "../../plugins/arrow-plugin";
import { type TVisualizationListElement } from "../../plugins/legacy/visualization-list-plugin";
import { type TPyramidGroupElement } from "../../plugins/pyramid-plugin";
import { type TTimelineGroupElement } from "../../plugins/timeline-plugin";
import ArrowList from "../arrow-list";
import Pyramid from "../pyramid";
import Timeline from "../timeline";
// Main visualization list component with withRef pattern
export const VisualizationListElement = ({
  element,
  className,
  ref,
  ...props
}: StyledPlateElementProps<TVisualizationListElement>) => {
  const { visualizationType, children } = element as TVisualizationListElement;
  const renderer = () => {
    switch (visualizationType) {
      case "pyramid":
        const pyramidElement = {
          ...element,
          children: element.children,
          type: PYRAMID_GROUP,
        };

        return (
          <Pyramid
            element={pyramidElement as unknown as TPyramidGroupElement}
            className={className}
            ref={ref}
            {...props}
          >
            {props.children}
          </Pyramid>
        );
      case "arrow":
        const arrowElement = {
          ...element,
          children: element.children,
          type: ARROW_LIST,
        };
        return (
          <ArrowList
            element={arrowElement as unknown as TArrowListElement}
            className={className}
            ref={ref}
            {...props}
          >
            {props.children}
          </ArrowList>
        );
      case "timeline":
        const timelineElement = {
          ...element,
          children: element.children,
          type: TIMELINE_GROUP,
          orientation: "vertical",
          sidedness: "single",
        };

        return (
          <Timeline
            element={timelineElement as unknown as TTimelineGroupElement}
            className={className}
            ref={ref}
            {...props}
          >
            {children}
          </Timeline>
        );
      default:
        return <div>{props.children}</div>;
    }
  };

  return (
    <PlateElement element={element} className={className} ref={ref} {...props}>
      {renderer()}
    </PlateElement>
  );
};
