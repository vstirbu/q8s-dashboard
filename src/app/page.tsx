import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignIn } from "@/components/signin-button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  if (user) {
    redirect("/cluster/dashboard");
  }

  return (
    <main className="grid min-h-screen w-full">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Welcome to Qubernetes dashboard
              </p>
              {/* <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p> */}
            </div>
            <div className="grid gap-4">
              {/* <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div> */}
              {/* <Button type="submit" className="w-full">
                Login
              </Button> */}
              <SignIn />
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div> */}
            <div className="mt-10 text-center text-sm">
              Don&apos;t know why?{" "}
              <Link
                href="https://www.qubernetes.dev/"
                target="_blank"
                className="underline"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src="/placeholder.svg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </main>
  );
}
