"use client";

import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@platejs/table/react";

import {
  PresentationTableCellElement,
  PresentationTableCellHeaderElement,
  PresentationTableElement,
  PresentationTableRowElement,
} from "../custom-elements/presentation-table-node";

export const PresentationTableKit = [
  TablePlugin.withComponent(PresentationTableElement),
  TableRowPlugin.withComponent(PresentationTableRowElement),
  TableCellPlugin.withComponent(PresentationTableCellElement),
  TableCellHeaderPlugin.withComponent(PresentationTableCellHeaderElement),
];
