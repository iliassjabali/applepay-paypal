'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <XIcon className="text-red-500" />
                        Payment Failed
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Something went wrong processing your payment.</p>
                    <p className="text-sm text-gray-500 mt-2">{error.message}</p>
                    <Button onClick={() => reset()}>Try again</Button>
                </CardContent>
            </Card>
        </div>
    )
} 