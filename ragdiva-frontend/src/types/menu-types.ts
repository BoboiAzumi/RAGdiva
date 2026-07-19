import type { ElementType } from "react"

export type MenuType = {
    name: string,
    path: string,
    icon: ElementType,
    sub?: Omit<MenuType, "icon"|"sub">[]
}

export type MenuGroupType = {
    role: string[],
    name: string,
    menu: MenuType[]
}