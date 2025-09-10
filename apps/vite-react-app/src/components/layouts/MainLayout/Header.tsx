import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
    Eye,
    EyeOff
} from 'lucide-react';
import { formatCurrency } from '@/utils/number';
import { WaveBackground } from '@/components/common/WaveBackground';
import { getFullName } from '@/utils/user';
import { useAuth } from '@/hooks/useAuth';
import { DEFAULT_PROFILE_IMAGE } from '@/lib/constants';
import HeaderSkeleton from './HeaderSkeleton';

const Header = () => {
    const [showBalance, setShowBalance] = React.useState(false);
    const { user, isLoading: userLoading } = useAuth();

    // Fetch balance using React Query
    const {
        data: balanceData,
        isLoading: balanceLoading,
        error: balanceError
    } = useQuery({
        queryKey: ['balance'],
        queryFn: () => transactionService.getBalance(),
        enabled: !!user,
    });

    // Show skeleton when user is loading or not available yet
    if (userLoading || !user) {
        return (
            <HeaderSkeleton />
        );
    }

    return (
        <>
            {/* Header Section */}
            <div className="flex flex-col-reverse lg:flex-row gap-6">
                {/* User Welcome Section - Simple Card Style */}
                <Card className="relative overflow-hidden lg:basis-1/3 bg-transparent">
                    <CardContent className="p-4 sm:p-6 relative z-10">
                        <div className="flex flex-col space-y-3 sm:space-y-4">
                            <Avatar className="w-15 h-15 sm:w-20 sm:h-20 border-2 border-primary/20 self-start">
                                <AvatarImage
                                    src={user?.profile_image || DEFAULT_PROFILE_IMAGE}
                                    alt={`${user?.first_name} ${user?.last_name}`}
                                />
                                <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm sm:text-base">
                                    {user?.first_name?.[0]}
                                    {user?.last_name?.[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col space-y-1">
                                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                                    Selamat datang,
                                </p>
                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight break-words">
                                    {user && getFullName(user)}
                                </h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Balance Card - Primary Background with Waves */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg lg:flex-1 relative overflow-hidden lg:basis-2/3 py-4">
                    {/* Wave Pattern Background */}
                    <div className="absolute inset-0">
                        <WaveBackground />
                    </div>
                    <div className="mx-auto p-4 sm:p-6 relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="w-full">
                                <p className="text-sm sm:text-md opacity-90 px-2">Saldo Anda</p>
                                <div className="mb-3 p-2">
                                    {balanceLoading ? (
                                        <Skeleton className="h-6 sm:h-8 w-24 sm:w-32" />
                                    ) : balanceError ? (
                                        <p className="text-primary-foreground/80 text-xs sm:text-sm">Error loading balance</p>
                                    ) : (
                                        <h2 className="text-xl sm:text-3xl font-bold text-primary-foreground break-all">
                                            {showBalance ? formatCurrency(balanceData?.data?.balance || 0) : "Rp ••••••••"}
                                        </h2>
                                    )}
                                </div>

                                {/* Eye + text di bawah saldo */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="flex items-center space-x-2 text-primary-foreground p-2 h-auto text-xs sm:text-sm transition-colors"
                                >
                                    {showBalance ? (
                                        <>
                                            <span className="whitespace-nowrap">Tutup saldo</span>
                                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        </>
                                    ) : (
                                        <>
                                            <span className="whitespace-nowrap">Lihat saldo</span>
                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header