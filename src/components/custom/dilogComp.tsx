import React, { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Field = {
    name: string;
    label?: string;
    type?: "text" | "email" | "password" | "number";
    placeholder?: string;
    defaultValue?: string;
    id?: string;
};

export type DialogFormProps = {
    /** trigger shown in the UI. If omitted, a default button is used. */
    trigger?: ReactNode;
    title?: string;
    description?: string;
    /** fields to auto-generate if you don't pass children */
    fields?: Field[];
    /** custom form body (if passed, `fields` are ignored) */
    children?: ReactNode;
    submitText?: string;
    cancelText?: string;
    /** called with form values. May return a promise. */
    onSubmit?: (values: Record<string, string>) => void | Promise<void>;
    onCancel?: (values: any) => void | Promise<void>;
    /** when true, the dialog closes after successful submit. default: true */
    closeOnSubmit?: boolean;
    className?: string;
    
    // --- CONTROL PROPS ---
    /** External control for the dialog state */
    open?: boolean;
    /** Callback for when the dialog wants to change state (e.g., backdrop click) */
    onOpenChange?: (open: boolean) => void;
};

export function DialogComp(props: DialogFormProps) {
    const {
        trigger,
        title = "Edit",
        description,
        fields,
        children,
        submitText = "Save",
        cancelText = "Cancel",
        onSubmit,
        onCancel,
        closeOnSubmit = true,
        className,
        open: controlledOpen,
        onOpenChange: setControlledOpen,
    } = props;

    // 1. Hybrid State Logic
    // If 'open' is passed from parent, we use that. Otherwise, we use internal state.
    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (val: boolean) => {
        if (isControlled) {
            setControlledOpen?.(val);
        } else {
            setInternalOpen(val);
        }
    };

    // 2. Async Submission Logic
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const fd = new FormData(e.currentTarget);
            const values: Record<string, string> = {};
            for (const [k, v] of fd.entries()) {
                values[k] = String(v ?? "");
            }

            if (onSubmit) {
                await onSubmit(values);
            }

            // Only close if requested and submission was successful
            if (closeOnSubmit) {
                setOpen(false);
            }
        } catch (err: any) {
            setError(err?.message ?? "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    const triggerNode = trigger ?? (
        <Button variant="default" type="button">
            {title}
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{triggerNode}</DialogTrigger>

            <DialogContent className={className ?? "sm:max-w-[425px]"}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {children ? (
                            children
                        ) : (
                            <>
                                {fields?.map((f) => (
                                    <div className="grid gap-3" key={f.name}>
                                        <Label htmlFor={f.id ?? f.name}>
                                            {f.label ?? f.name}
                                        </Label>
                                        <Input
                                            id={f.id ?? f.name}
                                            name={f.name}
                                            defaultValue={f.defaultValue}
                                            placeholder={f.placeholder}
                                            type={f.type ?? "text"}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {error && (
                        <div role="alert" className="text-sm text-destructive mb-4 font-medium">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        {/* Manual close handling for Cancel */}
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                if (onCancel) onCancel(null);
                                setOpen(false);
                            }}
                        >
                            {cancelText}
                        </Button>

                        {/* Submit button allows async loading state before closing */}
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : submitText}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default DialogComp;