
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// New component for advanced pagination with ellipsis
const PaginationPageAction = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
}) => {
  // Generate page numbers logic
  const generatePages = () => {
    // Always show first page
    const firstPage = [1];
    
    // Calculate the start and end of the current group
    const startPage = Math.max(2, currentPage - siblingsCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingsCount);
    
    // Create arrays for different sections
    const middlePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    
    // Always show last page if it exists
    const lastPage = totalPages > 1 ? [totalPages] : [];
    
    // Calculate if we need ellipsis
    const needsLeftEllipsis = startPage > 2;
    const needsRightEllipsis = endPage < totalPages - 1;
    
    const items = [
      ...firstPage,
      ...(needsLeftEllipsis ? ["ellipsis-left"] : []),
      ...middlePages,
      ...(needsRightEllipsis ? ["ellipsis-right"] : []),
      ...lastPage,
    ];
    
    return items;
  };
  
  const pages = generatePages();
  
  // Don't render if only one page
  if (totalPages <= 1) return null;
  
  return (
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious 
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          aria-disabled={currentPage === 1}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
      
      {pages.map((page, index) => {
        if (page === "ellipsis-left" || page === "ellipsis-right") {
          return (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        
        return (
          <PaginationItem key={index}>
            <PaginationLink 
              isActive={currentPage === page}
              onClick={() => onPageChange(page as number)}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      })}
      
      <PaginationItem>
        <PaginationNext
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          aria-disabled={currentPage === totalPages}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    </PaginationContent>
  );
};
PaginationPageAction.displayName = "PaginationPageAction";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationPageAction,
}
