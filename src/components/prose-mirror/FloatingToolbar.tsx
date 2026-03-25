import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bold, ChevronDown, Code, Heading, Italic, List } from "lucide-react";
import { setBlockType, toggleMark } from "prosemirror-commands";
import { type NodeType } from "prosemirror-model";
import { liftListItem, wrapInList } from "prosemirror-schema-list";
import { type Command } from "prosemirror-state";
import { type EditorView } from "prosemirror-view";
import type React from "react";

interface FloatingToolbarProps {
  view: EditorView;
  isVisible: boolean;
  top: number;
  left: number;
}

interface ListType {
  type: "bullet" | "ordered";
  label: string;
  node: NodeType;
}

interface HeadingLevel {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  view,
  isVisible,
  top,
  left,
}) => {
  if (!isVisible) return null;

  const { marks, nodes } = view.state.schema;
  const strongMark = marks.strong;
  const emMark = marks.em;
  const codeMark = marks.code;
  const bulletListNode = nodes.bullet_list;
  const orderedListNode = nodes.ordered_list;
  const headingNode = nodes.heading;
  const paragraphNode = nodes.paragraph;
  const listItemNode = nodes.list_item;

  if (
    !strongMark ||
    !emMark ||
    !codeMark ||
    !bulletListNode ||
    !headingNode ||
    !paragraphNode ||
    !listItemNode ||
    !orderedListNode
  ) {
    return null;
  }

  const execCommand = (cmd: Command): void => {
    cmd(view.state, view.dispatch, view);
    view.focus();
  };

  // Helper to check if selection is in a specific node type
  const isInNode = (
    nodeType: NodeType,
    attrs: { level?: number } = {},
  ): boolean => {
    const { $from } = view.state.selection;
    const node = $from.node($from.depth);
    if (attrs.level !== undefined) {
      return node.type === nodeType && node.attrs.level === attrs.level;
    }
    return node.type === nodeType;
  };

  // Helper to check if selection is in a list
  const isInList = (listType: NodeType): boolean => {
    const { $from } = view.state.selection;
    let depth = $from.depth;
    while (depth > 0) {
      const node = $from.node(depth);
      if (node.type === listType) {
        return true;
      }
      depth--;
    }
    return false;
  };

  // Toggle list command
  const toggleList = (listType: NodeType): Command => {
    return (state, dispatch, view) => {
      if (isInList(listType)) {
        // If we're in this type of list, lift the list items out
        return liftListItem(listItemNode)(state, dispatch, view);
      } else {
        // If we're not in a list, or in a different type of list, wrap in this list type
        return wrapInList(listType)(state, dispatch, view);
      }
    };
  };

  // Toggle heading command
  const toggleHeading = (level: number): Command => {
    return (state, dispatch, view) => {
      if (isInNode(headingNode, { level })) {
        // If it's already this heading level, convert to paragraph
        return setBlockType(paragraphNode)(state, dispatch, view);
      } else {
        // Otherwise, convert to this heading level
        return setBlockType(headingNode, { level })(state, dispatch, view);
      }
    };
  };

  const buttonVariants = "h-8 w-8 p-0";
  const iconClass = "h-4 w-4";

  const headingLevels: HeadingLevel[] = [
    { level: 1, label: "Heading 1" },
    { level: 2, label: "Heading 2" },
    { level: 3, label: "Heading 3" },
    { level: 4, label: "Heading 4" },
    { level: 5, label: "Heading 5" },
    { level: 6, label: "Heading 6" },
  ];

  const listTypes: ListType[] = [
    { type: "bullet", label: "Bullet List", node: bulletListNode },
    { type: "ordered", label: "Numbered List", node: orderedListNode },
  ];

  const handleMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="floating-toolbar absolute z-50 flex w-fit items-center gap-1 rounded-md border bg-background/95 p-1 shadow-md backdrop-blur-xs supports-backdrop-filter:bg-background/80"
      style={{
        top: 0,
        left: 0,
        transform: `translate(${left}px, ${top - 60}px)`,
        transformOrigin: "0 0",
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1">
        <Button
          variant={
            view.state.selection.$from
              .marks()
              .some((mark) => mark.type === strongMark)
              ? "secondary"
              : "ghost"
          }
          size="icon"
          className={buttonVariants}
          onMouseDown={handleMouseDown}
          onClick={() => execCommand(toggleMark(strongMark))}
          title="Bold (Ctrl+B)"
        >
          <Bold className={iconClass} />
        </Button>
        <Button
          variant={
            view.state.selection.$from
              .marks()
              .some((mark) => mark.type === emMark)
              ? "secondary"
              : "ghost"
          }
          size="icon"
          className={buttonVariants}
          onMouseDown={handleMouseDown}
          onClick={() => execCommand(toggleMark(emMark))}
          title="Italic (Ctrl+I)"
        >
          <Italic className={iconClass} />
        </Button>
        <Button
          variant={
            view.state.selection.$from
              .marks()
              .some((mark) => mark.type === codeMark)
              ? "secondary"
              : "ghost"
          }
          size="icon"
          className={buttonVariants}
          onMouseDown={handleMouseDown}
          onClick={() => execCommand(toggleMark(codeMark))}
          title="Code"
        >
          <Code className={iconClass} />
        </Button>
        <div className="h-4 w-px bg-border" />

        {/* List Types Dropdown */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={
                listTypes.some((lt) => isInList(lt.node))
                  ? "secondary"
                  : "ghost"
              }
              size="icon"
              className={buttonVariants}
              onMouseDown={handleMouseDown}
              title="Lists"
            >
              <List className={iconClass} />
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              view.focus();
            }}
          >
            {listTypes.map((listType) => (
              <DropdownMenuItem
                key={listType.type}
                onMouseDown={handleMouseDown}
                onClick={() => execCommand(toggleList(listType.node))}
                className={isInList(listType.node) ? "bg-secondary" : ""}
              >
                {listType.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Heading Levels Dropdown */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={isInNode(headingNode) ? "secondary" : "ghost"}
              size="icon"
              className={buttonVariants}
              onMouseDown={handleMouseDown}
              title="Headings"
            >
              <Heading className={iconClass} />
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              view.focus();
            }}
          >
            {headingLevels.map((heading) => (
              <DropdownMenuItem
                key={heading.level}
                onMouseDown={handleMouseDown}
                onClick={() => execCommand(toggleHeading(heading.level))}
                className={
                  isInNode(headingNode, { level: heading.level })
                    ? "bg-secondary"
                    : ""
                }
              >
                {heading.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FloatingToolbar;
