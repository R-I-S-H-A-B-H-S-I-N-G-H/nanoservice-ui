import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaHeaderProps {
  onUpload: () => void;
  onSearch: (query: string) => void;
}

export function MediaHeader({ onUpload, onSearch }: MediaHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <h1 className="text-lg font-semibold">Media</h1>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button onClick={onUpload}>Upload</Button>
      </div>
    </header>
  );
}
