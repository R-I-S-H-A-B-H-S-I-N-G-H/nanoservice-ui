import React, { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
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
	/** trigger shown in the UI (button or any element). If omitted, a default button is used. */
	trigger?: ReactNode;
	/** dialog title */
	title?: string;
	/** dialog description / subtitle */
	description?: string;
	/** fields to auto-generate if you don't pass children */
	fields?: Field[];
	/** custom form body (if passed, `fields` are ignored) */
	children?: ReactNode;
	/** text on submit button */
	submitText?: string;
	/** text on cancel button */
	cancelText?: string;
	/** called with form values (simple key -> string map). May return a promise. */
	onSubmit?: (values: Record<string, string>) => void | Promise<void>;
	onCancel?: (values: any) => void | Promise<void>;
	/** when true, the dialog will close immediately after submit (DialogClose wrapped). default: true */
	closeOnSubmit?: boolean;
	className?: string;
};

export function DialogComp(props: DialogFormProps) {
	const { trigger, title = "Edit", description, fields, children, submitText = "Save", cancelText = "Cancel", onSubmit, onCancel, closeOnSubmit = true, className } = props;

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const fd = new FormData(e.currentTarget);
			const values: Record<string, string> = {};
			for (const [k, v] of fd.entries()) values[k] = String(v ?? "");
			if (onSubmit) await onSubmit(values);
			// only close after submit if requested
			// (we rely on Dialog API's internal `onOpenChange` or DialogClose if needed;
			// to close programmatically you'd use dialog state - omitted for brevity)
		} catch (err: any) {
			setError(err?.message ?? "Unknown error");
		} finally {
			setLoading(false);
		}
	}

	// ensure trigger doesn't submit any outer form
	const triggerNode = trigger ?? (
		<Button variant="default" aria-label={`Open ${title} dialog`} type="button">
			{title}
		</Button>
	);

	return (
		<Dialog>
			<DialogTrigger asChild>{triggerNode}</DialogTrigger>

			<DialogContent className={className ?? "sm:max-w-[425px]"}>
				{/* Put the form INSIDE DialogContent so inputs live inside the form DOM */}
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description && <DialogDescription>{description}</DialogDescription>}
					</DialogHeader>

					<div className="grid gap-4 py-2">
						{children ? (
							children
						) : (
							<>
								{fields?.map((f) => (
									<div className="grid gap-3" key={f.name}>
										<Label htmlFor={f.id ?? f.name}>{f.label ?? f.name}</Label>
										<Input id={f.id ?? f.name} name={f.name} defaultValue={f.defaultValue} placeholder={f.placeholder} type={f.type ?? "text"} />
									</div>
								))}
							</>
						)}
					</div>

					{error && (
						<div role="alert" className="text-sm text-destructive mb-2">
							{error}
						</div>
					)}

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" type="button" onClick={onCancel}>
								{cancelText}
							</Button>
						</DialogClose>

						{/* don't wrap submit with DialogClose if you want to wait for async onSubmit */}
						{closeOnSubmit ? (
							// Option A: close immediately (keeps current behavior)
							<DialogClose asChild>
								<Button type="submit" disabled={loading}>
									{loading ? "Saving..." : submitText}
								</Button>
							</DialogClose>
						) : (
							// Option B: keep dialog open until you programmatically close
							<Button type="submit" disabled={loading}>
								{loading ? "Saving..." : submitText}
							</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}


export default DialogComp;
