import type { ReactNode } from "react";

export function Footer(): ReactNode{
    return (
        <div className="dark:bg-background bg-white border-t border-b">
            <div className="max-w-280 m-auto px-6 py-5 flex justify-between">
                <h6 className="text-text-dark-600 text-sm md:text-md">© {new Date().getFullYear()} RAGDiva. All rights reserved</h6>
            </div>
        </div>
    )
}