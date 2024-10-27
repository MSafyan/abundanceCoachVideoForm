"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Define interfaces for the component props
// @ts-ignore
interface MultiSelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  value: string[];
  onValueChange: (value: string[]) => void;
  multiple?: boolean;
}

interface MultiSelectContextValue {
  selected: string[];
  onSelect: (value: string) => void;
}

// Create context for managing selected values
const MultiSelectContext = React.createContext<MultiSelectContextValue>({
  selected: [],
  onSelect: () => {},
});

const MultiSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  MultiSelectProps
>(({ children, value, onValueChange, multiple = true, ...props }, ref) => {
  // Handler for selecting/deselecting values
  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (multiple) {
        const newValue = value.includes(selectedValue)
          ? value.filter((v) => v !== selectedValue)
          : [...value, selectedValue];
        onValueChange(newValue);
      } else {
        onValueChange([selectedValue]);
      }
    },
    [multiple, onValueChange, value]
  );

  return (
    <MultiSelectContext.Provider
      value={{ selected: value, onSelect: handleSelect }}
    >
      <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>
    </MultiSelectContext.Provider>
  );
});
MultiSelect.displayName = "MultiSelect";

const MultiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
MultiSelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Updated MultiSelectValue to handle multiple values
const MultiSelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, children, placeholder = "Select items...", ...props }, ref) => {
  const { selected } = React.useContext(MultiSelectContext);

  if (!selected.length) {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {selected.map((value) => (
        <span
          key={value}
          className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-sm text-xs"
        >
          {value}
        </span>
      ))}
    </div>
  );
});
MultiSelectValue.displayName = "MultiSelectValue";

const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
MultiSelectContent.displayName = SelectPrimitive.Content.displayName;

// Updated MultiSelectItem to handle multiple selection
const MultiSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    value: string;
  }
>(({ className, children, value, ...props }, ref) => {
  const { selected, onSelect } = React.useContext(MultiSelectContext);
  const isSelected = selected.includes(value);

  return (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-accent",
        className
      )}
      {...props}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(value);
      }}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
MultiSelectItem.displayName = SelectPrimitive.Item.displayName;

const MultiSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
MultiSelectLabel.displayName = SelectPrimitive.Label.displayName;

const MultiSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
MultiSelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  MultiSelect,
  MultiSelectValue,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectLabel,
  MultiSelectItem,
  MultiSelectSeparator,
};
