import { useQuery } from '@tanstack/react-query';
import { informationService } from '@/services/information';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { UserProfile } from '@/services/membership';
import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { useNavigate } from 'react-router-dom';

interface DashboardServicesProps {
    user?: UserProfile | null
}
const DashboardServices: React.FC<DashboardServicesProps> = ({ user }) => {
    const navigate = useNavigate();

    // Fetch services using React Query
    const {
        data: servicesData,
        isLoading: servicesLoading,
        error: servicesError
    } = useQuery({
        queryKey: ['services'],
        queryFn: () => informationService.getServices(),
        enabled: !!user,
    });

    return (
        <>
            {/* Services Section */}
            <Card className='bg-transparent'>
                <CardContent className="p-0">
                    {servicesLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-24" />
                            ))}
                        </div>
                    ) : servicesError ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Error loading services</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
                            {servicesData?.data?.slice(0, 8).map((service) => (
                                <Button
                                    key={service.service_code}
                                    variant="ghost"
                                    onClick={() => navigate(`/payment/${service.service_code}`)}
                                    className="flex flex-col items-center justify-center text-center space-y-2 h-auto hover:bg-transparent hover:scale-105 transition-transform"
                                >

                                    <div className="w-24 flex items-center justify-center">
                                        <img
                                            src={service.service_icon}
                                            alt={service.service_name}
                                            className="text-primary"
                                        />
                                    </div>
                                    <span className="text-xs font-medium">
                                        {service.service_name}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

        </>
    )
}

export default DashboardServices