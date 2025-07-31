"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    id: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    id,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnFilters,
        }
    })

    // Ambil informasi user dari Redux Store
    const { userInfo } = useSelector((state: RootState) => state.auth)


    return (
        <div>
            <div className="flex flex-col w-full items-start py-4 gap-4">
                <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-col w-full">
                        {/* <Input
                            placeholder="Search name..."
                            value={(table.getColumn("MA.name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("MA.name")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        /> */}
                        {/* <Select
                            defaultValue="all"
                            onValueChange={(value) => table.getColumn("role")?.setFilterValue(value === "all" ? undefined : value)}
                        >
                            <SelectTrigger className="max-w-sm">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Role</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Admin 2">Admin 2</SelectItem>
                            </SelectContent>
                        </Select> */}
                    </div>
                </div>
                {userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT" && (
                    <Link href={`/laporan/${id}/audit/new?indicatorId=${id}`}>
                        <Button variant={"default"} className="bg-green-500">
                            <Plus /> Tambah Laporan Audit
                        </Button>
                    </Link>
                )}

            </div>


            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
