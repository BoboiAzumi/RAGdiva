import { useCriteriaDelete, useCriteriaPatch, useCriteriaRoot } from "@/features/mutations/criteria-mutations";
import { criteriaQueryOptions } from "@/features/queries/criteria-queries";
import type { CriteriaPostType, CriteriaType } from "@/types/criteria-types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useBorang() {
    const [query, setQuery] = useState<string>("");
    const [criteria, setCriteria] = useState<CriteriaType[]>([]);
    const [createDialog, setCreateDialog] = useState<boolean>(false);
    const [updateDialog, setUpdateDialog] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [createData, setCreateData] = useState<CriteriaPostType>({code: "", name: "", description: "", access: ""})
    const [updateData, setUpdateData] = useState<CriteriaPostType & { id: string }>({id: "", code: "", name: "", description: "", access: ""})
    const [deleteData, setDeleteData] = useState<string>("")
    const { isLoading, data, refetch } = useQuery({
        ...criteriaQueryOptions(query),
        enabled: false,
    });
    const postMutation = useCriteriaRoot()
    const updateMutation = useCriteriaPatch()
    const deleteMutation = useCriteriaDelete()

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (data) {
            setCriteria(data?.data as CriteriaType[]);
        }
    }, [data]);

    return {
        query,
        setQuery,
        isLoading,
        data,
        refetch,
        criteria,
        createDialog,
        setCreateDialog,
        createData,
        setCreateData,
        postMutation,
        updateDialog,
        setUpdateDialog,
        deleteDialog,
        setDeleteDialog,
        updateData,
        setUpdateData,
        updateMutation,
        deleteData,
        setDeleteData,
        deleteMutation
    };
}
