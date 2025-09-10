import { Card, CardContent } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useQuery } from '@tanstack/react-query';
import { informationService } from '@/services/information';

const DashboardBanner = () => {
    // Fetch banners using React Query (public API)
    const {
        data: bannersData,
        isLoading: bannersLoading,
        error: bannersError
    } = useQuery({
        queryKey: ['banners'],
        queryFn: () => informationService.getBanners(),
    });

    return (
        <>
            <Card className='bg-transparent'>
                <CardContent className="py-0">
                    <h3 className="text-lg font-semibold mb-4">Temukan Promo Menarik</h3>
                    {bannersLoading ? (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="w-80 h-48 flex-shrink-0 rounded-lg" />
                            ))}
                        </div>
                    ) : bannersError ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Error loading banners</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {bannersData?.data?.map((banner, index) => (
                                <div
                                    key={index}
                                    className="group relative w-80 h-48 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                                >
                                    <img
                                        src={banner.banner_image}
                                        alt={banner.banner_name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
                                        <h4 className="text-white font-bold text-xl mb-3 leading-tight">
                                            {banner.banner_name}
                                        </h4>
                                        <p className="text-white/90 text-sm leading-relaxed">
                                            {banner.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default DashboardBanner