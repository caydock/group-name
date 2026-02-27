"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

type SelectSize = "sm" | "default"

interface SelectProps<T extends string = string> {
  value?: T
  onValueChange?: (value: T) => void
  defaultValue?: T
  children: React.ReactNode
}

function Select<T extends string = string>({ value, onValueChange, defaultValue, children, ...props }: SelectProps<T> & React.ComponentProps<"div">) {
  const [internalValue, setInternalValue] = React.useState<T | "">(defaultValue as T || "")

  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (newValue: T) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <div data-slot="select" {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            value: currentValue,
            onValueChange: handleChange,
          })
        }
        return child
      })}
    </div>
  )
}

interface SelectTriggerProps {
  size?: SelectSize
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  placeholder?: string
}

function SelectTrigger({ className, size = "default", children, placeholder, ...props }: SelectTriggerProps & React.ComponentProps<"button">) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      onClick={() => setIsOpen(!isOpen)}
      onBlur={(e) => {
        setTimeout(() => setIsOpen(false), 150)
      }}
      className={`border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ${size === "sm" ? "h-8" : "h-9"} ${className || ""}`}
      {...props}
    >
      <span className="line-clamp-1 flex items-center gap-2">
        {children || placeholder || "Select..."}
      </span>
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  )
}

function SelectValue({ placeholder, value }: { placeholder?: string; value?: string }) {
  return value || <span className="text-muted-foreground">{placeholder}</span>
}

interface SelectContentProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

function SelectContent({ className, children, value, onValueChange, ...props }: SelectContentProps & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-content"
      className={`bg-popover text-popover-foreground relative z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md p-1 ${className || ""}`}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any).name === "SelectItem") {
          return React.cloneElement(child as any, {
            isSelected: String((child.props as any).value) === String(value),
            onSelect: () => onValueChange?.(String((child.props as any).value)),
          })
        }
        return child
      })}
    </div>
  )
}

interface SelectItemProps {
  value: string | number
  children: React.ReactNode
  isSelected?: boolean
  onSelect?: () => void
}

function SelectItem({ className, children, isSelected, onSelect, ...props }: SelectItemProps & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="select-item"
      onClick={onSelect}
      className={`focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? "bg-accent" : ""} ${className || ""}`}
      {...props}
    >
      {children}
      {isSelected && (
        <span
          data-slot="select-item-indicator"
          className="absolute right-2 flex size-3.5 items-center justify-center"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      )}
    </button>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-label"
      className={`text-muted-foreground px-2 py-1.5 text-xs ${className || ""}`}
      {...props}
    />
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-separator"
      className={`bg-border pointer-events-none -mx-1 my-1 h-px ${className || ""}`}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
