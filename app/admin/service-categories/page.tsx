"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Header } from "@/components/layout/header"
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { serviceCategoryAPI } from "@/lib/api"
import { ServiceCategoryModal } from "./_components/service-category-modal"

export default function ServiceCategoriesPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const [showServiceCategoryModal, setShowServiceCategoryModal] =
    useState(false)
  const [editingServiceCategory, setEditingServiceCategory] =
    useState<any>(null)
  const [deleteServiceCategoryId, setDeleteServiceCategoryId] = useState<
    string | null
  >(null)

  const { data: serviceCategories = [], isLoading } = useQuery({
    queryKey: ["serviceCategories"],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token")
      const res = await serviceCategoryAPI.getServiceCategories(
        session.accessToken
      )
      return res.data.data
    },
    enabled: !!session?.accessToken,
  })

  const createServiceCategory = useMutation({
    mutationFn: (formData: FormData) =>
      serviceCategoryAPI.createServiceCategory(
        formData,
        session!.accessToken
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCategories"] })
      toast.success("Service category created")
      setShowServiceCategoryModal(false)
    },
    onError: (error: any) => {
      toast.error(error.normalizedMessage || "Failed to create service category")
    },
  })

  const updateServiceCategory = useMutation({
    mutationFn: ({ id, formData }: any) =>
      serviceCategoryAPI.updateServiceCategory(
        id,
        formData,
        session!.accessToken
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCategories"] })
      toast.success("Service category updated")
      setShowServiceCategoryModal(false)
      setEditingServiceCategory(null)
    },
    onError: (error: any) => {
      toast.error(error.normalizedMessage || "Failed to update service category")
    },
  })

  const deleteServiceCategory = useMutation({
    mutationFn: (id: string) =>
      serviceCategoryAPI.deleteServiceCategory(id, session!.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCategories"] })
      toast.success("Service category deleted")
      setDeleteServiceCategoryId(null)
    },
    onError: (error: any) => {
      toast.error(error.normalizedMessage || "Failed to delete service category")
    },
  })

  const formatDate = (date?: string) => {
    if (!date) return "-"
    const parsedDate = new Date(date)
    return Number.isNaN(parsedDate.getTime())
      ? "-"
      : parsedDate.toLocaleDateString()
  }

  return (
    <>
      <Header
        title="Service Categories List"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Service Categories" }]}
      />

      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>All Service Categories</CardTitle>
            <Button
              onClick={() => {
                setEditingServiceCategory(null)
                setShowServiceCategoryModal(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service Category
            </Button>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Sort Order</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {serviceCategories.map((category: any) => (
                    <tr key={category._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{category.name}</td>
                      <td className="px-4 py-3 max-w-md">
                        <span className="line-clamp-2">
                          {category.description || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{category.sortOrder ?? 0}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                            category.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingServiceCategory(category)
                              setShowServiceCategoryModal(true)
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setDeleteServiceCategoryId(category._id)
                            }
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      <ServiceCategoryModal
        open={showServiceCategoryModal}
        onOpenChange={setShowServiceCategoryModal}
        serviceCategory={editingServiceCategory}
        onSave={(formData) =>
          editingServiceCategory
            ? updateServiceCategory.mutate({
                id: editingServiceCategory._id,
                formData,
              })
            : createServiceCategory.mutate(formData)
        }
        isLoading={
          createServiceCategory.isPending || updateServiceCategory.isPending
        }
      />

      <DeleteConfirmDialog
        open={!!deleteServiceCategoryId}
        onOpenChange={(open) => !open && setDeleteServiceCategoryId(null)}
        onConfirm={() =>
          deleteServiceCategoryId &&
          deleteServiceCategory.mutate(deleteServiceCategoryId)
        }
        isLoading={deleteServiceCategory.isPending}
      />
    </>
  )
}
