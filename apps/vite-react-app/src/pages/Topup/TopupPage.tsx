import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
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
import { PRESET_AMOUNTS } from "@/lib/constants"
import { Wallet } from "lucide-react"
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog"
import { transactionService } from "@/services/transaction"
import { TopUpRequestDto, topUpRequestSchema } from "./TopupDto"
import { useNavigate } from "react-router-dom"

export default function TopUpPage() {
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
    const [error, setError] = useState<string>("")
    const queryClient = useQueryClient()
    const navigate =  useNavigate();
    
    const form = useForm<TopUpRequestDto>({
        resolver: zodResolver(topUpRequestSchema),
        defaultValues: {
            top_up_amount: 0
        }
    })

    const topUpMutation = useMutation({
        mutationFn: (data: TopUpRequestDto) => transactionService.topUp(data),
        onSuccess: () => {
            const amount = form.getValues("top_up_amount")
            toast.success(
                'Top Up Berhasil!',
                {
                    description: `Top Up sebesar ${formatCurrency(amount)}`
                }
            )
            form.reset()
            setSelectedPreset(null)
            clearError()
            
            // Invalidate balance query
            queryClient.invalidateQueries({ queryKey: ["balance"] })
            
            queryClient.invalidateQueries({ queryKey: ["transaction-history"] })
            
            // Reset offset di TransactionHistoryPage jika sedang dibuka
            queryClient.setQueryData(["transaction-history-offset"], 0)

            navigate("/transaction")
        },
        onError: (error: any) => {
            setError(error.message || "Terjadi kesalahan saat melakukan top up")
        },
    })

    const clearError = () => {
        setError("")
    }

    const handleAmountChange = (value: string) => {
        // Clear error when user starts typing
        if (error) {
            clearError()
        }

        // Only allow numbers and convert to number
        const numericValue = value.replace(/[^0-9]/g, "")
        const numericAmount = numericValue ? parseInt(numericValue) : 0

        form.setValue("top_up_amount", numericAmount)
        setSelectedPreset(null)

        // Trigger validation
        form.trigger("top_up_amount")
    }

    const handlePresetSelect = (presetAmount: number) => {
        // Clear error when user selects preset
        if (error) {
            clearError()
        }

        form.setValue("top_up_amount", presetAmount)
        setSelectedPreset(presetAmount)

        // Trigger validation
        form.trigger("top_up_amount")
    }

    const onSubmit = (data: TopUpRequestDto) => {
        clearError()
        topUpMutation.mutate(data)
    }

    return (
        <Card>
            <CardHeader>
                <CardDescription className="text-md md:text-lg lg:text-xl">
                    Silahkan masukan
                </CardDescription>
                <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold text-balance">
                    Nominal Top Up
                </CardTitle>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Container 1: Input & Submit */}
                            <div className="flex flex-col gap-4 flex-1 md:basis-2/3">
                                <div className="space-y-2">
                                    {/* Error Alert - Similar to register page */}
                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="top_up_amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Wallet className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-opacity ${field.value > 0 ? 'opacity-100 text-foreground' : 'opacity-50 text-muted-foreground'
                                                            }`} />
                                                        <Input
                                                            type="text"
                                                            placeholder="Masukkan nominal"
                                                            value={field.value > 0 ? field.value.toLocaleString("id-ID") : ""}
                                                            onChange={(e) => handleAmountChange(e.target.value.replace(/[.,]/g, ""))}
                                                            className={`pl-10 text-lg transition-opacity ${field.value > 0 ? 'opacity-100' : 'opacity-60'
                                                                }`}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Top Up Button with AlertDialog */}
                                <ConfirmationDialog
                                    triggerText={
                                        <Button
                                            disabled={
                                                !!form.formState.errors.top_up_amount ||
                                                topUpMutation.isPending ||
                                                !form.watch("top_up_amount")
                                            }
                                            className="w-full h-12 text-lg font-semibold"
                                            size="lg"
                                        >
                                            {topUpMutation.isPending ? "Memproses..." : "Top Up"}
                                        </Button>
                                    }
                                    title="Konfirmasi Top Up"
                                    description={`Apakah Anda yakin ingin melakukan top up sebesar ${formatCurrency(form.watch("top_up_amount"))}?`}
                                    onConfirm={form.handleSubmit(onSubmit)}
                                    isLoading={topUpMutation.isPending}
                                >

                                </ConfirmationDialog>
                            </div>

                            {/* Container 2: Preset Amounts */}
                            <div className="flex flex-col gap-3 flex-1 md:basis-1/3">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {PRESET_AMOUNTS.map((presetAmount) => (
                                        <Button
                                            key={presetAmount}
                                            type="button"
                                            variant={selectedPreset === presetAmount ? "default" : "outline"}
                                            onClick={() => handlePresetSelect(presetAmount)}
                                            className="h-12 text-sm"
                                        >
                                            {formatCurrency(presetAmount)}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    )
}