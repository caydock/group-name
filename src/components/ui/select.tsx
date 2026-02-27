"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

type SelectSize = "sm" | "default"

interface SelectProps<T extends string = string> {
  value?: T
  onValueChange?: (value: T) => void
  defaultValue?: T
  children: React.ReactNode
  size?: SelectSize
  placeholder?: string
  className?: string
}

function Select<T extends string = string>({ value, onValueChange, defaultValue, children, size = "default", placeholder, className, ...props }: SelectProps<T>) {
  const [internalValue, setInternalValue] = React.useState<T | "">(defaultValue as T || "")

  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as T
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const items = React.Children.toArray(children).flatMap((child) => {
    if (React.isValidElement(child) && (child.type as any).name === "SelectContent") {
      return React.Children.toArray((child as any).props.children)
    }
    return child
  })

  return (
    <div className="relative" data-slot="select">
      <select
        value={currentValue}
        onChange={handleChange}
        className={`w-full appearance-none border-input bg-background text-foreground focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${size === "sm" ? "h-8" : "h-9"} ${className || ""}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {items}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50" />
    </div>
  )
}

function SelectItem({ value, children, ...props }: { value: string | number; children: React.ReactNode } & React.ComponentProps<"option">) {
  return <option value={value} {...props}>{children}</option>
}

function SelectGroup({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <optgroup label={label}>
      {children}
    </optgroup>
  )
}

function SelectSeparator() {
  return null
}

function SelectLabel({ children }: { children: React.ReactNode }) {
  return null
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SelectTrigger({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function SelectValue({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
