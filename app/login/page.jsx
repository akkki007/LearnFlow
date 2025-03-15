import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Header from "@/components/Header"
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    
    (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div
              className="flex h-20 w-52 items-center justify-center">
              <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={450}
                height={250}
                className="rounded-md"
              />
              </Link>
            </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/rightbg.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>)
  );
}
