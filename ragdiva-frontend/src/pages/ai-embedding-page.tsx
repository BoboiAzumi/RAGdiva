import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTitle } from "@/hooks/use-title";

export function AIEmbeddingPage() {
    useTitle("AI Embedding");

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">AI Embedding</h2>
            <div className="grid grid-cols-1 grid-flow-row-dense mt-5 gap-2">
                <Card>
                    <CardContent>
                        <form className="grid grid-cols-1 grid-flow-row-dense gap-4">
                            <Field>
                                <FieldLabel>Embedding Model</FieldLabel>
                                <Input />
                            </Field>
                            <Field>
                                <FieldLabel>Embedding Dim</FieldLabel>
                                <Input />
                            </Field>
                            <Field>
                                <FieldLabel>Embedding Endpoint</FieldLabel>
                                <Input />
                            </Field>
                            <Field>
                                <FieldLabel>Embedding Credential</FieldLabel>
                                <Input />
                            </Field>
                            <Field>
                                <FieldLabel>Embedding Max Batch</FieldLabel>
                                <Input />
                            </Field>
                            <div className="flex justify-end">
                                <Button>Simpan</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
