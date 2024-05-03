import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper(Component: any) {
  const authComponent = (props: any) => {
    const { auth } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!auth?.authenticated) {
        router.push("/login");
      }
    }, []);
    return auth?.authenticated ? <Component {...props} /> : null;
  };
  return authComponent;
}
