"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ServiceCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (formData: FormData) => void
  serviceCategory?: any
  isLoading?: boolean
}

export function ServiceCategoryModal({
  open,
  onOpenChange,
  onSave,
  serviceCategory,
  isLoading,
}: ServiceCategoryModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [sortOrder, setSortOrder] = useState("0")
  const [isActive, setIsActive] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (serviceCategory) {
      setName(serviceCategory.name || "")
      setDescription(serviceCategory.description || "")
      setSortOrder(String(serviceCategory.sortOrder ?? 0))
      setIsActive(Boolean(serviceCategory.isActive))
      setImagePreview(serviceCategory.image || "")
    } else {
      setName("")
      setDescription("")
      setSortOrder("0")
      setIsActive(true)
      setImage(null)
      setImagePreview("")
    }
  }, [serviceCategory, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("sortOrder", sortOrder)
    formData.append("isActive", String(isActive))
    if (image) {
      formData.append("image", image)
    }
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {serviceCategory ? "Edit Service Category" : "Add Service Category"}
          </DialogTitle>
          <DialogDescription>
            {serviceCategory
              ? "Update the service category details"
              : "Create a new service category"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service-category-name">Name</Label>
            <Input
              id="service-category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-category-description">Description</Label>
            <Textarea
              id="service-category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-category-sort-order">Sort Order</Label>
            <Input
              id="service-category-sort-order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="Enter sort order"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
            Active
          </label>

          <div className="space-y-2">
            <Label htmlFor="service-category-image">Image</Label>
            <Input
              id="service-category-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!serviceCategory}
            />
            {imagePreview && (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
