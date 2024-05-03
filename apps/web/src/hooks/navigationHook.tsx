"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@webSrc/contexts/AuthContext";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth } = useAuth();
  useEffect(() => {
    console.log(pathname);
    console.log(auth?.authenticated);
    // if (pathname != "/schedule" && pathname != "/") {
    //   router.push("/test");
    // }
    // You can now use the current URL
    // ...
  }, [pathname, searchParams]);

  return null;
}
