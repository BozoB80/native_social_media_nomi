import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Header from "@/components/Header";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";
import { getUserImageSrc, uploadFile } from "@/services/imageService";
import Icon from "@/assets/icons";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!currentUser) {
    return null;
  }

  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    image: "" as string | null | ImagePicker.ImagePickerAsset,
    bio: "",
    address: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name ?? "",
        phoneNumber: currentUser.phoneNumber ?? "",
        image: currentUser.image ?? null,
        bio: currentUser.bio ?? "",
        address: currentUser.address ?? "",
      });
    }
  }, [currentUser]);

  let imageSource =
    user.image && typeof user.image === "object" && "uri" in user.image
      ? (user.image as { uri: string }).uri
      : getUserImageSrc(currentUser?.image);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { address, bio, image, name, phoneNumber } = userData;
    if (!name || !phoneNumber || !address || !bio || !image) {
      Alert.alert("Profile", "Please enter all the fields");
      return;
    }
    setLoading(true);

    const updateData = {
      name,
      phoneNumber,
      address,
      bio,
      image: typeof image === "string" ? image : null,
    };

    if (typeof image === "object") {
      let imageRes = await uploadFile("profiles", image?.uri, true);
      if (imageRes.success && imageRes.data) {
        updateData.image = imageRes.data;
      } else {
        updateData.image = null;
      }
    }

    const res = await updateUser(currentUser?.id, updateData);

    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...updateData });
      router.back();
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Profile" />

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable onPress={onPickImage} style={styles.camera}>
                <Icon name="camera" size={20} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please enter your profile details
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline={true}
              onChangeText={(value) => setUser({ ...user, bio: value })}
              containerStyles={styles.bio}
            />
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
  },
  avatar: {
    height: "100%",
    width: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
  listStyle: {
    paddingBottom: 30,
    paddingHorizontal: wp(4),
  },
  bio: {
    flexDirection: "row",
    height: hp(10),
    alignItems: "flex-start",
    paddingVertical: 10,
  },
});
