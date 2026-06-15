"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  X,
  Tag,
  ShoppingBag,
  BadgeCheck,
  Palette,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any | null;
  isLoading?: boolean;
  onSave: (values: {
    itemType: string[];
    brand: string[];
    condition: string[];
    color: string[];
  }) => void;
}

type Accent = "emerald" | "blue" | "amber" | "violet";

const accentClasses: Record<
  Accent,
  { ring: string; icon: string; chip: string; chipHover: string; add: string }
> = {
  emerald: {
    ring: "focus-within:border-emerald-400 focus-within:ring-emerald-100",
    icon: "bg-emerald-50 text-emerald-600",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    chipHover: "hover:bg-emerald-100",
    add: "text-emerald-600 hover:bg-emerald-50",
  },
  blue: {
    ring: "focus-within:border-blue-400 focus-within:ring-blue-100",
    icon: "bg-blue-50 text-blue-600",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    chipHover: "hover:bg-blue-100",
    add: "text-blue-600 hover:bg-blue-50",
  },
  amber: {
    ring: "focus-within:border-amber-400 focus-within:ring-amber-100",
    icon: "bg-amber-50 text-amber-600",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    chipHover: "hover:bg-amber-100",
    add: "text-amber-600 hover:bg-amber-50",
  },
  violet: {
    ring: "focus-within:border-violet-400 focus-within:ring-violet-100",
    icon: "bg-violet-50 text-violet-600",
    chip: "bg-violet-50 text-violet-700 border-violet-200",
    chipHover: "hover:bg-violet-100",
    add: "text-violet-600 hover:bg-violet-50",
  },
};

function TagField({
  label,
  placeholder,
  icon: Icon,
  accent,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: LucideIcon;
  accent: Accent;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const a = accentClasses[accent];

  const addTag = () => {
    const value = draft.trim();
    if (!value) return;
    const exists = values.some((v) => v.toLowerCase() === value.toLowerCase());
    if (!exists) onChange([...values, value]);
    setDraft("");
  };

  const removeTag = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !draft && values.length) {
      removeTag(values.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            a.icon
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        <span className="ml-auto text-xs text-gray-400">{values.length}</span>
      </div>

      <div
        className={cn(
          "rounded-xl border border-gray-200 bg-white p-2 transition-all focus-within:ring-4",
          a.ring
        )}
      >
        {/* Chips */}
        {values.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {values.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                  a.chip
                )}
              >
                {value}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className={cn(
                    "-mr-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-colors",
                    a.chipHover
                  )}
                  aria-label={`Remove ${value}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input row */}
        <div className="flex items-center gap-1">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="h-8 border-0 px-1 shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={!draft.trim()}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              a.add
            )}
            aria-label={`Add ${label}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ItemTypeModal({
  open,
  onOpenChange,
  initialData,
  onSave,
  isLoading,
}: Props) {
  const [itemType, setItemType] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setItemType(initialData.itemType || []);
      setBrand(initialData.brand || []);
      setCondition(initialData.condition || []);
      setColor(initialData.color || []);
    } else {
      setItemType([]);
      setBrand([]);
      setCondition([]);
      setColor([]);
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    onSave({ itemType, brand, condition, color });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8e9e2820] text-[#8E9E28]">
              <Settings2 className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-lg">
                Item Type Configuration
              </DialogTitle>
              <DialogDescription>
                Add options one by one — press Enter or click the + button.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 py-4 sm:grid-cols-2">
          <TagField
            label="Item Type"
            placeholder="e.g. Frocks"
            icon={Tag}
            accent="emerald"
            values={itemType}
            onChange={setItemType}
          />
          <TagField
            label="Brand"
            placeholder="e.g. Nike"
            icon={ShoppingBag}
            accent="blue"
            values={brand}
            onChange={setBrand}
          />
          <TagField
            label="Condition"
            placeholder="e.g. Like New"
            icon={BadgeCheck}
            accent="amber"
            values={condition}
            onChange={setCondition}
          />
          <TagField
            label="Color"
            placeholder="e.g. Black"
            icon={Palette}
            accent="violet"
            values={color}
            onChange={setColor}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#8E9E28] text-white hover:bg-[#7a8a22]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
