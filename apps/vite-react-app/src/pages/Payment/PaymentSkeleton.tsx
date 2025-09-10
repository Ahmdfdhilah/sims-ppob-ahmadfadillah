import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
export const PaymentSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="h-6 bg-muted rounded w-24 animate-pulse" />
        </CardHeader>

        <CardContent className="space-y-6">
            {/* Service Info Skeleton */}
            <div className="flex items-center gap-4 p-4 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-6 bg-muted rounded w-40 animate-pulse" />
                    <div className="h-8 bg-muted rounded w-32 animate-pulse" />
                </div>
            </div>

            {/* Balance Info Skeleton */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                <div className="h-6 bg-muted rounded w-28 animate-pulse" />
            </div>

            {/* Payment Button Skeleton */}
            <div className="space-y-3">
                <div className="h-12 bg-muted rounded w-full animate-pulse" />
            </div>
        </CardContent>
    </Card>
)