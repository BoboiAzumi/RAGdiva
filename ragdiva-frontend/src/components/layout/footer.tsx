import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

export function Footer(): ReactNode {
    return (
        <footer className="bg-card border-t">
            <div className="max-w-280 m-auto px-6 py-12 grid md:grid-cols-3 gap-10">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/logo.png" alt="logo" width={28} height={28} className="rounded-md" />
                        <span className="font-bold text-lg">RAGDiva</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Sistem informasi pengelolaan arsip digital dan visitasi akreditasi
                        berbasis teknologi Retrieval Augmented Generation.
                    </p>
                </div>

                <div>
                    <h6 className="font-semibold mb-4">Navigasi</h6>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                        <li>
                            <a href="#home" className="hover:text-accent transition-colors">Home</a>
                        </li>
                        <li>
                            <a href="#prodi" className="hover:text-accent transition-colors">Program Studi</a>
                        </li>
                        <li>
                            <a href="#kontak" className="hover:text-accent transition-colors">Kontak</a>
                        </li>
                        <li>
                            <a href="/login" className="hover:text-accent transition-colors">Masuk</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h6 className="font-semibold mb-4">Kontak</h6>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-accent shrink-0" />
                            +62 800 998 877 656
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-accent shrink-0" />
                            info@ragdiva.ac.id
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            Jl. Contoh Alamat No. 123, Kota, Indonesia
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t">
                <div className="max-w-280 m-auto px-6 py-5 flex md:flex-row flex-col justify-between items-center gap-2">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} RAGDiva. All rights reserved
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Dibangun dengan teknologi RAG
                    </p>
                </div>
            </div>
        </footer>
    );
}