import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { getUserImageSrc } from "@/services/imageService";

type AvatarProps = {
  uri: string;
  size?: number;
  rounded: number;
  style: any;
};

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {},
}: AvatarProps) => {
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: rounded },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
    borderCurve: "continuous",
  },
});
