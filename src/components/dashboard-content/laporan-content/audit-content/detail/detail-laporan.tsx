"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ReactSelect from 'react-select'
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/constant/BaseURL";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Indicator, Laporan } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { userInfo } from "os";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function DetailLaporanContent({ id }: { id: string }) {
    const [data, setIndicator] = useState<Indicator[]>();
    const [laporan, setLaporan] = useState<Laporan>();
    const router = useRouter();
    const formSchema = z.object({
        indikatorId: z.string({
            required_error: "Indikator ID harus diisi",
        }),
        capaian: z.preprocess(
            (val) => (val === "" ? undefined : Number(val)),
            z.number({ invalid_type_error: "Capaian harus berupa angka" }).nonnegative().optional()
        ),
        kendala: z.string({
            required_error: "Kendala harus diisi",
        }),
        perbaikan: z.string({
            required_error: "Perbaikan harus diisi",
        }),
        rtl: z.string({
            required_error: "RTL harus diisi",
        }),
        pic: z.string({
            required_error: "PIC harus diisi",
        }),
        capaian_auditor: z.union([z.string(), z.number()]).optional(),
        komentar: z.string().optional(),
        rtl_auditor: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            indikatorId: undefined,
            capaian: undefined,
            kendala: undefined,
            perbaikan: undefined,
            rtl: undefined,
            pic: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.promise(
                axios.put(`${BASE_URL}/laporan/${id}`, values, {
                    withCredentials: true
                }),
                {
                    loading: "Menyimpan data...",
                    success: (data) => {
                        // setTimeout(() => {
                        //     router.push('/mata-anggaran')
                        // }, 300);
                        return `Berhasil menyimpan data`
                    },
                    error: (e) => {
                        return `Gagal menyimpan data: ${e}`
                    }
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/indicator`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setIndicator(response.data.data)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };
        const fetchDataLaporan = async () => {
            try {

                const response = await axios.get(`${BASE_URL}/laporan/${id}`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setLaporan(response.data.data)
                    form.setValue('indikatorId', response.data.data.indikatorId)
                    form.setValue('capaian', response.data.data.capaian)
                    form.setValue('kendala', response.data.data.kendala)
                    form.setValue('perbaikan', response.data.data.perbaikan)
                    form.setValue('rtl', response.data.data.rtl)
                    form.setValue('pic', response.data.data.pic)
                }
                return response.data;
            } catch (error) {
                return error;
            }
        };

        fetchData();
        fetchDataLaporan();
    }, [id, form])

    const { userInfo } = useSelector((state: RootState) => state.auth)

    return (
        <div className="space-y-6 w-full flex flex-col items-center">
            {/* Card untuk Capaian Auditor (Lebih Kecil) */}
            <Card className="rounded-lg border-none shadow-md w-full">
                <CardContent className="p-4">
                    <Form {...form}>
                        <FormField
                            control={form.control}
                            name="capaian_auditor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capaian Auditor</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0.0"
                                            {...field}
                                            defaultValue={laporan?.capaian_auditor}
                                            readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT"}
                                            className={`${userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rtl_auditor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RTL Auditor</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Isi RTL Auditor..."
                                            {...field}
                                            defaultValue={laporan?.rtl_auditor}
                                            readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT"}
                                            className={`min-h-[150px] ${userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="komentar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Komentar</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Isi Komentar..."
                                            {...field}
                                            defaultValue={laporan?.komentar}
                                            readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT"}
                                            className={`min-h-[150px] ${userInfo?.role?.permissions[0].name !== "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </Form>
                </CardContent>
            </Card>

            {/* Card untuk Form Utama (Lebih Besar) */}
            <Card className="rounded-lg border-none shadow-md w-full">
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="md:min-w-[600px] space-y-4">
                                {/* Capaian */}
                                <FormField
                                    control={form.control}
                                    name="capaian"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Capaian</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="0.0"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT"}
                                                    className={`${userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Kendala */}
                                <FormField
                                    control={form.control}
                                    name="kendala"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kendala</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Isi kendala..."
                                                    {...field}
                                                    defaultValue={laporan?.kendala}
                                                    className={`min-h-[150px] ${userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                                    readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT"}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Perbaikan */}
                                <FormField
                                    control={form.control}
                                    name="perbaikan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Perbaikan</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Isi perbaikan..."
                                                    {...field}
                                                    defaultValue={laporan?.perbaikan}
                                                    className={`min-h-[150px] ${userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                                    readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT"}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* RTL */}
                                <FormField
                                    control={form.control}
                                    name="rtl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RTL</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Isi RTL..."
                                                    {...field}
                                                    defaultValue={laporan?.rtl}
                                                    className={`min-h-[150px] ${userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                                    readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT"}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* PIC */}
                                <FormField
                                    control={form.control}
                                    name="pic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>PIC</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Isi PIC..."
                                                    {...field}
                                                    defaultValue={laporan?.pic}
                                                    className={`min-h-[150px] ${userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT" ? "bg-gray-200" : ""}`}
                                                    readOnly={laporan?.isApproved === true || userInfo?.role?.permissions[0].name === "ASSESOR_AUDIT"}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tombol Simpan */}
                            {!laporan?.isApproved && (
                                <Button type="submit">
                                    Simpan
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
