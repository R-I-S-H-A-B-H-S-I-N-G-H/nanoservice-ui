import React from "react";
// Import the cn utility
import { cn } from "@/lib/utils";
import { Table as ShadTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

interface Column<T> {
	header: string;
	accessor: keyof T;
	render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
	columns: Column<T>[];
	data: T[];
	rowActions?: (item: T) => React.ReactNode;
	onRowClick?: (item: T) => void;
	// Add this prop to check if a row should be disabled
	isRowDisabled?: (item: T) => boolean;

	// Pagination
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
}

export function TableComp<T>({
	columns,
	data,
	rowActions,
	onRowClick,
	isRowDisabled, // Destructure the new prop
	currentPage,
	totalPages,
	onPageChange,
}: TableProps<T>) {
	const getPages = () => {
		if (!totalPages || !currentPage) return [];
		const pages = [];
		for (let i = 1; i <= totalPages; i++) {
			if (totalPages > 5 && i > 3 && i < totalPages - 2) continue;
			pages.push(i);
		}
		return pages;
	};

	const pages = getPages();

	return (
		<div className="flex flex-col gap-3">
			<ShadTable className="w-full border border-border rounded-lg">
				<TableHeader className="bg-muted">
					<TableRow>
						{columns.map((col) => (
							<TableHead key={String(col.accessor)} className="text-muted-foreground">
								{col.header}
							</TableHead>
						))}
						{rowActions && <TableHead className="text-muted-foreground">Actions</TableHead>}
					</TableRow>
				</TableHeader>

				<TableBody>
					{data.map((item, idx) => {
						// Check if the current row is disabled
						const disabled = isRowDisabled?.(item) ?? false;

						return (
							<TableRow
								key={idx}
								// Use cn to conditionally apply styles
								className={cn(disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent")}
								// Conditionally call onRowClick only if not disabled
								onClick={() => !disabled && onRowClick?.(item)}
							>
								{columns.map((col) => (
									<TableCell key={String(col.accessor)} className="text-foreground">
										{col.render ? col.render(item) : String(item[col.accessor])}
									</TableCell>
								))}
								{rowActions && (
									<TableCell className="text-foreground">
										{/* Disable pointer events on actions if row is disabled */}
										<div className={cn(disabled && "pointer-events-none")}>{rowActions(item)}</div>
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</ShadTable>

			{/* ... (Pagination code remains the same) ... */}
			{totalPages && currentPage && totalPages > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage > 1) onPageChange?.(currentPage - 1);
								}}
								className="text-foreground hover:text-primary"
							/>
						</PaginationItem>

						{pages.map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									href="#"
									isActive={page === currentPage}
									onClick={(e) => {
										e.preventDefault();
										onPageChange?.(page);
									}}
									className={`text-foreground ${page === currentPage ? "bg-primary text-primary-foreground" : ""}`}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}

						{totalPages > 5 && (
							<PaginationItem>
								<PaginationEllipsis className="text-muted-foreground" />
							</PaginationItem>
						)}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage < totalPages) onPageChange?.(currentPage + 1);
								}}
								className="text-foreground hover:text-primary"
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
