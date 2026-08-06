import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTitle } from "@/hooks/use-title";
import { ChevronLeft, ChevronRight, RotateCcw, Search, SquarePlus } from "lucide-react";

export function FileIngestionPage(){
    useTitle("File Ingestion")

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">File Ingestion</h2> 
            <div className="grid grid-cols-1 grid-flow-row-dense mt-5 gap-2">
                <Card>
                    <CardContent>
                        <form className="flex gap-2">
                            <Input placeholder="Pencarian" />
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status Ingestion" />
                                </SelectTrigger>
                            </Select>
                            <Button>
                                <Search className="dark:text-text-dark" />
                            </Button>
                            <Button className="bg-accent hover:dark:bg-accent-dark-300 hover:bg-accent-dark-600">
                                <SquarePlus />
                            </Button>
                        </form>
                        <Table className="mt-5">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>File Hash</TableHead>
                                    <TableHead>Ingestion Status</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>Abcd.pdf</TableCell>
                                    <TableCell>asdfsasdds</TableCell>
                                    <TableCell>Complete</TableCell>
                                    <TableCell className="flex flex-col md:flex-row gap-2">
                                        <Button variant={"outline"}>
                                            <RotateCcw className="text-accent" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="flex justify-center gap-2 mt-5">
                            <Button variant={"outline"}>
                                <ChevronLeft />
                            </Button>
                            <Button variant={"outline"}>
                                1
                            </Button>
                            <Button variant={"outline"}>
                                <ChevronRight />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}