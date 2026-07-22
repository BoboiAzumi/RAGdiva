import { useCriteriaDelete, useCriteriaPatch, useCriteriaPost } from "@/features/mutations/criteria-mutations";
import { useFileDelete, useFilePatch, useFilePost } from "@/features/mutations/file-mutations";
import { criteriaGetQueryOptions, criteriaQueryOptions } from "@/features/queries/criteria-queries";
import type { CriteriaPostType, CriteriaType } from "@/types/criteria-types";
import type { FileType } from "@/types/file-types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function useKriteriaFile() {
    const { id } = useParams({ strict: false });
    const [query, setQuery] = useState<string>("");
    const [criteria, setCriteria] = useState<CriteriaType[]>([]);
    const [files, setFiles] = useState<FileType[]>([]);
    const [parentCriteria, setParentCriteria] = useState<CriteriaType | null>(null);

    const [createDialog, setCreateDialog] = useState<boolean>(false);
    const [createType, setCreateType] = useState<"criteria" | "file">("criteria");
    const [createCriteriaData, setCreateCriteriaData] = useState<CriteriaPostType>({ code: "", name: "", description: "", access: "" });
    const [createFiles, setCreateFiles] = useState<File[]>([]);
    const [createFilePage, setCreateFilePage] = useState<string>("");

    const [updateDialog, setUpdateDialog] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<CriteriaPostType & { id: string }>({ id: "", code: "", name: "", description: "", access: "" });

    const [updateFileDialog, setUpdateFileDialog] = useState<boolean>(false);
    const [updateFileData, setUpdateFileData] = useState<{ id: string, criteriaId: string, name: string }>({ id: "", criteriaId: "", name: "" });
    const [updateFiles, setUpdateFiles] = useState<File[]>([]);
    const [updateFilePage, setUpdateFilePage] = useState<string>("");

    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [deleteData, setDeleteData] = useState<string>("");

    const [deleteFileDialog, setDeleteFileDialog] = useState<boolean>(false);
    const [deleteFileData, setDeleteFileData] = useState<{ id: string, criteriaId: string }>({ id: "", criteriaId: "" });

    const rootQuery = useQuery({
        ...criteriaQueryOptions(query),
        enabled: !id,
    });

    const getQuery = useQuery({
        ...criteriaGetQueryOptions(id || "", query),
        enabled: !!id,
    });

    const criteriaPostMutation = useCriteriaPost();
    const criteriaPatchMutation = useCriteriaPatch();
    const criteriaDeleteMutation = useCriteriaDelete();
    const filePostMutation = useFilePost();
    const filePatchMutation = useFilePatch();
    const fileDeleteMutation = useFileDelete();

    const refetch = async () => {
        if (id) {
            await getQuery.refetch();
        } else {
            await rootQuery.refetch();
        }
    };

    useEffect(() => {
        if (id) {
            if (!getQuery.data) return;
            setParentCriteria(getQuery.data.data.criteria || null);
            setCriteria(Array.isArray(getQuery.data.data.children) ? getQuery.data.data.children : []);
            setFiles(Array.isArray(getQuery.data.data.files) ? getQuery.data.data.files : []);
        } else {
            if (!rootQuery.data) return;
            setParentCriteria(null);
            setFiles([]);
            setCriteria(Array.isArray(rootQuery.data.data) ? rootQuery.data.data : []);
        }
    }, [id, rootQuery.data, getQuery.data]);

    return {
        id,
        query, setQuery,
        isLoading: id ? getQuery.isLoading : rootQuery.isLoading,
        criteria,
        files,
        parentCriteria,
        refetch,

        createDialog, setCreateDialog,
        createType, setCreateType,
        createCriteriaData, setCreateCriteriaData,
        createFiles, setCreateFiles,
        createFilePage, setCreateFilePage,
        criteriaPostMutation,
        filePostMutation,

        updateDialog, setUpdateDialog,
        updateData, setUpdateData,
        criteriaPatchMutation,

        updateFileDialog, setUpdateFileDialog,
        updateFileData, setUpdateFileData,
        updateFiles, setUpdateFiles,
        updateFilePage, setUpdateFilePage,
        filePatchMutation,

        deleteDialog, setDeleteDialog,
        deleteData, setDeleteData,
        criteriaDeleteMutation,

        deleteFileDialog, setDeleteFileDialog,
        deleteFileData, setDeleteFileData,
        fileDeleteMutation,
    };
}