import {
    FileText,
    Form,
    LayoutDashboard,
    School,
    Settings,
    Sparkle,
    User,
} from "lucide-react";
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
import { Link, useNavigate } from "@tanstack/react-router";
import { usePathName } from "@/hooks/use-pathname";

export function SidebarLayout() {
    const { userInfo } = useContext(AuthProviderContext);
    const locationState = usePathName();
    const navigate = useNavigate();
    const isActive = (menuPath: string) => {
        return (
            locationState.pathname === menuPath ||
            locationState.pathname.startsWith(`${menuPath}/`)
        );
    };

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
                    path: `/${userInfo?.level}/settings`,
                },
                {
                    name: "AI Chat",
                    icon: Sparkle,
                    path: `/${userInfo?.level}/aichat`,
                },
            ],
        },
        {
            role: ["admin"],
            name: "Administrator",
            menu: [
                {
                    name: "Program Studi",
                    icon: School,
                    path: `/${userInfo?.level}/prodi`,
                },
                {
                    name: "Pengguna",
                    icon: User,
                    path: `/${userInfo?.level}/pengguna`,
                },
            ],
        },
        {
            role: ["user"],
            name: "Pengguna",
            menu: [
                {
                    name: "Dokumen Borang",
                    icon: Form,
                    path: `/${userInfo?.level}/dokumen-borang`,
                },
                {
                    name: "Kriteria dan File",
                    icon: FileText,
                    path: `/${userInfo?.level}/kriteria-file`,
                },
            ],
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
                    path: `/${userInfo?.level}/berkas/dokumenb`,
                    sub: [
                        {
                            name: "C.1. ABC",
                            path: `/${userInfo?.level}/berkas/dokumenb/c.1`,
                        },
                        {
                            name: "C.2. ABC",
                            path: `/${userInfo?.level}/berkas/dokumenb/c.2`,
                        },
                    ],
                },
            ],
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
                                    With AI
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                {menu.map((v, i) => (
                    <>
                        {v.role.includes(userInfo?.level as string) ||
                        userInfo?.level === "admin" ? (
                            <SidebarGroup key={i}>
                                <SidebarGroupLabel>{v.name}</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {v.menu.map((w) => (
                                            <SidebarMenuItem>
                                                <SidebarMenuButton
                                                    className="cursor-pointer"
                                                    isActive={isActive(w.path)}
                                                    onClick={() => {
                                                        {!w.sub ? (
                                                            navigate({
                                                                to: w.path,
                                                            })
                                                        ) : {}}
                                                    }}
                                                >
                                                    <w.icon />
                                                    <span>{w.name}</span>
                                                </SidebarMenuButton>
                                                {w.sub ? (
                                                    <SidebarMenuSub>
                                                        {w.sub.map((x, i) => (
                                                            <SidebarMenuSubItem key={i}>
                                                                <SidebarMenuSubButton
                                                                    className="cursor-pointer"
                                                                    isActive={isActive(x.path)}
                                                                    onClick={() => {
                                                                        navigate(
                                                                            {
                                                                                to: x.path,
                                                                            },
                                                                        );
                                                                    }}
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
