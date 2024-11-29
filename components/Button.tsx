import { StyleSheet, Text, View } from "react-native";

type ButtonProps = {
  buttonStyle: string;
  textStyle: string;
  title: string;
  onPress: () => void;
};

const Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress,
}: ButtonProps) => {
  return (
    <View>
      <Text>Button</Text>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({});
