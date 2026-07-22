import { prisma } from "../lib/database.js";
import type { CriteriaModel } from "../prisma/models.js";
import type { CriteriaFindType, CriteriaType } from "../types/criteria-type.js";

export async function findCriteria(by?: CriteriaFindType) {
    return await prisma.criteria.findMany({
        ...(by
            ? {
                  where: {
                      id: by.id ?? undefined,
                      parent: by.parent,
                      ...(by.name ? {
                        name: {
                            contains: by.name
                        }
                      } : {}),
                      OR: [
                          {
                              access: {
                                  in: by.access ?? [],
                              },
                          },
                          {
                              access: null,
                          },
                      ],
                  },
              }
            : {}),
    });
}

export async function createCriteria(data: CriteriaType) {
    return await prisma.criteria.create({
        data,
    });
}

export async function updateCriteria(id: string, data: CriteriaType) {
    return await prisma.criteria.update({
        where: {
            id,
        },
        data,
    });
}

export async function createCriteriaLink(id: string) {
    const pathArray: string[] = [];

    const recursive = async (idx: string) => {
        const criteria = await prisma.criteria.findFirst({
            where: {
                id: idx,
            },
        });

        if (!criteria) {
            return;
        }

        pathArray.push(
            `${criteria.code ? `${criteria.code}. ${criteria.name}` : criteria.name}`,
        );

        if (criteria.parent) {
            await recursive(criteria.parent);
        }

        return;
    };

    await recursive(id);

    return pathArray
        .reverse()
        .map((v) => `/${v}`)
        .join("");
}

export async function traversalChildren(id: string) {
    const children: CriteriaModel[] = [];

    const recursive = async (parent: string) => {
        const childs = await prisma.criteria.findMany({
            where: {
                parent,
            },
        });

        for (const child of childs) {
            await recursive(child.id);
            children.push(child);
        }
    };

    await recursive(id);

    return children;
}

export async function deleteCriteriaMultipleId(ids: string[]) {
    return await prisma.criteria.deleteMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
}

export async function countCriteria(isParent: boolean = true) {
    return await prisma.criteria.count({
        where: {
            ...(isParent ? { parent: null } : { parent: { not: null } }),
        },
    });
}

export async function countCriteriaHasFile() {
    return await prisma.criteria.findMany({
        where: {
            fileLinks: {
                some: {},
            },
        },
        select: {
            id: true,
            name: true,
            code: true,
            major: {
                select: {
                    majorName: true,
                },
            },
            _count: {
                select: {
                    fileLinks: true,
                },
            },
        },
        orderBy: {
            fileLinks: {
                _count: "desc",
            },
        },
        take: 10,
    });
}
