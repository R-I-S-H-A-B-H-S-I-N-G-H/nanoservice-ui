import { useState, type DragEvent } from "react";
import { Badge } from "@/components/ui/badge";

type FileUploadProps = {
	selectedFile: File | null;
	onFileSelect: (file: File) => void;
};

export function FileUploadArea({ selectedFile, onFileSelect }: FileUploadProps) {
	const [dragging, setDragging] = useState(false);

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			onFileSelect(e.dataTransfer.files[0]);
		}
	};

	return (
		<div
			className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-transparent"}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={() => document.getElementById("fileInput")?.click()}
		>
			{selectedFile ? (
				<div className="flex flex-col items-center space-y-2">
					<p className="font-medium">{selectedFile.name}</p>
					<Badge variant="outline">{selectedFile.type.split("/").pop()}</Badge>
				</div>
			) : (
				<p className="text-gray-500">Drag & drop a file here or click to select</p>
			)}
			<input
				id="fileInput"
				type="file"
				className="hidden"
				onChange={(e) => {
					if (e.target.files && e.target.files[0]) {
						onFileSelect(e.target.files[0]);
					}
				}}
			/>
		</div>
	);
}
