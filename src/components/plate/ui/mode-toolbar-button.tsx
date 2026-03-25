"use client";

import * as React from "react";

import {
  type DropdownMenuProps,
  DropdownMenuItemIndicator,
} from "@radix-ui/react-dropdown-menu";
import { CheckIcon, EyeIcon, PenIcon } from "lucide-react";
import { usePlateState } from "platejs/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/plate/ui/dropdown-menu";

import { ToolbarButton } from "./toolbar";

export function ModeToolbarButton(props: DropdownMenuProps) {
  const [readOnly, setReadOnly] = usePlateState("readOnly");
  const [open, setOpen] = React.useState(false);

  const value = readOnly ? "viewing" : "editing";

  const item: Record<string, { icon: React.ReactNode; label: string }> = {
    editing: {
      icon: <PenIcon />,
      label: "Editing",
    },
    viewing: {
      icon: <EyeIcon />,
      label: "Viewing",
    },
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Editing mode" isDropdown>
          {item[value]!.icon}
          <span className="hidden lg:inline">{item[value]!.label}</span>
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[180px]" align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(newValue) => {
            if (newValue === "viewing") {
              setReadOnly(true);
            } else {
              setReadOnly(false);
            }
          }}
        >
          <DropdownMenuRadioItem
            className="pl-2 *:first:[span]:hidden *:[svg]:text-muted-foreground"
            value="editing"
          >
            <Indicator />
            {item.editing!.icon}
            {item.editing!.label}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem
            className="pl-2 *:first:[span]:hidden *:[svg]:text-muted-foreground"
            value="viewing"
          >
            <Indicator />
            {item.viewing!.icon}
            {item.viewing!.label}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Indicator() {
  return (
    <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <CheckIcon />
      </DropdownMenuItemIndicator>
    </span>
  );
}
