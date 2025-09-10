import { z } from 'zod';

export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'Nama depan wajib diisi')
    .max(50, 'Nama depan maksimal 50 karakter'),
  last_name: z
    .string()
    .min(1, 'Nama belakang wajib diisi')
    .max(50, 'Nama belakang maksimal 50 karakter'),
});


export const profileImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 100 * 1024, 'Ukuran file maksimal 100KB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'Format file harus JPG, JPEG, atau PNG'
    ),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ProfileImageDto = z.infer<typeof profileImageSchema>;