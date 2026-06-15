"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface OrderDetailsModalProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipping: "bg-indigo-100 text-indigo-700 border-indigo-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
}

export function StatusBadge({ status }: { status?: string }) {
  const key = (status || "pending").toLowerCase()
  return (
    <Badge
      variant="outline"
      className={`capitalize ${statusStyles[key] || "bg-gray-100 text-gray-700 border-gray-200"}`}
    >
      {status || "pending"}
    </Badge>
  )
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  if (!order) return null

  const customer = order.customer || {}
  const address = order.addreses?.[0]
  const products = order.products || []

  const customerAddress =
    customer.addreses?.find((a: any) => a.isDefault) || customer.addreses?.[0]
  const customerPhone = customerAddress?.phone
  const initials = (customer.name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View complete order information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order summary */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600">Order Code</p>
              <p className="font-medium">#{order.code || order._id?.slice(-6)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className="font-medium capitalize">{order.paymentStatus || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Price</p>
              <p className="font-medium">${order.totalPrice ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">
                {(order.deliveryPaymentMethod || "—").replace(/_/g, " ")}
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-lg border p-4">
            <h4 className="mb-3 font-semibold">Customer</h4>

            <div className="flex items-center gap-3">
              {customer.avatar?.url ? (
                <img
                  src={customer.avatar.url || "/placeholder.svg"}
                  alt={customer.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8e9e2820] text-lg font-semibold text-[#8E9E28]">
                  {initials}
                </span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{customer.name || "—"}</p>
                  {customer.role ? (
                    <Badge variant="outline" className="capitalize">
                      {customer.role}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-gray-600">{customer.email || "—"}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <div>
                <p className="text-gray-600">Customer ID</p>
                <p className="font-medium">
                  {customer._id ? `...${customer._id.slice(-6)}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{customerPhone || "—"}</p>
              </div>
              <div>
                <p className="text-gray-600">Joined</p>
                <p className="font-medium">
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              {customerAddress ? (
                <div className="col-span-2 md:col-span-3">
                  <p className="text-gray-600">Saved Address</p>
                  <p className="font-medium">
                    {[
                      customerAddress.streetAndNumber,
                      customerAddress.floorAndDoor,
                      customerAddress.city,
                      customerAddress.country,
                      customerAddress.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Shipping address */}
          {address ? (
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 font-semibold">Shipping Address</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{address.nameAndSurname || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{address.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Street</p>
                  <p className="font-medium">{address.streetAndNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Floor / Door</p>
                  <p className="font-medium">{address.floorAndDoor || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600">City</p>
                  <p className="font-medium">{address.city || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Country</p>
                  <p className="font-medium">{address.country || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Zip Code</p>
                  <p className="font-medium">{address.zipCode || "—"}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Products */}
          <div className="rounded-lg border p-4">
            <h4 className="mb-3 font-semibold">
              Products ({products.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-2 pr-4 font-medium">Product</th>
                    <th className="py-2 pr-4 font-medium">Qty</th>
                    <th className="py-2 pr-4 font-medium">Price</th>
                    <th className="py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item: any, index: number) => (
                    <tr key={item._id || index} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-3">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product?.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : null}
                          <span>{item.product?.name || "—"}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-4">{item.quantity}</td>
                      <td className="py-2 pr-4">${item.price}</td>
                      <td className="py-2">${item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
