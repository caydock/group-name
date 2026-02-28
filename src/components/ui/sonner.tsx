"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "info" | "warning" | "error" | "loading"
type ToastAction = {
  label: string
  onClick: () => void
}

interface Toast {
  id: string
  type?: ToastType
  title?: string
  description?: string
  action?: ToastAction
  duration?: number
}

const toasts = React.createRef<Toast[] & { closing?: Set<string> }>()
const listeners = new Set<() => void>()
const updateListeners = () => listeners.forEach(l => l())

function toast({ type = "info", title, description, action, duration = 1000 }: Omit<Toast, "id">): string | undefined {
  if (!toasts.current) return undefined

  const id = Math.random().toString(36).substr(2, 9)
  const newToast: Toast = { id, type, title, description, action, duration }
  
  toasts.current.push(newToast)
  updateListeners()

  if (type !== "loading") {
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  return id
}

toast.success = (title: string, description?: string) => toast({ type: "success", title, description })
toast.error = (title: string, description?: string) => toast({ type: "error", title, description })
toast.warning = (title: string, description?: string) => toast({ type: "warning", title, description })
toast.info = (title: string, description?: string) => toast({ type: "info", title, description })
toast.loading = (title: string, description?: string) => toast({ type: "loading", title, description, duration: Infinity })

function dismiss(id: string) {
  if (!toasts.current) return
  if (!toasts.current.closing) {
    toasts.current.closing = new Set()
  }
  toasts.current.closing.add(id)
  updateListeners()
  
  setTimeout(() => {
    if (!toasts.current) return
    const index = toasts.current.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.current.splice(index, 1)
      toasts.current.closing?.delete(id)
      updateListeners()
    }
  }, 300)
}

function Toaster({ className, ...props }: React.ComponentProps<"div">) {
  const [, forceUpdate] = React.useState(0)

  React.useEffect(() => {
    toasts.current = []
    toasts.current.closing = new Set()
    listeners.add(() => forceUpdate(c => c + 1))
    return () => {
      listeners.delete(() => forceUpdate(c => c + 1))
      toasts.current = []
    }
  }, [forceUpdate])

  return (
    <div
      data-slot="toaster"
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex flex-col gap-2 p-4 max-h-screen w-full sm:max-w-md ${className || ""}`}
      {...props}
    >
      {toasts.current?.map((t) => (
        <ToastItem key={t.id} {...t} onDismiss={() => dismiss(t.id)} id={t.id} />
      ))}
    </div>
  )
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CircleCheckIcon className="size-4" />,
  info: <InfoIcon className="size-4" />,
  warning: <TriangleAlertIcon className="size-4" />,
  error: <OctagonXIcon className="size-4" />,
  loading: <Loader2Icon className="size-4 animate-spin" />,
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-green-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  loading: "bg-blue-500",
}

function ToastItem({ type = "info", title, description, action, onDismiss, id }: Toast & { onDismiss: () => void }) {
  const isClosing = toasts.current?.closing?.has(id)
  
  return (
    <div
      data-slot="toast"
      onClick={onDismiss}
      className={cn(
        "w-fit min-w-fit max-w-sm mx-auto bg-black/80 backdrop-blur-md text-white shadow-lg rounded-lg p-4 pointer-events-auto transition-all cursor-pointer text-center",
        isClosing 
          ? "animate-out fade-out duration-300" 
          : "animate-in fade-in duration-300"
      )}
    >
      <div className="space-y-1">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {description && <p className="text-sm text-gray-200">{description}</p>}
      </div>
    </div>
  )
}

export { Toaster, toast }
