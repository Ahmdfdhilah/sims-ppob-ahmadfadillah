import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { formatCurrency } from "@/utils/number"
import { History, Clock } from "lucide-react"
import { transactionService } from "@/services/transaction"
import { TransactionHistoryRecord } from "@/services/transaction/types"
import { LIMIT } from "@/lib/constants"
import { getAmountColor, getAmountPrefix } from "@/utils/common"
import { formatDate } from "@/utils/date"
import { TransactionListSkeleton } from "./TransactionSkeleton"


export default function TransactionHistoryPage() {
    const [offset, setOffset] = useState(0)
    const [allTransactions, setAllTransactions] = useState<TransactionHistoryRecord[]>([])
    const [hasMore, setHasMore] = useState(true)

    const {
        data,
        isLoading,
        error,
        isFetching,
        isSuccess,
        isError
    } = useQuery({
        queryKey: ["transaction-history", offset],
        queryFn: () => transactionService.getTransactionHistory({
            offset,
            limit: LIMIT
        }),
    })

    // Handle successful data fetching
    useEffect(() => {
        if (isSuccess && data?.data?.records) {
            const records = data.data.records;

            if (offset === 0) {
                // First load
                setAllTransactions(records)
            } else {
                // Load more
                setAllTransactions(prev => [...prev, ...records])
            }

            // Check if there are more records to load
            setHasMore(records.length === LIMIT)
        }
    }, [isSuccess, data, offset])

    // Handle error state
    useEffect(() => {
        if (isError) {
            setHasMore(false)
        }
    }, [isError])

    const handleShowMore = () => {
        const newOffset = offset + LIMIT
        setOffset(newOffset)
    }

    return (

        <Card className="w-full">
            <CardHeader className="px-4 sm:px-6">
                <CardDescription className="text-sm sm:text-base md:text-lg">
                    Lihat Riwayat
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    Semua Transaksi
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription className="text-sm">
                            {error instanceof Error ? error.message : "Terjadi kesalahan saat memuat riwayat transaksi"}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Loading State for First Load */}
                {isLoading && offset === 0 && (
                    <TransactionListSkeleton count={6} />
                )}

                {/* Transaction List */}
                {!isLoading && allTransactions.length === 0 && !error ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                        <History className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                        <p className="text-base sm:text-lg text-muted-foreground mb-2">Belum ada riwayat transaksi</p>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                            Transaksi Anda akan muncul di sini setelah melakukan pembayaran atau top up
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {allTransactions.map((transaction, index) => (
                            <div
                                key={`${transaction.invoice_number}-${index}`}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-2 sm:gap-3"
                            >
                                {/* Amount and Date Section */}
                                <div className="flex flex-col gap-1 min-w-0">
                                    <p className={`font-bold text-base sm:text-lg ${getAmountColor(transaction.transaction_type)} truncate`}>
                                        {getAmountPrefix(transaction.transaction_type)} {formatCurrency(transaction.total_amount)}
                                    </p>
                                    <div className="flex flex-col text-xs sm:text-sm text-muted-foreground">
                                        <span>{formatDate(transaction.created_on)}</span>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="sm:text-right min-w-0 sm:flex-shrink-0">
                                    <p className="font-semibold text-foreground text-sm sm:text-base truncate sm:max-w-xs">
                                        {transaction.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Loading More Skeleton */}
                        {isFetching && offset > 0 && (
                            <TransactionListSkeleton count={3} />
                        )}

                        {/* Show More Button */}
                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    onClick={handleShowMore}
                                    disabled={isFetching}
                                    variant="outline"
                                    className="px-6 sm:px-8 text-primary w-full sm:w-auto"
                                    size="sm"
                                >
                                    {isFetching ? (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 animate-spin" />
                                            <span className="text-sm">Memuat...</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm">Show more</span>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* No More Data Message */}
                        {!hasMore && allTransactions.length > 0 && (
                            <div className="text-center py-4">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Tidak ada transaksi lain untuk ditampilkan
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}