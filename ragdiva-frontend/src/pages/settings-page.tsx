import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useTitle } from "@/hooks/use-title"

export function SettingsPage() {
    useTitle("Pengaturan")

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">Pengaturan</h2>
            <div className="grid grid-cols-1 grid-flow-row-dense mt-5 gap-2">
                <Card>
                    <CardContent>
                        <form className="grid grid-cols-1 grid-flow-row-dense gap-5">
                            <Field>
                                <FieldLabel>Nama Lengkap</FieldLabel>
                                <Input className="max-w-160" placeholder="Nama Lengkap" />
                            </Field>
                            <Field>
                                <FieldLabel>Password Baru (Opsional)</FieldLabel>
                                <Input className="max-w-160" placeholder="****************" />
                            </Field>
                            <div className="flex justify-end">
                                <Button>Perbarui</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}