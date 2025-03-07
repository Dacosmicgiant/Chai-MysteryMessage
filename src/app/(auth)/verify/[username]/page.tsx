'use client'
import { useParams, useRouter } from 'next/navigation'
import { toast } from "sonner";
import React from 'react'
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import * as z from 'zod'
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';

import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Corrected import

function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast("Success", {
                description: response.data.message
            });
            router.replace('/sign-in'); // Fixed navigation path

        } catch (error) {
            console.error("Error in verifying user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            
            toast("Verification failed", {
                description: axiosError.response?.data?.message || "Something went wrong",
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <h2 className="text-2xl font-semibold">Verify Your Account</h2>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter verification code" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Please enter the verification code sent to your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount;
