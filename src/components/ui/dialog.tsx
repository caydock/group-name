"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type DialogContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function Dialog({
  open: controlledOpen,
  onOpenChange,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  const open = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(true)
    }
    onOpenChange?.(true)
  }

  const close = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(false)
    }
    onOpenChange?.(false)
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, close])

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>
      <div data-slot="dialog" {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const context = React.useContext(DialogContext)

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={context?.open}
      className={className}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const context = React.useContext(DialogContext)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (context?.isOpen && contentRef.current) {
      contentRef.current.focus()
    }
  }, [context?.isOpen])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      context?.close()
    }
  }

  if (!context?.isOpen) return null

  return (
    <div
      data-slot="dialog-overlay"
      className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        data-slot="dialog-content"
        tabIndex={-1}
        className={`bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg outline-none sm:max-w-lg ${className || ""}`}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            type="button"
            data-slot="dialog-close"
            onClick={context.close}
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={`flex flex-col gap-2 text-center sm:text-left ${className || ""}`}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const context = React.useContext(DialogContext)

  return (
    <div
      data-slot="dialog-footer"
      className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className || ""}`}
      {...props}
    >
      {children}
      {showCloseButton && (
        <Button variant="outline" onClick={context?.close}>
          Close
        </Button>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="dialog-title"
      className={`text-lg leading-none font-semibold ${className || ""}`}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dialog-description"
      className={`text-muted-foreground text-sm ${className || ""}`}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
