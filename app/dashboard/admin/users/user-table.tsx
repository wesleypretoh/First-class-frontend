"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ALL_ROLES_VALUE = "__all__"

export type UserTableRow = {
  id: string
  name: string
  email: string
  role: string
  roleLabel: string
  createdAtISO: string
  createdAtLabel: string
}

type ColumnLabels = {
  name: string
  email: string
  role: string
  createdAt: string
}

type ActionStrings = {
  header: string
  label: string
  changeRole: string
  delete: string
}

type RoleDialogStrings = {
  title: string
  description: string
  selectLabel: string
  submit: string
  cancel: string
  success: string
  error: string
}

type DeleteDialogStrings = {
  title: string
  description: string
  confirm: string
  cancel: string
  success: string
  error: string
}

type UserTableStrings = {
  searchPlaceholder: string
  roleFilterLabel: string
  roleFilterAll: string
  empty: string
  columns: ColumnLabels
  pagination: {
    previous: string
    next: string
  }
  actions: ActionStrings
  roleDialog: RoleDialogStrings
  deleteDialog: DeleteDialogStrings
}

type RoleOption = {
  value: string
  label: string
}

type UserTableProps = {
  data: UserTableRow[]
  strings: UserTableStrings
  roleOptions: RoleOption[]
  canManageUsers: boolean
  currentUserId: string
}

export function UserTable({
  data,
  strings,
  roleOptions,
  canManageUsers,
  currentUserId,
}: UserTableProps) {
  const [rows, setRows] = React.useState<UserTableRow[]>(data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>(ALL_ROLES_VALUE)
  const [banner, setBanner] = React.useState<{ type: "success" | "error"; message: string } | null>(null)

  const [roleDialogUser, setRoleDialogUser] = React.useState<UserTableRow | null>(null)
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null)
  const [isRoleUpdating, setIsRoleUpdating] = React.useState(false)
  const [roleDialogError, setRoleDialogError] = React.useState<string | null>(null)

  const [deleteDialogUser, setDeleteDialogUser] = React.useState<UserTableRow | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteDialogError, setDeleteDialogError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  React.useEffect(() => {
    if (!banner) {
      return
    }

    const timer = setTimeout(() => {
      setBanner(null)
    }, 4000)

    return () => clearTimeout(timer)
  }, [banner])

  const filteredData = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesSearch = term
        ? row.name.toLowerCase().includes(term) || row.email.toLowerCase().includes(term)
        : true

      const matchesRole =
        roleFilter === ALL_ROLES_VALUE ? true : row.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [rows, searchTerm, roleFilter])

  const columns = React.useMemo<ColumnDef<UserTableRow>[]>(() => {
    const base: ColumnDef<UserTableRow>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-2 h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {strings.columns.name}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => row.original.name,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-2 h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {strings.columns.email}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => row.original.email,
      },
      {
        accessorKey: "roleLabel",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-2 h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {strings.columns.role}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.roleLabel}</Badge>
        ),
        sortingFn: (a, b) => a.original.roleLabel.localeCompare(b.original.roleLabel),
      },
      {
        accessorKey: "createdAtISO",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-2 h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {strings.columns.createdAt}
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        ),
        cell: ({ row }) => row.original.createdAtLabel,
        sortingFn: (a, b) => a.original.createdAtISO.localeCompare(b.original.createdAtISO),
      },
    ]

    if (canManageUsers) {
      base.push({
        id: "actions",
        header: () => <span className="sr-only">{strings.actions.header}</span>,
        cell: ({ row }) => {
          const user = row.original
          const disableDelete = user.id === currentUserId

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{strings.actions.label}</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{strings.actions.label}</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setRoleDialogUser(user)
                    setSelectedRole(user.role)
                    setRoleDialogError(null)
                    setRoleDialogOpen(true)
                  }}
                >
                  {strings.actions.changeRole}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={disableDelete}
                  onClick={() => {
                    if (disableDelete) {
                      return
                    }
                    setDeleteDialogUser(user)
                    setDeleteDialogError(null)
                    setDeleteDialogOpen(true)
                  }}
                >
                  {strings.actions.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      })
    }

    return base
  }, [strings.columns, strings.actions, canManageUsers, currentUserId])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleRoleUpdate = async () => {
    if (!roleDialogUser || !selectedRole || selectedRole === roleDialogUser.role) {
      setRoleDialogOpen(false)
      return
    }

    setIsRoleUpdating(true)
    setRoleDialogError(null)

    try {
      const response = await fetch(`/api/users/${roleDialogUser.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!response.ok) {
        throw new Error("role-update-failed")
      }

      const nextRoleLabel =
        roleOptions.find((option) => option.value === selectedRole)?.label || selectedRole

      setRows((previous) =>
        previous.map((row) =>
          row.id === roleDialogUser.id
            ? {
                ...row,
                role: selectedRole,
                roleLabel: nextRoleLabel,
              }
            : row,
        ),
      )

      setBanner({ type: "success", message: strings.roleDialog.success })
      setRoleDialogOpen(false)
      setRoleDialogUser(null)
      setSelectedRole(null)
    } catch (error) {
      console.error("Failed to update user role", error)
      setRoleDialogError(strings.roleDialog.error)
    } finally {
      setIsRoleUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialogUser) {
      return
    }

    setIsDeleting(true)
    setDeleteDialogError(null)

    try {
      const response = await fetch(`/api/users/${deleteDialogUser.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("delete-failed")
      }

      setRows((previous) => previous.filter((row) => row.id !== deleteDialogUser.id))
      setBanner({ type: "success", message: strings.deleteDialog.success })
      setDeleteDialogOpen(false)
      setDeleteDialogUser(null)
    } catch (error) {
      console.error("Failed to delete user", error)
      setDeleteDialogError(strings.deleteDialog.error)
    } finally {
      setIsDeleting(false)
    }
  }

  const roleSelectionValue = roleDialogUser
    ? selectedRole ?? roleDialogUser.role
    : roleOptions[0]?.value ?? ""

  return (
    <div className="space-y-4">
      {banner && (
        <div
          className={`rounded-md border p-3 text-sm ${
            banner.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={strings.searchPlaceholder}
          className="w-full sm:max-w-xs"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {strings.roleFilterLabel}
          </span>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={strings.roleFilterAll} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ROLES_VALUE}>{strings.roleFilterAll}</SelectItem>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {strings.empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {strings.pagination.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {strings.pagination.next}
        </Button>
      </div>

      <Dialog open={roleDialogOpen} onOpenChange={(open) => {
        setRoleDialogOpen(open)
        if (!open) {
          setRoleDialogUser(null)
          setSelectedRole(null)
          setRoleDialogError(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{strings.roleDialog.title}</DialogTitle>
            <DialogDescription>{strings.roleDialog.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <span className="text-sm font-medium leading-none">
              {strings.roleDialog.selectLabel}
            </span>
            <Select
              value={roleSelectionValue}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {roleDialogError && (
              <p className="text-destructive text-sm">{roleDialogError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRoleDialogOpen(false)
              }}
              disabled={isRoleUpdating}
            >
              {strings.roleDialog.cancel}
            </Button>
            <Button
              type="button"
              onClick={handleRoleUpdate}
              disabled={
                isRoleUpdating ||
                !selectedRole ||
                !roleDialogUser ||
                selectedRole === roleDialogUser.role
              }
            >
              {strings.roleDialog.submit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open)
        if (!open) {
          setDeleteDialogUser(null)
          setDeleteDialogError(null)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{strings.deleteDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {strings.deleteDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteDialogError && (
            <p className="text-destructive text-sm">{deleteDialogError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {strings.deleteDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {strings.deleteDialog.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
