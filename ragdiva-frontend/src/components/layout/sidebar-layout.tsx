import { FileText, LayoutDashboard, School, Settings, TableProperties, User } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
} from "../ui/sidebar";
import type { MenuGroupType } from "@/types/menu-types";
import { useContext } from "react";
import { AuthProviderContext } from "@/context/auth-context";
import { Link } from "@tanstack/react-router";

export function SidebarLayout() {
    const { userInfo } = useContext(AuthProviderContext);

    const menu: MenuGroupType[] = [
        {
            role: ["admin", "user", "asesor"],
            name: "Menu Utama",
            menu: [
                {
                    name: "Dashboard",
                    icon: LayoutDashboard,
                    path: `/${userInfo?.level}/dashboard`,
                },
                {
                    name: "Pengaturan",
                    icon: Settings,
                    path: `/${userInfo?.level}/settings`
                }
            ],
        },
        {
            role: ["admin"],
            name: "Administrator",
            menu: [
                {
                    name: "Program Studi",
                    icon: School,
                    path: `/${userInfo?.level}/prodi`
                },
                {
                    name: "Pengguna",
                    icon: User,
                    path: `/${userInfo?.level}/pengguna`
                }
            ]
        },
        {
            role: ["user"],
            name: "Pengguna",
            menu: [
                {
                    name: "Berkas",
                    icon: TableProperties,
                    path: `/${userInfo?.level}/berkas`
                },
                {
                    name: "Kriteria dan File",
                    icon: FileText,
                    path: `/${userInfo?.level}/pengguna`
                }
            ]
        },
        {
            role: ["asesor"],
            name: "Asesor",
            menu: [
                {
                    name: "Dokumen A",
                    icon: FileText,
                    path: `/${userInfo?.level}/berkas/dokumena`,
                },
                {
                    name: "Dokumen B",
                    icon: FileText,
                    path: `/${userInfo?.level}/berkas/dokumena`,
                    sub: [
                        {
                            name: "C.1. ABC",
                            path: `/${userInfo?.level}/berkas/dokumena/c.1`
                        }
                    ]
                }
            ]
        },
    ];

    return (
        <Sidebar collapsible={"icon"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-transparent active:bg-transparent"
                        >
                            <img
                                src="/logo.png"
                                alt="logo"
                                width={30}
                                className="rounded-md"
                            />
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-semibold">
                                    Ardiva
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    berbasis AI
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                {menu.map((v) => (
                    <>
                        {v.role.includes(userInfo?.level as string) || userInfo?.level === "admin" ? (
                            <SidebarGroup>
                                <SidebarGroupLabel>{v.name}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {v.menu.map((w) => (
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    className="cursor-pointer"
                                                    isActive={
                                                        w.path.startsWith(
                                                            location.pathname,
                                                        )
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <w.icon />
                                                    {w.path ? (
                                                        <Link to={w.path}>
                                                            {w.name}
                                                        </Link>
                                                    ) : (
                                                        <span>w.name</span>
                                                    )}
                                                </SidebarMenuButton>
                                                {w.sub ? (
                                                    <SidebarMenuSub>
                                                        {w.sub.map((x) => (
                                                            <SidebarMenuSubItem>
                                                                <SidebarMenuSubButton
                                                                    className="cursor-pointer"
                                                                    isActive={
                                                                        w.path.startsWith(
                                                                            location.pathname,
                                                                        )
                                                                            ? true
                                                                            : false
                                                                    }
                                                                >
                                                                    <Link
                                                                        to={
                                                                            x.path
                                                                        }
                                                                    >
                                                                        {x.name}
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                ) : (
                                                    <></>
                                                )}
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ) : (
                            <></>
                        )}
                    </>
                ))}
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}
