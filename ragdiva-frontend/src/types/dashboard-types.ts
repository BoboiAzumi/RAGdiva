export type DashboardCriteriaHasFile = {
    criteria: string;
    count: number;
    major: string | null;
};

export type DashboardType = {
    majorCount: number;
    parentCriteriaCount: number;
    criteriaCount: number;
    fileCount: number;
    criteriaHasFile: DashboardCriteriaHasFile[];
};

export type DashboardResponseType = {
    message: string,
    data: DashboardType
}
