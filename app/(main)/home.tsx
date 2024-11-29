import { Alert, StyleSheet, Text } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Signout", "Error signing out");
    }
  };

  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title="Logout" onPress={onLogout} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
