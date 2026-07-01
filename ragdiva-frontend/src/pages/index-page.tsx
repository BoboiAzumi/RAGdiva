import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTitle } from "@/hooks/use-title";
import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";

export function IndexPage(): ReactNode {
    useTitle();

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen overflow-hidden flex">
                <div
                    className="absolute inset-0 pointer-events-none after:absolute after:top-1/12 
                    after:left-1/6 after:w-130 after:h-130 after:rounded-full after:border 
                    after:border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)]
                    after:shadow-[0_0_80px_color-mix(in_srgb,var(--color-accent)_12%,transparent),inset_0_0_80px_color-mix(in_srgb,var(--color-accent)_6%,transparent)]
                    after:animate-pulse-ring bg-orbs transition-[background] duration-500 ease-in-out"
                />
                <div className="max-w-280 m-auto px-6">
                    <div className="max-w-170 m-auto">
                        <Badge
                            variant={"outline"}
                            className="inline-flex items-center gap-2 md:px-4 md:py-5
                            dark:text-accent text-accent text-md font-semibold
                            before:relative before:top-px
                            before:w-2 before:h-2 before:rounded-full before:bg-accent
                            text-sm px-2 py-3"
                        >
                            Sistem Informasi Pengendali Mutu Eksternal
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold mt-8">
                            Arsip Digital dan Visitasi Akreditasi
                        </h1>
                        <h2 className="md:text-3xl font-bold mt-4 text-accent relative
                            after:absolute after:top-10 after:left-0 after:right-0 
                            after:h-1 after:bg-gradient after:rounded-sm after:content-['']"
                        >
                            Retrieval Augmented Generation
                        </h2>
                        <h5 className="mt-8 dark:text-text-dark-400 text-text-light-700 text-sm md:text-lg">
                            Pengelolaan arsip digital yang terstruktur dan terpusat yang dilengkapi dengan teknologi Retrieval Augmented Generation serta memfasilitasi proses asesmen oleh asesor
                        </h5>
                        <Button className="p-7 px-7 text-xl mt-5 bg-accent hover:bg-accent-dark-600 dark:hover:bg-accent-dark-200 w-full md:w-auto" onClick={() => document.location.href = '/login'}>
                            Masuk
                            <span>→</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="border-t border-b bg-secondary">
                <div className="max-w-280 m-auto px-6 py-4 flex md:flex-row flex-col justify-between gap-5">
                    <div className="block">
                        <h3 className="text-3xl text-accent text-center">4</h3>
                        <h4 className="text-md text-center">Program Studi</h4>
                    </div>
                    <div className="block">
                        <h3 className="text-3xl text-accent text-center">Baik Sekali</h3>
                        <h4 className="text-md text-center">Akreditasi Perguruan Tinggi</h4>
                    </div>
                    <div className="block">
                        <h3 className="text-3xl text-accent text-center">3000+</h3>
                        <h4 className="text-md text-center">Mahasiswa</h4>
                    </div>
                    <div className="block">
                        <h3 className="text-3xl text-accent text-center">200+</h3>
                        <h4 className="text-md text-center">Dosen Aktif</h4>
                    </div>
                </div>
            </div>
            <div className="bg-background">
                <div className="max-w-280 m-auto px-6 py-10">
                    <h2 className="text-2xl text-center">Program Studi</h2>
                    <Table className="my-10">
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-lg">Teknik Ternak Lele</TableCell>
                                <TableCell className="text-lg text-accent">Unggul</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-lg">Teknik Timpa Teks</TableCell>
                                <TableCell className="text-lg text-accent">Baik Sekali</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-lg">Teknik Klaim Waifu</TableCell>
                                <TableCell className="text-lg text-accent">Baik Sekali</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-lg">Manajemen Server Discord</TableCell>
                                <TableCell className="text-lg text-accent">Baik Sekali</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="bg-[linear-gradient(90deg,transparent,var(--color-border),transparent)] h-0.5" />
            <div className="bg-background">
                <div className="max-w-280 m-auto px-6 py-10">
                    <h2 className="text-2xl text-center">Kontak</h2>
                    <div className="grid grid-cols-2 grid-flow-row-dense mt-10 gap-4">
                        <Card className="py-10 md:px-5">
                            <CardHeader>
                                <CardTitle className="flex justify-center">
                                    <Phone />
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Telepon
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                Tertarik pada perguruan tinggi kami? Hubungi nomor yang tertera berikut
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full p-5 bg-accent hover:bg-accent-dark-600 dark:hover:bg-accent-dark-200">+62800998877656</Button>
                            </CardFooter>
                        </Card>
                        <Card className="py-10 md:px-5">
                            <CardHeader>
                                <CardTitle className="flex justify-center">
                                    <Mail />
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Email
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                Pertanyaan seputar perguruan tinggi dan laporkan bug
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full p-5 bg-accent hover:bg-accent-dark-600 dark:hover:bg-accent-dark-200">
                                    Kirim Email
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
