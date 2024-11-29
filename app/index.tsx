import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";

const Home = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title="Welcome" onPress={() => router.push("/welcome")} />
    </ScreenWrapper>
  );
};

export default Home;
