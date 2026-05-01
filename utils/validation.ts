import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8)
    .max(64)
    .regex(/[a-z]/, 'lower')
    .regex(/[A-Z]/, 'upper')
    .regex(/[0-9]/, 'digit')
    .regex(/[^A-Za-z0-9]/, 'symbol'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const pinDigitsRegex = /^\d{5}$/;
