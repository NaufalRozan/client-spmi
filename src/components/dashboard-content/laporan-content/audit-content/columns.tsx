import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Eraser, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"
import { BASE_URL } from "@/constant/BaseURL"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Laporan } from "@/lib/types"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

export const laporanColumn: ColumnDef<Laporan>[] = [
    {
        accessorKey: "indicator.kpiCode",
        header: "Kode Indikator",
    },
    {
        id: "details",
        header: "Laporan",
        cell: ({ row }) => {
            const laporan = row.original
            return (
                <div style={{ whiteSpace: "pre-wrap" }}>
                    <p><strong>Capaian:</strong></p>
                    <p>{laporan.capaian || "-"}</p>

                    <p><strong>Capaian Auditor:</strong></p>
                    <p>{laporan.capaian_auditor || "-"}</p>

                    <p><strong>Kendala:</strong></p>
                    <p>{laporan.kendala || "-"}</p>

                    <p><strong>Perbaikan:</strong></p>
                    <p>{laporan.perbaikan || "-"}</p>

                    <p><strong>RTL:</strong></p>
                    <p>{laporan.rtl || "-"}</p>

                    <p><strong>PIC:</strong></p>
                    <p>{laporan.pic || "-"}</p>
                </div>
            )
        },
    },
    {
        id: "file",
        header: "File",
        cell: ({ row }) => {
            const laporan = row.original;
            const files = laporan.FileLaporan || []; // Pastikan ada array file

            return (
                <div className="space-y-2">
                    {files.length > 0 ? (
                        files.map((file: { filename: string; originalName?: string }, index: number) => (
                            <div key={index}>
                                <a
                                    href={`http://localhost:5000/public/filename/${encodeURIComponent(file.filename)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    📄 {file.originalName || file.filename}
                                </a>
                            </div>
                        ))
                    ) : (
                        <span>-</span> // Tampilkan "-" jika tidak ada file
                    )}
                </div>
            );
        },
    },

    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const laporan = row.original
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { userInfo } = useSelector((state: RootState) => state.auth)

            const handleDelete = async () => {
                try {
                    toast.promise(
                        axios.delete(`${BASE_URL}/laporan/${laporan.id}`, {
                            withCredentials: true,
                        }),
                        {
                            loading: "Deleting data...",
                            success: () => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 300)
                                return `Data deleted successfully`
                            },
                            error: (e) => {
                                return `Failed to delete data: ${e}`
                            },
                        }
                    )
                } catch (error: any) {
                    toast.error(`Failed to delete data: ${error.message}`)
                }
            }

            const handleApprove = async () => {
                try {
                    toast.promise(
                        axios.patch(`${BASE_URL}/laporan/${laporan.id}/approve`, {}, { withCredentials: true }),
                        {
                            loading: "Approving data...",
                            success: () => {
                                setTimeout(() => {
                                    window.location.reload();
                                }, 300);
                                return `Laporan berhasil di-approve`;
                            },
                            error: (e) => {
                                return `Gagal approve laporan: ${e.message}`;
                            },
                        }
                    );
                } catch (error: any) {
                    toast.error(`Gagal approve laporan: ${error.message}`);
                }
            };




            return (
                <div>
                    {userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT" && (
                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <Link href={`/laporan/${laporan.id}`} className="w-full">
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">edit</span>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                    </Link>
                                    <TooltipContent>
                                        <p>Edit Laporan</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <AlertDialog>
                                <AlertDialogTrigger className="">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">approve</span>
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Approve Laporan</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently approve the data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={handleApprove}>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    {userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT" && (
                        < AlertDialog >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/laporan/${laporan.id}/audit/new-file?laporanId=${laporan.id}`}>
                                            Tambah File
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Link href={`/laporan/${laporan.id}`} className="w-full">
                                            Edit Laporan
                                        </Link>
                                    </DropdownMenuItem>
                                    <AlertDialogTrigger className="w-full">
                                        <DropdownMenuItem>
                                            Delete Laporan
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>

                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your data
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div >
            )
        },
    },
]
