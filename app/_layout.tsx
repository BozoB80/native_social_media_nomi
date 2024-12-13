import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: TRenderEngineProvider", "Warning: MemoizedTNodeRenderer", "Warning: TNodeChildrenRenderer"])

const AuthLayout = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

const RootLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user: any) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData(res.data);
    }
  };

  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(main)/postDetails" options={{
      presentation: "modal"
    }} />
  </Stack>
};

export default AuthLayout;
