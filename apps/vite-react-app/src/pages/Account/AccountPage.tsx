import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Edit2, User, Mail, X, Check, LogOut, Camera } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { useAuth } from "@/hooks/useAuth";
import type { UpdateProfileRequest } from "@/services/membership/types";
import { UpdateProfileDto, updateProfileSchema, profileImageSchema } from "./AccountDto";
import { DEFAULT_PROFILE_IMAGE } from "@/lib/constants";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import AccountSkeleton from "./AccountSkeleton";


export const AccountPage: React.FC = () => {
    const {
        user,
        logout,
        updateProfile,
        updateProfileImage,
        refreshProfile,
        isLoading,
        error,
        clearError
    } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const form = useForm<UpdateProfileDto>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
        },
    });

    // Update form when user data changes
    React.useEffect(() => {
        if (user) {
            form.reset({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
            });
        }
    }, [user, form]);

    const handleProfileImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Validate file using Zod schema
            const validationResult = profileImageSchema.safeParse({ file });
            if (!validationResult.success) {
                // Error handling is done in Redux
                return;
            }

            setIsUploadingImage(true);
            clearError();

            const result = await updateProfileImage(file);

            if (result.success) {
                // Refresh profile to get updated image
                await refreshProfile();
            }
        } catch (error) {
            // Error handling is done in Redux
        } finally {
            setIsUploadingImage(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const onSubmit = async (data: UpdateProfileDto) => {
        clearError();

        try {
            const result = await updateProfile(data as UpdateProfileRequest);

            if (result.success) {
                setIsEditing(false);
                // Refresh profile to get updated data
                await refreshProfile();
            }
        } catch (error) {
            // Error handling is done in Redux
        }
    };

    const handleEditClick = () => {
        clearError();
        setIsEditing(true);
    };

    const handleCancelClick = async () => {
        // Reset form to original values
        if (user) {
            form.reset({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
            });
        }
        clearError();
        setIsEditing(false);
    };

    const handleLogout = async () => {
        logout();
        navigate("/login");
    };

    // Show skeleton 
    if (!user) {
        return (
            <AccountSkeleton />
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center space-y-4 pb-6">
                <div className="relative mx-auto w-32 h-32 group">
                    <Avatar
                        className="w-32 h-32 cursor-pointer transition-all duration-200"
                        onClick={handleProfileImageClick}
                    >
                        <AvatarImage
                            src={user.profile_image || DEFAULT_PROFILE_IMAGE}
                            alt="Profile"
                            className="object-cover"
                        />
                        <AvatarFallback className="text-2xl bg-muted">
                            {user?.first_name?.[0]}
                            {user?.last_name?.[0]}
                        </AvatarFallback>
                    </Avatar>

                    {/* Hover overlay with clear edit indication */}
                    <div
                        onClick={handleProfileImageClick}
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-white text-xs font-medium">Edit Foto</span>
                    </div>

                    {/* Loading overlay */}
                    {isUploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                />

                <CardTitle className="text-2xl font-bold">
                    {user.first_name} {user.last_name}
                </CardTitle>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Email Field (Read-only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={user.email || ""}
                                    disabled
                                    className="h-11 pl-10 bg-muted"
                                />
                            </div>
                        </div>

                        {/* First Name Field */}
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        Nama Depan
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-opacity ${field.value ? 'opacity-100 text-foreground' : 'opacity-50 text-muted-foreground'
                                                }`} />
                                            <Input
                                                placeholder="Masukan nama depan"
                                                disabled={!isEditing}
                                                className={`h-11 pl-10 transition-opacity ${!isEditing ? 'bg-muted' : field.value ? 'opacity-100' : 'opacity-60'
                                                    }`}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Last Name Field */}
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        Nama Belakang
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-opacity ${field.value ? 'opacity-100 text-foreground' : 'opacity-50 text-muted-foreground'
                                                }`} />
                                            <Input
                                                placeholder="Masukan nama belakang"
                                                disabled={!isEditing}
                                                className={`h-11 pl-10 transition-opacity ${!isEditing ? 'bg-muted' : field.value ? 'opacity-100' : 'opacity-60'
                                                    }`}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-4 pt-4">
                            {!isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        onClick={handleEditClick}
                                        className="w-full h-11 text-sm font-medium"
                                        variant="outline"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>

                                    <ConfirmationDialog
                                        triggerText={
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="w-full h-11 text-sm font-medium"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </Button>
                                        }
                                        title="Konfirmasi Logout"
                                        description="Apakah Anda yakin ingin keluar dari akun ini?"
                                        onConfirm={handleLogout}
                                        confirmText="Ya, Logout"
                                        cancelText="Batal"
                                        variant="destructive"
                                    />
                                </>
                            ) : (
                                <div className="flex space-x-4">
                                    <ConfirmationDialog
                                        triggerText={
                                            <Button
                                                type="button"
                                                disabled={isLoading}
                                                className="flex-1 h-11 text-sm font-medium"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Simpan
                                                    </>
                                                )}
                                            </Button>
                                        }
                                        title="Konfirmasi Simpan"
                                        description="Apakah Anda yakin ingin menyimpan perubahan profil ini?"
                                        onConfirm={() => form.handleSubmit(onSubmit)()}
                                        confirmText="Ya, Simpan"
                                        cancelText="Batal"
                                        isLoading={isLoading}
                                    />

                                    <ConfirmationDialog
                                        triggerText={
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isLoading}
                                                className="flex-1 h-11 text-sm font-medium"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Batalkan
                                            </Button>
                                        }
                                        title="Konfirmasi Batal"
                                        description="Apakah Anda yakin ingin membatalkan perubahan? Semua perubahan yang belum disimpan akan hilang."
                                        onConfirm={handleCancelClick}
                                        confirmText="Ya, Batalkan"
                                        cancelText="Tetap Edit"
                                        variant="outline"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    );
};