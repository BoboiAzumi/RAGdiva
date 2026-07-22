import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useBorang } from "@/hooks/use-borang";
import { useTitle } from "@/hooks/use-title";
import { Edit, Form, Search, SquarePlus, Trash } from "lucide-react";
import { toast } from "sonner";

export function DokumenBorangPage() {
    useTitle("Dokumen Borang");
    const borangHook = useBorang();

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">Dokumen Borang</h2>
            <Card className="mt-5">
                <CardHeader>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await borangHook.refetch();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Pencarian"
                            value={borangHook.query}
                            onChange={(v) =>
                                borangHook.setQuery(v.target.value)
                            }
                        />
                        <Button variant={"outline"} type="submit">
                            <Search className="text-text" />
                        </Button>
                        <Button
                            type="button"
                            className="dark:text-accent text-white"
                            onClick={() => {
                                borangHook.setCreateDialog(true);
                            }}
                        >
                            <SquarePlus />
                        </Button>
                    </form>
                </CardHeader>
            </Card>
            {borangHook.isLoading ? (
                <Card className="my-5">
                    <CardContent className="flex gap-3">
                        <Form size={50} className="text-accent" />
                        <Skeleton className="w-full" />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 grid-flow-row-dense mt-5 gap-4">
                    {borangHook.criteria.map((v, i) => (
                        <Card key={i}>
                            <CardContent className="flex gap-3">
                                <Form size={50} className="text-accent" />
                                <div className="flex gap-5 justify-between w-full items-center">
                                    <div className="w-full">
                                        <h5 className="text-lg font-semibold">
                                            {v.name}
                                        </h5>
                                        <h6 className="text-md">
                                            {v.description}
                                        </h6>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            className="w-10 h-10"
                                            variant={"outline"}
                                            onClick={() => {
                                                borangHook.setUpdateDialog(
                                                    true,
                                                );
                                                borangHook.setUpdateData({
                                                    name: v.name,
                                                    code: v.code,
                                                    description: v.description,
                                                    access: v.access,
                                                    id: v.id,
                                                });
                                            }}
                                        >
                                            <Edit className="text-accent" />
                                        </Button>
                                        <Button
                                            className="w-10 h-10"
                                            variant={"outline"}
                                            onClick={() => {
                                                borangHook.setDeleteData(v.id);
                                                borangHook.setDeleteDialog(
                                                    true,
                                                );
                                            }}
                                        >
                                            <Trash className="dark:text-red-300 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <Dialog
                open={borangHook.createDialog}
                onOpenChange={borangHook.setCreateDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Dokumen Borang</DialogTitle>
                        <DialogDescription>
                            Tambahkan dokumen borang baru
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            borangHook.postMutation
                                .mutateAsync(borangHook.createData)
                                .then(() => {
                                    borangHook.refetch();
                                })
                                .catch((e) =>
                                    toast("Error", { description: e.message }),
                                );
                            borangHook.setCreateData({
                                name: "",
                                code: "",
                                description: "",
                                access: "",
                            });
                            borangHook.setCreateDialog(false);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <Field>
                            <FieldLabel>Nama Dokumen</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={borangHook.createData.name}
                                    onChange={(e) =>
                                        borangHook.setCreateData({
                                            ...borangHook.createData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan nama dokumen"
                                />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Kode Dokumen (opsional)</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={borangHook.createData.code}
                                    onChange={(e) =>
                                        borangHook.setCreateData({
                                            ...borangHook.createData,
                                            code: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan kode dokumen"
                                />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Deskripsi</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={borangHook.createData.description}
                                    onChange={(e) =>
                                        borangHook.setCreateData({
                                            ...borangHook.createData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan deskripsi"
                                />
                            </FieldContent>
                        </Field>
                        <DialogFooter>
                            <Button
                                variant={"outline"}
                                onClick={() => {
                                    borangHook.setCreateDialog(false);
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit">Kirim</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog
                open={borangHook.updateDialog}
                onOpenChange={borangHook.setUpdateDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Dokumen Borang</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi dokumen borang
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log(borangHook.updateData);
                            borangHook.updateMutation
                                .mutateAsync(borangHook.updateData)
                                .then(() => {
                                    borangHook.refetch();
                                })
                                .catch((e) =>
                                    toast("Error", { description: e.message }),
                                );
                            borangHook.setUpdateData({
                                name: "",
                                code: "",
                                description: "",
                                access: "",
                                id: "",
                            });
                            borangHook.setUpdateDialog(false);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <Field>
                            <FieldLabel>Nama Dokumen</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={borangHook.updateData.name}
                                    onChange={(e) =>
                                        borangHook.setUpdateData({
                                            ...borangHook.updateData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan nama dokumen"
                                />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Kode Dokumen (opsional)</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={borangHook.updateData.code}
                                    onChange={(e) =>
                                        borangHook.setUpdateData({
                                            ...borangHook.updateData,
                                            code: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan kode dokumen"
                                />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Deskripsi</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={borangHook.updateData.description}
                                    onChange={(e) =>
                                        borangHook.setUpdateData({
                                            ...borangHook.updateData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan deskripsi"
                                />
                            </FieldContent>
                        </Field>
                        <DialogFooter>
                            <Button
                                variant={"outline"}
                                onClick={() => {
                                    borangHook.setUpdateDialog(false);
                                }}
                            >
                                Batal
                            </Button>
                            <Button type="submit">Kirim</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog
                open={borangHook.deleteDialog}
                onOpenChange={borangHook.setDeleteDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Dokumen Borang</DialogTitle>
                    </DialogHeader>
                    <h6>
                        Apakah anda yakin ingin menghapus dokumen borang ini ?
                    </h6>
                    <DialogFooter>
                        <Button
                            variant={"outline"}
                            onClick={() => borangHook.setDeleteDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => {
                                borangHook.deleteMutation
                                    .mutateAsync(borangHook.deleteData)
                                    .then(() => {
                                        borangHook.refetch();
                                    })
                                    .catch((e) =>
                                        toast("Error", {
                                            description: e.message,
                                        }),
                                    );
                                borangHook.setDeleteData("");
                                borangHook.setDeleteDialog(false);
                            }}
                        >
                            Kirim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
