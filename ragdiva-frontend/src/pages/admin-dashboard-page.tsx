import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTitle } from "@/hooks/use-title";
import {
    ChartColumn,
    FileText,
    Form,
    GraduationCap,
    StickyNote,
} from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export function AdminDashboardPage() {
    useTitle("Dashboard - Admin");
    const dashboardHook = useDashboard();
    const chartConfig = {
        count: {
            label: "Jumlah File",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-flow-row-dense mt-5 gap-2">
                <Card>
                    <CardHeader>
                        <div className="flex gap-2 items-center">
                            <GraduationCap className="text-accent" />
                            <h6 className="text-lg font-semibold">Prodi</h6>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {dashboardHook.isLoading ? (
                            <div className="flex justify-center">
                                <Skeleton className="h-8 w-15 rounded-full mb-5" />
                            </div>
                        ) : (
                            <h5 className="text-xl font-semibold text-center mb-5">
                                {dashboardHook.dashboardData?.majorCount}
                            </h5>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex gap-2 items-center">
                            <Form className="dark:text-yellow-300 text-yellow-500" />
                            <h6 className="text-lg font-semibold">
                                Dokumen Borang
                            </h6>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {dashboardHook.isLoading ? (
                            <div className="flex justify-center">
                                <Skeleton className="h-8 w-15 rounded-full mb-5" />
                            </div>
                        ) : (
                            <h5 className="text-xl font-semibold text-center mb-5">
                                {
                                    dashboardHook.dashboardData
                                        ?.parentCriteriaCount
                                }
                            </h5>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex gap-2 items-center">
                            <FileText className="dark:text-red-300 text-red-500" />
                            <h6 className="text-lg font-semibold">Kriteria</h6>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {dashboardHook.isLoading ? (
                            <div className="flex justify-center">
                                <Skeleton className="h-8 w-15 rounded-full mb-5" />
                            </div>
                        ) : (
                            <h5 className="text-xl font-semibold text-center mb-5">
                                {dashboardHook.dashboardData?.criteriaCount}
                            </h5>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex gap-2 items-center">
                            <StickyNote className="dark:text-sky-300 text-sky-500" />
                            <h6 className="text-lg font-semibold">File</h6>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {dashboardHook.isLoading ? (
                            <div className="flex justify-center">
                                <Skeleton className="h-8 w-15 rounded-full mb-5" />
                            </div>
                        ) : (
                            <h5 className="text-xl font-semibold text-center mb-5">
                                {dashboardHook.dashboardData?.fileCount}
                            </h5>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle className="flex text-lg font-semibold items-center gap-2">
                        <ChartColumn />
                        Distribusi File
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="max-h-100 w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={dashboardHook.chartData}
                            layout={"vertical"}
                        >
                            <YAxis
                                dataKey={"criteria"}
                                type={"category"}
                                tick={{
                                    fill: "var(--foreground)",
                                }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                                tickLine={{ stroke: "hsl(var(--border))" }}
                            />
                            <XAxis
                                dataKey={"count"}
                                type="number"
                                tick={{
                                    fill: "var(--foreground)",
                                }}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                                tickLine={{ stroke: "hsl(var(--border))" }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar dataKey={"count"} radius={5} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
