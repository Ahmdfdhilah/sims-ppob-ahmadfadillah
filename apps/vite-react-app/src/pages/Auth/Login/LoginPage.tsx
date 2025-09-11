import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequest } from "@/services/membership/types";
import { LoginDto, loginSchema } from "./LoginDto";
import { logoImg } from "@/lib/constants";

export const LoginPage: React.FC = () => {
  const { login, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginDto) => {
    clearError();
    const result = await login(data as LoginRequest);
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <Card className="border-0 md:shadow-none md:bg-transparent">
      <CardHeader className="space-y-4 pb-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <img
            src={logoImg}
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold">SIMS PPOB</span>
        </div>

        <CardTitle className="text-3xl font-bold">
          Masuk atau buat akun untuk memulai
        </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
 
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-opacity ${field.value ? 'opacity-100 text-foreground' : 'opacity-50 text-muted-foreground'
                        }`} />
                      <Input
                        type="email"
                        placeholder="masukan email anda"
                        className={`h-11 pl-10 transition-opacity ${field.value ? 'opacity-100' : 'opacity-60'
                          }`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-opacity ${field.value ? 'opacity-100 text-foreground' : 'opacity-50 text-muted-foreground'
                        }`} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="masukan password"
                        className={`h-11 pl-10 pr-10 transition-opacity ${field.value ? 'opacity-100' : 'opacity-60'
                          }`}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className={`h-4 w-4 transition-opacity ${field.value ? 'opacity-100 text-foreground' : 'opacity-50 text-muted-foreground'
                            }`} />
                        ) : (
                          <Eye className={`h-4 w-4 transition-opacity ${field.value ? 'opacity-100 text-foreground' : 'opacity-50 text-muted-foreground'
                            }`} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              belum punya akun? registrasi{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-medium text-primary"
                onClick={() => {
                  clearError(); 
                  navigate("/register");
                }}
              >
                disini
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};