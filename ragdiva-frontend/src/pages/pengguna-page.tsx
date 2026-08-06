import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTitle } from "@/hooks/use-title";
import { ChevronLeft, ChevronRight, Edit, Search, SquarePlus, Trash } from "lucide-react";

export function PenggunaPage(){
    useTitle("Pengguna")

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">Pengguna</h2> 
            <div className="grid grid-cols-1 grid-flow-row-dense mt-5 gap-2">
                <Card>
                    <CardContent>
                        <form className="flex gap-2">
                            <Input placeholder="Pencarian" />
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
                                    <TableHead>Username</TableHead>
                                    <TableHead>Nama Pengguna</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Akses Program Studi</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>Admin</TableCell>
                                    <TableCell>Admin</TableCell>
                                    <TableCell>Admin</TableCell>
                                    <TableCell>
                                        -
                                    </TableCell>
                                    <TableCell className="flex flex-col md:flex-row gap-2">
                                        <Button variant={"outline"}>
                                            <Edit className="text-accent" />
                                        </Button>
                                        <Button variant={"outline"}>
                                            <Trash className="text-red-600" />
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