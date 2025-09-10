// Skeleton component for transaction items
export const TransactionSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
            <div className="flex flex-col space-y-2">
                <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            </div>
        </div>
        <div className="text-right">
            <div className="h-5 bg-muted rounded w-40 animate-pulse" />
        </div>
    </div>
)

// Loading skeleton for multiple transaction items
export const TransactionListSkeleton = ({ count = 6 }: { count?: number }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
            <TransactionSkeleton key={index} />
        ))}
    </div>
)