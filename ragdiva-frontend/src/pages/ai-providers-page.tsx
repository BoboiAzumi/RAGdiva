import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTitle } from "@/hooks/use-title";

export function AIProvidersPage() {
    useTitle("AI Providers");

    return (
        <div className="m-5">
            <h2 className="text-2xl font-semibold">AI Providers</h2>
            <div className="grid grid-cols-1 grid-flow-row-dense mt-5 gap-2">
                <Card>
                    <CardContent>
                        <form className="grid grid-cols-1 grid-flow-row-dense gap-4">
                            <h5 className="text-lg font-semibold">Nvidia</h5>
                            <Field>
                                <FieldLabel>Nvidia API Key</FieldLabel>
                                <Input />
                            </Field>
                            <Field>
                                <FieldLabel>Nvidia Endpoint</FieldLabel>
                                <Input />
                            </Field>
                            <h5 className="text-lg font-semibold">Ollama</h5>
                            <Field>
                                <FieldLabel>Ollama API Key</FieldLabel>
                                <Input />
                            </Field>
                            <Field>
                                <FieldLabel>Ollama Endpoint</FieldLabel>
                                <Input />
                            </Field>
                            <h5 className="text-lg font-semibold">OpenCode Zen</h5>
                            <Field>
                                <FieldLabel>Opencode Zen API Key</FieldLabel>
                                <Input />
                            </Field>
                            <Field>
                                <FieldLabel>Opencode Zen Endpoint</FieldLabel>
                                <Input />
                            </Field>
                            <h5 className="text-lg font-semibold">OpenRouter</h5>
                            <Field>
                                <FieldLabel>OpenRouter API Key</FieldLabel>
                                <Input />
                            </Field>
                            <h5 className="text-lg font-semibold">Gemini</h5>
                            <Field>
                                <FieldLabel>Gemini API Key</FieldLabel>
                                <Input />
                            </Field>
                            <h5 className="text-lg font-semibold">OpenAI</h5>
                            <Field>
                                <FieldLabel>OpenAI API Key</FieldLabel>
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
