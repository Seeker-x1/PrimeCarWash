"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";

export function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={`flex h-full w-full flex-col overflow-hidden rounded-[6px] bg-black text-white ${className ?? ""}`}
      {...props}
    />
  );
}

export function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="border-b border-[#999999] px-3">
      <CommandPrimitive.Input
        className={`flex h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-[#777] ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}

export function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={`max-h-64 overflow-y-auto overflow-x-hidden ${className ?? ""}`}
      {...props}
    />
  );
}

export function CommandEmpty(
  props: React.ComponentProps<typeof CommandPrimitive.Empty>,
) {
  return (
    <CommandPrimitive.Empty
      className="px-3 py-4 text-sm text-[#999999]"
      {...props}
    />
  );
}

export function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={`overflow-hidden p-1 text-white ${className ?? ""}`}
      {...props}
    />
  );
}

export function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={`relative flex cursor-default select-none items-center rounded-[6px] px-3 py-2 text-sm outline-none data-[selected=true]:bg-white data-[selected=true]:text-black ${className ?? ""}`}
      {...props}
    />
  );
}
