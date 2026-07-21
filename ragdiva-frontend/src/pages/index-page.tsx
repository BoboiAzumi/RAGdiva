import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTitle } from "@/hooks/use-title";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
    ArrowRight, Award, BookOpen, Database, FileText,
    GraduationCap, Mail, Phone, Search, Sparkles, Trophy, Users
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const t0 = performance.now();
                    const tick = (now: number) => {
                        const p = Math.min((now - t0) / duration, 1);
                        setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
    { icon: GraduationCap, value: 4, suffix: "", label: "Program Studi" },
    { icon: Award, value: 0, suffix: "", label: "Akreditasi Perguruan Tinggi", text: "Baik Sekali" },
    { icon: Users, value: 3000, suffix: "+", label: "Mahasiswa" },
    { icon: BookOpen, value: 200, suffix: "+", label: "Dosen Aktif" },
];

const prodiList = [
    { name: "Teknik Ternak Lele", status: "Unggul", icon: GraduationCap },
    { name: "Teknik Timpa Teks", status: "Baik Sekali", icon: FileText },
    { name: "Teknik Klaim Waifu", status: "Baik Sekali", icon: Award },
    { name: "Manajemen Server Discord", status: "Baik Sekali", icon: Database },
];

export function IndexPage(): ReactNode {
    useTitle();
    const pageRef = useScrollReveal();

    return (
        <div ref={pageRef}>
            <Navbar />

            <section id="home" className="relative min-h-screen overflow-hidden flex">
                <div
                    className="absolute inset-0 pointer-events-none after:absolute after:top-1/12
                    after:left-1/6 after:w-130 after:h-130 after:rounded-full after:border
                    after:border-[color-mix(in_srgb,var(--color-accent)_20%,transparent)]
                    after:shadow-[0_0_80px_color-mix(in_srgb,var(--color-accent)_12%,transparent),inset_0_0_80px_color-mix(in_srgb,var(--color-accent)_6%,transparent)]
                    after:animate-pulse-ring bg-orbs transition-[background] duration-500 ease-in-out"
                />

                <div className="max-w-280 m-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Badge
                            variant="outline"
                            className="inline-flex items-center gap-2 md:px-4 md:py-5
                            dark:text-accent text-accent text-md font-semibold
                            before:relative before:top-px
                            before:w-2 before:h-2 before:rounded-full before:bg-accent
                            text-sm px-2 py-3 reveal"
                        >
                            Sistem Informasi Pengendali Mutu Eksternal
                        </Badge>
                        <h1
                            className="text-3xl md:text-5xl font-bold mt-8 reveal"
                            style={{ transitionDelay: "100ms" }}
                        >
                            Arsip Digital dan Visitasi Akreditasi
                        </h1>
                        <h2
                            className="md:text-3xl font-bold mt-4 text-accent relative
                            after:absolute after:top-10 after:left-0 after:right-0
                            after:h-1 after:bg-gradient after:rounded-sm after:content-[''] reveal"
                            style={{ transitionDelay: "200ms" }}
                        >
                            Retrieval Augmented Generation
                        </h2>
                        <p
                            className="mt-8 dark:text-text-dark-400 text-text-light-700 text-sm md:text-lg reveal"
                            style={{ transitionDelay: "300ms" }}
                        >
                            Pengelolaan arsip digital yang terstruktur dan terpusat yang dilengkapi dengan
                            teknologi Retrieval Augmented Generation serta memfasilitasi proses asesmen oleh asesor
                        </p>
                        <Button
                            className="p-7 px-7 text-xl mt-5 bg-accent hover:bg-accent-dark-600
                            dark:hover:bg-accent-dark-200 w-full md:w-auto group reveal"
                            style={{ transitionDelay: "400ms" }}
                            onClick={() => (document.location.href = "/login")}
                        >
                            Masuk
                            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    <div className="hidden md:flex justify-center items-center relative h-[420px]">
                        <div className="absolute w-64 h-72 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-accent/5 p-5 animate-float z-10">
                            <div className="flex items-center gap-1.5 mb-5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 rounded-full bg-accent/20 w-full" />
                                <div className="h-3 rounded-full bg-accent/15 w-3/4" />
                                <div className="h-3 rounded-full bg-accent/10 w-5/6" />
                                <div className="h-10 rounded-lg bg-accent/10 w-full mt-3 flex items-center gap-2 px-3">
                                    <Search className="w-4 h-4 text-accent/40" />
                                    <div className="h-2 rounded-full bg-accent/15 w-24" />
                                </div>
                                <div className="h-3 rounded-full bg-border/30 w-2/3 mt-2" />
                                <div className="h-3 rounded-full bg-border/20 w-4/5" />
                            </div>
                        </div>

                        <div className="absolute -top-2 right-6 w-28 h-28 rounded-2xl border border-accent/30 bg-accent/10 backdrop-blur-lg shadow-lg shadow-accent/10 flex flex-col items-center justify-center gap-2 animate-float-slow z-20">
                            <Sparkles className="w-7 h-7 text-accent" />
                            <span className="text-xs font-bold text-accent tracking-wide">AI Ready</span>
                        </div>

                        <div className="absolute bottom-6 -left-6 w-40 h-28 rounded-xl border border-border/40 bg-card/60 backdrop-blur-lg shadow-lg p-4 animate-float-reverse z-20">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-accent/70" />
                                <span className="text-xs font-semibold text-foreground/70">Dokumen</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 rounded-full bg-border/30 w-full" />
                                <div className="h-2 rounded-full bg-border/20 w-2/3" />
                                <div className="h-2 rounded-full bg-border/15 w-4/5" />
                            </div>
                        </div>

                        <div className="absolute top-10 left-8 w-3 h-3 rounded-full bg-accent/30 animate-pulse" />
                        <div className="absolute bottom-16 right-2 w-2 h-2 rounded-full bg-accent/20 animate-pulse [animation-delay:1s]" />
                        <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full border border-accent/20 animate-pulse [animation-delay:2s]" />
                    </div>
                </div>
            </section>

            <section className="border-t border-b bg-secondary">
                <div className="max-w-280 m-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="flex flex-col items-center gap-2 reveal"
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-1">
                                <stat.icon className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-3xl font-bold text-accent">
                                {stat.text ? stat.text : <CountUp end={stat.value} suffix={stat.suffix} />}
                            </h3>
                            <h4 className="text-sm text-center text-muted-foreground">{stat.label}</h4>
                        </div>
                    ))}
                </div>
            </section>

            <section id="prodi" className="bg-background">
                <div className="max-w-280 m-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold reveal">Program Studi</h2>
                        <p
                            className="text-muted-foreground mt-3 max-w-lg mx-auto reveal"
                            style={{ transitionDelay: "100ms" }}
                        >
                            Program studi terakreditasi dan berkualitas tinggi
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {prodiList.map((prodi, i) => (
                            <Card
                                key={prodi.name}
                                className="group cursor-default hover:border-accent/50
                                transition-all duration-300 hover:shadow-lg hover:shadow-accent/5
                                hover:-translate-y-0.5 reveal"
                                style={{ transitionDelay: `${(i + 2) * 100}ms` }}
                            >
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                                        <prodi.icon className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{prodi.name}</CardTitle>
                                        <Badge variant="outline" className="mt-1.5 text-accent border-accent/30 text-xs">
                                            <Trophy className="w-3 h-3 mr-1" />
                                            {prodi.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <div className="bg-[linear-gradient(90deg,transparent,var(--color-border),transparent)] h-px" />

            <section id="kontak" className="bg-background">
                <div className="max-w-280 m-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold reveal">Kontak</h2>
                        <p
                            className="text-muted-foreground mt-3 max-w-lg mx-auto reveal"
                            style={{ transitionDelay: "100ms" }}
                        >
                            Hubungi kami untuk informasi lebih lanjut
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card
                            className="group py-10 md:px-5 hover:border-accent/50
                            transition-all duration-300 hover:shadow-lg hover:shadow-accent/5
                            hover:-translate-y-0.5 reveal"
                            style={{ transitionDelay: "200ms" }}
                        >
                            <CardHeader className="items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                                    <Phone className="w-6 h-6 text-accent" />
                                </div>
                                <CardTitle className="text-lg mt-3">Telepon</CardTitle>
                                <CardDescription className="text-center">
                                    Tertarik pada perguruan tinggi kami? Hubungi nomor yang tertera berikut
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full p-5 bg-accent hover:bg-accent-dark-600 dark:hover:bg-accent-dark-200"
                                    onClick={() => window.open("tel:+62800998877656")}
                                >
                                    +62 800 998 877 656
                                </Button>
                            </CardContent>
                        </Card>

                        <Card
                            className="group py-10 md:px-5 hover:border-accent/50
                            transition-all duration-300 hover:shadow-lg hover:shadow-accent/5
                            hover:-translate-y-0.5 reveal"
                            style={{ transitionDelay: "300ms" }}
                        >
                            <CardHeader className="items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                                    <Mail className="w-6 h-6 text-accent" />
                                </div>
                                <CardTitle className="text-lg mt-3">Email</CardTitle>
                                <CardDescription className="text-center">
                                    Pertanyaan seputar perguruan tinggi dan laporkan bug
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full p-5 bg-accent hover:bg-accent-dark-600 dark:hover:bg-accent-dark-200"
                                    onClick={() => window.open("mailto:info@ragdiva.ac.id")}
                                >
                                    Kirim Email
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
