import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@workspace/ui/components/form"
import { toast } from "@workspace/ui/components/sonner"
import { formatCurrency } from "@/utils/number"
import { CreditCard, Loader2, Wallet } from "lucide-react"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { transactionService } from "@/services/transaction"
import { informationService } from "@/services/information"
import { paymentRequestSchema, type PaymentRequestDto } from "./PaymentRequestDto"
import { PaymentSkeleton } from "./PaymentSkeleton"


export default function PaymentPage() {
    const { serviceCode } = useParams<{ serviceCode: string }>()
    const navigate = useNavigate()
    const [error, setError] = useState<string>("")
    const queryClient = useQueryClient()

    const form = useForm<PaymentRequestDto>({
        resolver: zodResolver(paymentRequestSchema),
        defaultValues: {
            service_code: serviceCode || ""
        }
    })

    // Get user balance
    const { data: balanceData, isLoading: balanceLoading } = useQuery({
        queryKey: ["balance"],
        queryFn: () => transactionService.getBalance()
    })

    // Get services to find current service details
    const { data: servicesData, isLoading: servicesLoading } = useQuery({
        queryKey: ["services"],
        queryFn: () => informationService.getServices()
    })

    // Find current service
    const currentService = servicesData?.data?.find(
        service => service.service_code === serviceCode
    )

    const paymentMutation = useMutation({
        mutationFn: (data: PaymentRequestDto) => transactionService.createTransaction(data),
        onSuccess: () => {
            toast.success(
                'Pembayaran Berhasil!',
                {
                    description: `Pembayaran ${currentService?.service_name} berhasil`
                }
            )
            clearError()

            // Invalidate semua query yang terkait
            queryClient.invalidateQueries({ queryKey: ["balance"] })

            queryClient.invalidateQueries({ queryKey: ["transaction-history"] })

            // Reset offset di TransactionHistoryPage jika sedang dibuka
            queryClient.setQueryData(["transaction-history-offset"], 0)

            navigate("/transaction")
        },
        onError: (error: any) => {
            setError(error.message || "Terjadi kesalahan saat melakukan pembayaran")
        },
    })

    const clearError = () => {
        setError("")
    }

    const onSubmit = (data: PaymentRequestDto) => {
        clearError()
        paymentMutation.mutate(data)
    }

    // Set form value when serviceCode changes
    useEffect(() => {
        if (serviceCode) {
            form.setValue("service_code", serviceCode)
        }
    }, [serviceCode, form])

    // Show skeleton 
    if (servicesLoading || balanceLoading) {
        return <PaymentSkeleton />
    }

    return (
        <Card>
            <CardHeader>
                <CardDescription className="text-lg md:text-xl lg:text-2xl">
                    Pembayaran
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        {/* Service Info */}
                        <div className="flex items-center gap-4 p-4 rounded-lg">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <img
                                    src={currentService?.service_icon}
                                    alt={currentService?.service_name || 'Service'}
                                    className="max-w-full max-h-full"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{currentService?.service_name}</h3>
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(currentService?.service_tariff || 0)}
                                </p>
                            </div>
                        </div>

                        {/* Balance Info */}
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <Wallet className="w-5 h-5" />
                            <span className={`font-semibold ${(balanceData?.data?.balance || 0) < (currentService?.service_tariff || 0) ? 'text-destructive' : 'text-foreground'}`}>
                                {formatCurrency(balanceData?.data?.balance || 0)}
                            </span>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Insufficient Balance Alert */}
                        {(balanceData?.data?.balance || 0) < (currentService?.service_tariff || 0) && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    Saldo tidak mencukupi. Anda perlu top up sebesar {formatCurrency((currentService?.service_tariff || 0) - (balanceData?.data?.balance || 0))} lagi.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Hidden form field for service_code */}
                        <FormField
                            control={form.control}
                            name="service_code"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <input type="hidden" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Payment Button with ConfirmationDialog */}
                        <div className="space-y-3">
                            {(balanceData?.data?.balance || 0) < (currentService?.service_tariff || 0) ? (
                                <Button
                                    type="button"
                                    onClick={() => navigate("/top-up")}
                                    className="w-full h-12 text-lg font-semibold"
                                    size="lg"
                                >
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Top Up Saldo
                                </Button>
                            ) : (
                                <ConfirmationDialog
                                    triggerText={
                                        <Button
                                            disabled={
                                                paymentMutation.isPending ||
                                                (balanceData?.data?.balance || 0) < (currentService?.service_tariff || 0) ||
                                                !form.watch("service_code")
                                            }
                                            className="w-full h-12 text-lg font-semibold"
                                            size="lg"
                                        >
                                            {paymentMutation.isPending ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="h-5 w-5 mr-2" />
                                                    Bayar {formatCurrency(currentService?.service_tariff || 0)}
                                                </>
                                            )}
                                        </Button>
                                    }
                                    title="Konfirmasi Pembayaran"
                                    description={`Apakah Anda yakin ingin melakukan pembayaran senilai ${formatCurrency(currentService?.service_tariff || 0)}?`}
                                    onConfirm={form.handleSubmit(onSubmit)}
                                    isLoading={paymentMutation.isPending}
                                />
                            )}
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    )
}