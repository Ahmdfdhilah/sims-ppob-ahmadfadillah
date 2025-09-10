import { WaveBackground } from '@/components/common/WaveBackground';
import { Card, CardContent } from '@workspace/ui/components/card';

const HeaderSkeleton = () => {
    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6">
            <Card className="relative overflow-hidden lg:basis-1/3 bg-transparent">
                <CardContent className="p-4 sm:p-6 relative z-10">
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        {/* Avatar Skeleton */}
                        <div className="w-15 h-15 sm:w-20 sm:h-20 bg-muted rounded-full animate-pulse self-start" />

                        {/* Welcome Text Skeleton */}
                        <div className="flex flex-col space-y-1">
                            <div className="h-5 sm:h-6 lg:h-7 bg-muted rounded w-32 sm:w-40 animate-pulse" />
                            <div className="h-5 sm:h-7 lg:h-8 bg-muted rounded w-40 sm:w-48 animate-pulse" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg lg:flex-1 relative overflow-hidden lg:basis-2/3 py-4">
                {/* Wave Pattern Background */}
                <div className="absolute inset-0">
                    <WaveBackground />
                </div>
                <div className="mx-auto p-4 sm:p-6 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="w-full">
                            {/* "Saldo Anda" text skeleton */}
                            <div className="h-4 sm:h-5 bg-primary-foreground/30 rounded w-20 sm:w-24 mb-3 animate-pulse px-2" />

                            {/* Balance amount skeleton */}
                            <div className="mb-3 p-2">
                                <div className="h-6 sm:h-8 bg-primary-foreground/30 rounded w-32 sm:w-40 animate-pulse" />
                            </div>

                            {/* Eye button skeleton */}
                            <div className="flex items-center space-x-2 p-2">
                                <div className="h-3 sm:h-4 bg-primary-foreground/30 rounded w-20 sm:w-24 animate-pulse" />
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary-foreground/30 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderSkeleton