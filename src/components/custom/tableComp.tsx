import React from "react";
import { Table as ShadTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

interface Column<T> {
	header: string;
	accessor: keyof T;
	render?: (item: T) => React.ReactNode; // optional custom render
}

interface TableProps<T> {
	columns: Column<T>[];
	data: T[];
	rowActions?: (item: T) => React.ReactNode;
	onRowClick?: (item: T) => void;

	// Pagination
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
}

export function TableComp<T>({ columns, data, rowActions, onRowClick, currentPage, totalPages, onPageChange }: TableProps<T>) {
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
					{data.map((item, idx) => (
						<TableRow key={idx} className="hover:bg-accent cursor-pointer" onClick={() => onRowClick?.(item)}>
							{columns.map((col) => (
								<TableCell key={String(col.accessor)} className="text-foreground">
									{col.render ? col.render(item) : String(item[col.accessor])}
								</TableCell>
							))}
							{rowActions && <TableCell className="text-foreground">{rowActions(item)}</TableCell>}
						</TableRow>
					))}
				</TableBody>
			</ShadTable>

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
