import { View } from "react-native";
import React from "react";
import Loading from "@/components/Loading";

const Home = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Loading />
    </View>
  );
};

export default Home;
