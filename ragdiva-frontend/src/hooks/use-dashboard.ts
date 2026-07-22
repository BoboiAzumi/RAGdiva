import { type ChartConfig } from "@/components/ui/chart";
import { dashboardQueryOptions } from "@/features/queries/dashboard-queries";
import type { DashboardType } from "@/types/dashboard-types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useDashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardType | null>(
        null,
    );
    const [chartData, setChartData] = useState<
        { criteria: string; count: number; fill: string }[]
    >([]);

    const { data, isLoading } = useQuery(dashboardQueryOptions());

    useEffect(() => {
        setDashboardData(data?.data as DashboardType);
        setChartData(
            data?.data.criteriaHasFile.map((v) => (
                { criteria: v.major ? `${v.criteria} (${v.major})` : v.criteria, count: v.count, fill: "var(--color-accent)" }
            )) as { criteria: string; count: number; fill: string }[],
        );
    }, [data]);

    return {
        dashboardData,
        isLoading,
        chartData,
    };
}
