import {
    Card,
    CardContent,
    CardHeader,
} from "@workspace/ui/components/card";

const AccountSkeleton = () => {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center space-y-4 pb-6">
                {/* Avatar Skeleton */}
                <div className="relative mx-auto w-32 h-32">
                    <div className="w-32 h-32 bg-muted rounded-full animate-pulse" />
                </div>

                {/* Name Skeleton */}
                <div className="space-y-2">
                    <div className="h-8 bg-muted rounded w-48 mx-auto animate-pulse" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Email Field Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                    <div className="relative">
                        <div className="h-11 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* First Name Field Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                    <div className="relative">
                        <div className="h-11 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Last Name Field Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                    <div className="relative">
                        <div className="h-11 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col space-y-4 pt-4">
                    <div className="h-11 bg-muted rounded animate-pulse" />
                    <div className="h-11 bg-muted rounded animate-pulse" />
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountSkeleton