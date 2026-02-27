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

type ToastContextValue = {
  toasts: Toast[]
  toast: (toast: Toast) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

function toast({ type = "info", title, description, action, duration = 4000 }: Omit<Toast, "id">): string | undefined {
  const context = React.useContext(ToastContext)
  if (!context) return undefined

  const id = Math.random().toString(36).substr(2, 9)
  const newToast: Toast = { id, type, title, description, action, duration }
  context.toast(newToast)

  if (type !== "loading") {
    setTimeout(() => {
      context.dismiss(id)
    }, duration)
  }

  return id
}

toast.success = (title: string, description?: string) => toast({ type: "success", title, description })
toast.error = (title: string, description?: string) => toast({ type: "error", title, description })
toast.warning = (title: string, description?: string) => toast({ type: "warning", title, description })
toast.info = (title: string, description?: string) => toast({ type: "info", title, description })
toast.loading = (title: string, description?: string) => toast({ type: "loading", title, description, duration: Infinity })

function Toaster({ className, ...props }: React.ComponentProps<"div">) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toastFn = React.useCallback((newToast: Toast) => {
    setToasts((prev) => [...prev, newToast])
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast: toastFn, dismiss }}>
      <div
        data-slot="toaster"
        className={`fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 max-h-screen w-full sm:max-w-md ${className || ""}`}
        {...props}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
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

function ToastItem({ type = "info", title, description, action, onDismiss }: Toast & { onDismiss: () => void }) {
  return (
    <div
      data-slot="toast"
      className={cn(
        "bg-background text-foreground border border-border shadow-lg rounded-lg p-4 flex items-start gap-3 pointer-events-auto transition-all",
        "animate-in slide-in-from-right-full duration-300"
      )}
    >
      <div className={cn("rounded-full p-1 text-white", typeStyles[type])}>
        {icons[type]}
      </div>
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}

export { Toaster, toast }
