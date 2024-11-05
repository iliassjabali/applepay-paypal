import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
        <p>
          Your payment has been cancelled. You can try again by returning to
          checkout.
        </p>
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          Return to Checkout
        </Link>
      </div>
    </div>
  );
}
