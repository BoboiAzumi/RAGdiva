import { DokumenBorangPage } from "@/pages/dokumen-borang-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/admin/dokumen-borang")({
    component: DokumenBorangPage,
});
