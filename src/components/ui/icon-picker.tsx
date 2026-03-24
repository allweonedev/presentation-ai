"use client";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState, type ReactNode } from "react";
import { type IconType } from "react-icons";

// Define interfaces for type safety
interface IconItem {
  name: string;
  component: ReactNode;
}

type IconModule = Record<string, IconType>;

// Define the prop types
interface IconPickerProps
  extends
    React.ComponentProps<"button">,
    Omit<VariantProps<typeof buttonVariants>, "size"> {
  onIconSelect?: (iconName: string, iconComponent: ReactNode) => void;
  defaultIcon?: string;
  searchTerm?: string; // Added prop to automatically search and select the first matching icon
  size?: "sm" | "md" | "lg";
}

// Main Icon Picker Component
const IconPicker = ({
  onIconSelect,
  defaultIcon = "FaHome",
  searchTerm = "",
  className,
  size,
  ...props
}: IconPickerProps) => {
  const [icon, setIcon] = useState<string>(defaultIcon);
  const [iconComponent, setIconComponent] = useState<ReactNode>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [internalSearchTerm, setInternalSearchTerm] = useState<string>("");
  const [filteredIcons, setFilteredIcons] = useState<IconItem[]>([]);
  const [availableIcons, setAvailableIcons] = useState<IconItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);

  // Size mappings for the trigger button
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  // Load some initial popular icons when the sheet opens
  useEffect(() => {
    if (isOpen && availableIcons.length === 0) {
      void loadPopularIcons();
    }
  }, [isOpen, availableIcons.length]);

  // Function to load popular icons when the sheet first opens
  const loadPopularIcons = async () => {
    setIsLoading(true);
    try {
      // Load a set of common icons from Font Awesome
      const faModule = await import("react-icons/fa");
      const popularIconNames = [
        "FaHome",
        "FaUser",
        "FaCog",
        "FaSearch",
        "FaBell",
        "FaCalendar",
        "FaEnvelope",
        "FaHeart",
        "FaStar",
        "FaBookmark",
        "FaCheck",
        "FaTimes",
        "FaEdit",
        "FaTrash",
        "FaDownload",
        "FaUpload",
        "FaShare",
        "FaLink",
        "FaMapMarker",
        "FaClock",
        "FaCamera",
        "FaVideo",
        "FaMusic",
        "FaFile",
        "FaFolder",
        "FaComments",
        "FaThumbsUp",
        "FaPhone",
        "FaLock",
        "FaUserPlus",
      ];

      const iconList = popularIconNames
        .map((name) => ({
          name,
          component: faModule[name]
            ? React.createElement(faModule[name], { size: 24 })
            : null,
        }))
        .filter((item) => item.component);

      setAvailableIcons(iconList);
      setFilteredIcons(iconList);
    } catch (error) {
      console.error("Error loading popular icons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to dynamically load icons based on search
  const searchIcons = async (term: string) => {
    if (!term || term.length < 2) {
      setFilteredIcons(availableIcons);
      return;
    }

    setIsLoading(true);
    try {
      const termLower = term.toLowerCase();
      const modules: IconModule[] = [];

      // Try to load the most likely library based on prefix
      if (termLower.startsWith("fa")) {
        const mod = await import("react-icons/fa");
        modules.push(mod as unknown as IconModule);
      } else if (termLower.startsWith("fi")) {
        const mod = await import("react-icons/fi");
        modules.push(mod as unknown as IconModule);
      } else if (termLower.startsWith("ai")) {
        const mod = await import("react-icons/ai");
        modules.push(mod as unknown as IconModule);
      } else if (termLower.startsWith("bs")) {
        const mod = await import("react-icons/bs");
        modules.push(mod as unknown as IconModule);
      } else if (termLower.startsWith("bi")) {
        const mod = await import("react-icons/bi");
        modules.push(mod as unknown as IconModule);
      } else if (termLower.startsWith("md")) {
        const mod = await import("react-icons/md");
        modules.push(mod as unknown as IconModule);
      } else {
        // If no prefix match, search in common libraries
        const [fa, md] = await Promise.all([
          import("react-icons/fa"),
          import("react-icons/md"),
        ]);
        modules.push(fa as unknown as IconModule, md as unknown as IconModule);
      }

      // Find icons that match the search term
      let results: IconItem[] = [];

      modules.forEach((module) => {
        const matches = Object.keys(module)
          .filter((key) => key.toLowerCase().includes(termLower))
          .slice(0, 40) // Limit results to prevent too many icons
          .map((name) => ({
            name,
            component: module[name]
              ? React.createElement(module[name], { size: 24 })
              : null,
          }))
          .filter((item) => item.component);

        results = [...results, ...matches];
      });

      setFilteredIcons(results.slice(0, 60)); // Limit total results
    } catch (error) {
      console.error("Error searching icons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load a specific icon component
  const loadIconComponent = async (iconName: string): Promise<ReactNode> => {
    setIsLoading(true);
    try {
      // Extract the library prefix
      const prefix = iconName.slice(0, 2).toLowerCase();

      // Dynamic import based on the prefix
      let iconModule: IconModule;
      switch (prefix) {
        case "fa": {
          const mod = await import("react-icons/fa");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "fi": {
          const mod = await import("react-icons/fi");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "ai": {
          const mod = await import("react-icons/ai");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "bs": {
          const mod = await import("react-icons/bs");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "bi": {
          const mod = await import("react-icons/bi");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "gi": {
          const mod = await import("react-icons/gi");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "hi": {
          const mod = await import("react-icons/hi");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "im": {
          const mod = await import("react-icons/im");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "io": {
          const mod = await import("react-icons/io");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "md": {
          const mod = await import("react-icons/md");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "ri": {
          const mod = await import("react-icons/ri");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "si": {
          const mod = await import("react-icons/si");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "ti": {
          const mod = await import("react-icons/ti");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "vsc": {
          const mod = await import("react-icons/vsc");
          iconModule = mod as unknown as IconModule;
          break;
        }
        case "wi": {
          const mod = await import("react-icons/wi");
          iconModule = mod as unknown as IconModule;
          break;
        }
        default: {
          const mod = await import("react-icons/fa");
          iconModule = mod as unknown as IconModule;
          break;
        }
      }

      const IconComponent = iconModule[iconName];
      return IconComponent ? <IconComponent size={24} /> : null;
    } catch (error) {
      console.error("Error loading icon:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle initializing with searchTerm or defaultIcon
  useEffect(() => {
    const findAndSelectIcon = async () => {
      if (searchTerm) {
        // If a searchTerm is provided, search and select the first result
        setIsLoading(true);
        try {
          // Use a simpler search approach for initialization to prevent loading too many libraries
          const prefix = searchTerm.toLowerCase().slice(0, 2);
          let iconModule: IconModule;

          if (prefix === "fa" || !prefix) {
            const mod = await import("react-icons/fa");
            iconModule = mod as unknown as IconModule;
          } else if (prefix === "md") {
            const mod = await import("react-icons/md");
            iconModule = mod as unknown as IconModule;
          } else if (prefix === "bs") {
            const mod = await import("react-icons/bs");
            iconModule = mod as unknown as IconModule;
          } else {
            // Default to FA
            const mod = await import("react-icons/fa");
            iconModule = mod as unknown as IconModule;
          }

          // Find first matching icon
          const termLower = searchTerm.toLowerCase();
          const matchingIconName = Object.keys(iconModule).find((key) =>
            key.toLowerCase().includes(termLower),
          );

          if (matchingIconName) {
            setIcon(matchingIconName);
            const MatchedIconComponent = iconModule[matchingIconName]!;
            const component = React.createElement(MatchedIconComponent, {
              size: 24,
            });
            setIconComponent(component);

            // Also notify the parent if onIconSelect is provided
            if (onIconSelect) {
              onIconSelect(matchingIconName, component);
            }
          } else {
            // If no matches, fall back to default icon
            const component = await loadIconComponent(defaultIcon);
            setIconComponent(component);
          }
        } catch (error) {
          console.error("Error initializing from search term:", error);
          // Fall back to default icon
          const component = await loadIconComponent(defaultIcon);
          setIconComponent(component);
        } finally {
          setIsLoading(false);
          setInitialLoadDone(true);
        }
      } else {
        // Just load the default icon
        const component = await loadIconComponent(defaultIcon);
        setIconComponent(component);
        setInitialLoadDone(true);
      }
    };

    void findAndSelectIcon();
  }, [searchTerm, defaultIcon, onIconSelect]);

  // Handle search input changes
  useEffect(() => {
    // Skip during the initial load if we're handling searchTerm prop
    if (!initialLoadDone && searchTerm) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      void searchIcons(internalSearchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [internalSearchTerm, initialLoadDone]);

  const handleSelectIcon = async (selectedName: string) => {
    setIcon(selectedName);

    // Load the new icon component
    const component = await loadIconComponent(selectedName);
    setIconComponent(component);

    // If we have an external handler, call it with both the name and component
    if (onIconSelect) {
      onIconSelect(selectedName, component);
    }

    // Close the sheet after selection
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            sizeClasses[size ?? "md"],
            "flex items-center justify-center rounded-md border shadow-2xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden",
            className,
          )}
          aria-label="Select icon"
          {...props}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            (iconComponent ?? <div className="h-4 w-4" />)
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-5">
          <SheetTitle>Choose an Icon</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search icons..."
            value={internalSearchTerm}
            onChange={(e) => setInternalSearchTerm(e.target.value)}
            className="w-full"
            autoFocus
          />

          {isLoading ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid max-h-[65vh] grid-cols-5 gap-2 overflow-y-auto p-1">
              {filteredIcons.length > 0 ? (
                filteredIcons.map((item, index) => (
                  <Button
                    key={`${item.name}-${index}`}
                    variant={icon === item.name ? "default" : "outline"}
                    className="flex aspect-square h-12 items-center justify-center p-2"
                    onClick={() => handleSelectIcon(item.name)}
                    title={item.name}
                  >
                    {item.component}
                  </Button>
                ))
              ) : (
                <div className="col-span-5 py-8 text-center text-muted-foreground">
                  No icons found. Try a different search term.
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Export the component
export { IconPicker };
