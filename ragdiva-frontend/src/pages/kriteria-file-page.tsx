import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AuthProviderContext } from "@/context/auth-context";
import { useKriteriaFile } from "@/hooks/use-kriteria-file";
import { useTitle } from "@/hooks/use-title";
import { useNavigate } from "@tanstack/react-router";
import {
    CircleChevronDown,
    Edit,
    Eye,
    FileText,
    Folder,
    Form,
    Search,
    SquarePlus,
    Trash,
    Upload,
    X,
} from "lucide-react";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";

export function KriteriaFilePage() {
    useTitle("Kriteria dan File");
    const hook = useKriteriaFile();
    const navigate = useNavigate();
    const userInfo = useContext(AuthProviderContext);
    const [isDragging, setIsDragging] = useState(false);
    const [isUpdateDragging, setIsUpdateDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateFileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">Kriteria dan File</h2>
            {hook.id && hook.parentCriteria ? (
                <Card className="mt-5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {hook.parentCriteria.code ? `${hook.parentCriteria.code}. ` : ""}
                            {hook.parentCriteria.name}
                            {hook.parentCriteria.access && (
                                <Badge variant={"secondary"}>
                                    {hook.parentCriteria.access}
                                </Badge>
                            )}
                        </CardTitle>
                        {hook.parentCriteria.description && (
                            <CardDescription>
                                {hook.parentCriteria.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardFooter>
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                if (hook.parentCriteria?.parent) {
                                    navigate({
                                        to: `/${userInfo.userInfo?.level}/kriteria-file/${hook.parentCriteria.parent}`,
                                    });
                                } else {
                                    navigate({
                                        to: `/${userInfo.userInfo?.level}/kriteria-file`,
                                    });
                                }
                            }}
                        >
                            Kembali
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <></>
            )}
            <Card className="mt-5">
                <CardHeader>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await hook.refetch();
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Pencarian"
                            value={hook.query}
                            onChange={(v) =>
                                hook.setQuery(v.target.value)
                            }
                        />
                        <Button variant={"outline"} type="submit">
                            <Search className="text-text" />
                        </Button>
                        {hook.id ? (
                            <Button
                                type="button"
                                className="dark:text-accent text-white"
                                onClick={() => {
                                    hook.setCreateDialog(true);
                                }}
                            >
                                <SquarePlus />
                            </Button>
                        ) : (
                            <></>
                        )}
                    </form>
                </CardHeader>
            </Card>
            {hook.isLoading ? (
                <Card className="my-5">
                    <CardContent className="flex gap-3">
                        <Form size={50} className="text-accent" />
                        <Skeleton className="w-full" />
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Collapsible defaultOpen className="mt-5">
                        <div className="flex justify-between">
                            <h4 className="text-lg font-semibold">
                                {hook.id
                                    ? `Sub Kriteria (${hook.criteria.length})`
                                    : `Dokumen (${hook.criteria.length})`}
                            </h4>
                            <CollapsibleTrigger>
                                <Button variant={"outline"}>
                                    <CircleChevronDown />
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="mt-5">
                            {hook.criteria.length === 0 ? (
                                <Card>
                                    <CardContent className="flex items-center justify-center p-6 text-muted-foreground font-medium">
                                        {hook.id ? "Tidak ada sub kriteria" : "Tidak ada dokumen"}
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 grid-flow-row-dense gap-4">
                                    {hook.criteria.map((v, i) => (
                                        <Card key={i}>
                                            <CardContent className="flex gap-3 items-center min-w-0">
                                                {hook.id ? (
                                                    <Folder
                                                        size={50}
                                                        className="text-accent shrink-0"
                                                    />
                                                ) : (
                                                    <Form
                                                        size={50}
                                                        className="text-accent shrink-0"
                                                    />
                                                )}
                                                <div className="flex gap-5 justify-between w-full items-center min-w-0">
                                                    <div className="w-full min-w-0">
                                                        <h5 className="text-lg font-semibold truncate" title={v.code ? `${v.code}. ${v.name}` : v.name}>
                                                            {v.code
                                                                ? `${v.code}. ${v.name}`
                                                                : v.name}
                                                        </h5>
                                                        {v.description && (
                                                            <h6 className="text-md text-muted-foreground truncate" title={v.description}>
                                                                {v.description}
                                                            </h6>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant={"outline"}
                                                            className="w-10 h-10"
                                                            onClick={() => {
                                                                navigate({
                                                                    to: `/${userInfo.userInfo?.level}/kriteria-file/${v.id}`,
                                                                });
                                                            }}
                                                        >
                                                            <Eye className="dark:text-sky-300 text-sky-700" />
                                                        </Button>
                                                        {hook.id ? (
                                                            <>
                                                                <Button
                                                                    className="w-10 h-10"
                                                                    variant={"outline"}
                                                                    onClick={() => {
                                                                        hook.setUpdateDialog(true);
                                                                        hook.setUpdateData({
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
                                                                        hook.setDeleteData(v.id);
                                                                        hook.setDeleteDialog(true);
                                                                    }}
                                                                >
                                                                    <Trash className="dark:text-red-300 text-red-500" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>
                    <Separator />
                    {hook.id ? (
                        <Collapsible defaultOpen className="mt-5">
                            <div className="flex justify-between">
                                <h4 className="text-lg font-semibold">
                                    File ({hook.files.length})
                                </h4>
                                <CollapsibleTrigger>
                                    <Button variant={"outline"}>
                                        <CircleChevronDown />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="mt-5">
                                {hook.files.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex items-center justify-center p-6 text-muted-foreground font-medium">
                                            Tidak ada file
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 grid-flow-row-dense gap-4">
                                        {hook.files.map((v, i) => (
                                            <Card key={i}>
                                                <CardContent className="flex gap-3 items-center min-w-0">
                                                    <FileText
                                                        size={50}
                                                        className="text-accent shrink-0"
                                                    />
                                                    <div className="flex gap-5 justify-between w-full items-center min-w-0">
                                                        <div className="w-full min-w-0">
                                                            <h5 className="text-lg font-semibold truncate" title={v.title}>
                                                                {v.title}
                                                            </h5>
                                                            {v.page && (
                                                                <h6 className="text-md text-muted-foreground truncate">
                                                                    Halaman: {v.page}
                                                                </h6>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant={"outline"}
                                                                className="w-10 h-10"
                                                                onClick={() => {
                                                                    window.open(
                                                                        `/api/file/download/${v.id}`,
                                                                    );
                                                                }}
                                                            >
                                                                <Eye className="dark:text-sky-300 text-sky-700" />
                                                            </Button>
                                                            <Button
                                                                className="w-10 h-10"
                                                                variant={"outline"}
                                                                onClick={() => {
                                                                    hook.setUpdateFileDialog(true);
                                                                    hook.setUpdateFileData({
                                                                        id: v.id,
                                                                        criteriaId: hook.id as string,
                                                                        name: v.title,
                                                                    });
                                                                    hook.setUpdateFilePage(v.page ?? "");
                                                                }}
                                                            >
                                                                <Edit className="text-accent" />
                                                            </Button>
                                                            <Button
                                                                className="w-10 h-10"
                                                                variant={"outline"}
                                                                onClick={() => {
                                                                    hook.setDeleteFileData({
                                                                        id: v.id,
                                                                        criteriaId: hook.id as string,
                                                                    });
                                                                    hook.setDeleteFileDialog(true);
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
                            </CollapsibleContent>
                        </Collapsible>
                    ) : (
                        <></>
                    )}
                </>
            )}
            <Dialog
                open={hook.createDialog}
                onOpenChange={hook.setCreateDialog}
            >
                <DialogContent className="sm:max-w-md min-w-0 overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Tambah Kriteria / File</DialogTitle>
                        <DialogDescription>
                            Pilih jenis data yang ingin ditambahkan
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={hook.createType === "criteria" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => hook.setCreateType("criteria")}
                        >
                            Kriteria Baru
                        </Button>
                        <Button
                            type="button"
                            variant={hook.createType === "file" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => hook.setCreateType("file")}
                        >
                            Upload File
                        </Button>
                    </div>
                    {hook.createType === "criteria" ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                hook.criteriaPostMutation
                                    .mutateAsync({...hook.createCriteriaData, parent: hook.id as string})
                                    .then(() => {
                                        hook.refetch();
                                    })
                                    .catch((e: unknown) =>
                                        toast("Error", { description: (e as Error).message }),
                                    );
                                hook.setCreateCriteriaData({
                                    name: "",
                                    code: "",
                                    description: "",
                                    access: "",
                                });
                                hook.setCreateDialog(false);
                            }}
                            className="flex flex-col gap-3"
                        >
                            <Field>
                                <FieldLabel>Nama Kriteria</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={hook.createCriteriaData.name}
                                        onChange={(e) =>
                                            hook.setCreateCriteriaData({
                                                ...hook.createCriteriaData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Masukkan nama kriteria"
                                    />
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Kode Kriteria (opsional)</FieldLabel>
                                <FieldContent>
                                    <Input
                                        value={hook.createCriteriaData.code}
                                        onChange={(e) =>
                                            hook.setCreateCriteriaData({
                                                ...hook.createCriteriaData,
                                                code: e.target.value,
                                            })
                                        }
                                        placeholder="Masukkan kode kriteria"
                                    />
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Deskripsi</FieldLabel>
                                <FieldContent>
                                    <Textarea
                                        value={hook.createCriteriaData.description}
                                        onChange={(e) =>
                                            hook.setCreateCriteriaData({
                                                ...hook.createCriteriaData,
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
                                        hook.setCreateDialog(false);
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button type="submit">Kirim</Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData();
                                hook.createFiles.forEach((f) =>
                                    formData.append("files", f),
                                );
                                if (hook.createFilePage) {
                                    formData.append("page", hook.createFilePage);
                                }
                                hook.filePostMutation
                                    .mutateAsync({
                                        criteriaId: hook.id!,
                                        data: formData,
                                    })
                                    .then(() => {
                                        hook.refetch();
                                    })
                                    .catch((e) =>
                                        toast("Error", { description: e.message }),
                                    );
                                hook.setCreateFiles([]);
                                hook.setCreateFilePage("");
                                hook.setCreateDialog(false);
                            }}
                            className="flex flex-col gap-3 min-w-0 w-full"
                        >
                            <Field>
                                <FieldLabel>File</FieldLabel>
                                <FieldContent>
                                    <div
                                        className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-input"}`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            const droppedFiles = Array.from(
                                                e.dataTransfer.files,
                                            );
                                            hook.setCreateFiles((prev) => [
                                                ...prev,
                                                ...droppedFiles,
                                            ]);
                                        }}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <Upload className="text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Drag & drop file atau klik untuk
                                            memilih
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    hook.setCreateFiles(
                                                        (prev) => [
                                                            ...prev,
                                                            ...Array.from(
                                                                e.target.files!,
                                                            ),
                                                        ],
                                                    );
                                                }
                                                e.target.value = "";
                                            }}
                                        />
                                    </div>
                                    {hook.createFiles.length > 0 && (
                                        <div className="flex flex-col gap-1 mt-2">
                                            {hook.createFiles.map((file, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between gap-2 rounded-md border p-2 min-w-0 w-full overflow-hidden"
                                                >
                                                    <span className="text-sm truncate block min-w-0 w-0 flex-1" title={file.name}>
                                                        {file.name}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant={"ghost"}
                                                        className="h-6 w-6 p-0 shrink-0"
                                                        onClick={() =>
                                                            hook.setCreateFiles(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (_, idx) =>
                                                                            idx !==
                                                                            i,
                                                                    ),
                                                            )
                                                        }
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldContent>
                            </Field>
                            {hook.createFiles.length === 1 && (
                                <Field>
                                    <FieldLabel>Page</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            value={hook.createFilePage}
                                            onChange={(e) =>
                                                hook.setCreateFilePage(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan nomor halaman"
                                        />
                                    </FieldContent>
                                </Field>
                            )}
                            <DialogFooter>
                                <Button
                                    variant={"outline"}
                                    onClick={() => {
                                        hook.setCreateDialog(false);
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={hook.createFiles.length === 0}
                                >
                                    Kirim
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
            <Dialog
                open={hook.updateDialog}
                onOpenChange={hook.setUpdateDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Kriteria</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi kriteria
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            hook.criteriaPatchMutation
                                .mutateAsync(hook.updateData)
                                .then(() => {
                                    hook.refetch();
                                })
                                .catch((e) =>
                                    toast("Error", { description: e.message }),
                                );
                            hook.setUpdateData({
                                name: "",
                                code: "",
                                description: "",
                                access: "",
                                id: "",
                            });
                            hook.setUpdateDialog(false);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <Field>
                            <FieldLabel>Nama Kriteria</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={hook.updateData.name}
                                    onChange={(e) =>
                                        hook.setUpdateData({
                                            ...hook.updateData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan nama kriteria"
                                />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Kode Kriteria (opsional)</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={hook.updateData.code}
                                    onChange={(e) =>
                                        hook.setUpdateData({
                                            ...hook.updateData,
                                            code: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan kode kriteria"
                                />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Deskripsi</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    value={hook.updateData.description}
                                    onChange={(e) =>
                                        hook.setUpdateData({
                                            ...hook.updateData,
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
                                    hook.setUpdateDialog(false);
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
                open={hook.updateFileDialog}
                onOpenChange={hook.setUpdateFileDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update File</DialogTitle>
                        <DialogDescription className="truncate" title={`Perbarui file: ${hook.updateFileData.name}`}>
                            Perbarui file: {hook.updateFileData.name}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData();
                            hook.updateFiles.forEach((f) =>
                                formData.append("files", f),
                            );
                            if (hook.updateFilePage) {
                                formData.append("page", hook.updateFilePage);
                            }
                            hook.filePatchMutation
                                .mutateAsync({
                                    id: hook.updateFileData.id,
                                    criteriaId: hook.updateFileData.criteriaId,
                                    data: formData,
                                })
                                .then(() => {
                                    hook.refetch();
                                })
                                .catch((e) =>
                                    toast("Error", { description: e.message }),
                                );
                            hook.setUpdateFiles([]);
                            hook.setUpdateFilePage("");
                            hook.setUpdateFileData({
                                id: "",
                                criteriaId: "",
                                name: "",
                            });
                            hook.setUpdateFileDialog(false);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <Field>
                            <FieldLabel>File</FieldLabel>
                            <FieldContent>
                                <div
                                    className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 cursor-pointer transition-colors ${isUpdateDragging ? "border-primary bg-primary/5" : "border-input"}`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsUpdateDragging(true);
                                    }}
                                    onDragLeave={() =>
                                        setIsUpdateDragging(false)
                                    }
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsUpdateDragging(false);
                                        const droppedFiles = Array.from(
                                            e.dataTransfer.files,
                                        );
                                        hook.setUpdateFiles((prev) => [
                                            ...prev,
                                            ...droppedFiles,
                                        ]);
                                    }}
                                    onClick={() =>
                                        updateFileInputRef.current?.click()
                                    }
                                >
                                    <Upload className="text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Drag & drop file atau klik untuk memilih
                                    </p>
                                    <input
                                        ref={updateFileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                hook.setUpdateFiles((prev) => [
                                                    ...prev,
                                                    ...Array.from(
                                                        e.target.files!,
                                                    ),
                                                ]);
                                            }
                                            e.target.value = "";
                                        }}
                                    />
                                </div>
                                {hook.updateFiles.length > 0 && (
                                    <div className="flex flex-col gap-1 mt-2">
                                        {hook.updateFiles.map((file, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between gap-2 rounded-md border p-2 min-w-0 w-full overflow-hidden"
                                            >
                                                <span className="text-sm truncate block min-w-0 w-0 flex-1" title={file.name}>
                                                    {file.name}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant={"ghost"}
                                                    className="h-6 w-6 p-0 shrink-0"
                                                    onClick={() =>
                                                        hook.setUpdateFiles(
                                                            (prev) =>
                                                                prev.filter(
                                                                    (_, idx) =>
                                                                        idx !==
                                                                        i,
                                                                ),
                                                        )
                                                    }
                                                >
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Page</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={hook.updateFilePage}
                                    onChange={(e) =>
                                        hook.setUpdateFilePage(e.target.value)
                                    }
                                    placeholder="Masukkan nomor halaman"
                                />
                            </FieldContent>
                        </Field>
                        <DialogFooter>
                            <Button
                                variant={"outline"}
                                onClick={() => {
                                    hook.setUpdateFileDialog(false);
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
                open={hook.deleteDialog}
                onOpenChange={hook.setDeleteDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Kriteria</DialogTitle>
                    </DialogHeader>
                    <h6>
                        Apakah anda yakin ingin menghapus kriteria ini ?
                    </h6>
                    <DialogFooter>
                        <Button
                            variant={"outline"}
                            onClick={() => hook.setDeleteDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => {
                                hook.criteriaDeleteMutation
                                    .mutateAsync(hook.deleteData)
                                    .then(() => {
                                        hook.refetch();
                                    })
                                    .catch((e) =>
                                        toast("Error", {
                                            description: e.message,
                                        }),
                                    );
                                hook.setDeleteData("");
                                hook.setDeleteDialog(false);
                            }}
                        >
                            Kirim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog
                open={hook.deleteFileDialog}
                onOpenChange={hook.setDeleteFileDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus File</DialogTitle>
                    </DialogHeader>
                    <h6>
                        Apakah anda yakin ingin menghapus file ini ?
                    </h6>
                    <DialogFooter>
                        <Button
                            variant={"outline"}
                            onClick={() => hook.setDeleteFileDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => {
                                hook.fileDeleteMutation
                                    .mutateAsync(hook.deleteFileData)
                                    .then(() => {
                                        hook.refetch();
                                    })
                                    .catch((e) =>
                                        toast("Error", {
                                            description: e.message,
                                        }),
                                    );
                                hook.setDeleteFileData({
                                    id: "",
                                    criteriaId: "",
                                });
                                hook.setDeleteFileDialog(false);
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
