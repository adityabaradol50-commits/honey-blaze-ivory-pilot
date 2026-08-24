import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-subtle outline-none transition-shadow focus:ring-2 focus:ring-accent/30",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-subtle outline-none transition-shadow focus:ring-2 focus:ring-accent/30",
        className,
      )}
      {...props}
    />
  );
}
