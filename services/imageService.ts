import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/lib/supabase";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

export const getUserImageSrc = (imagePath?: string | null) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("@/assets/images/defaultUser.png");
  }
};

export const getSupabaseFileUrl = (filepath: string) => {
  if (filepath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filepath}`,
    };
  } else {
    return null;
  }
};
export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage: boolean = true
) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });

    if (error) {
      console.log("file upload error: ", error);
      return {
        success: false,
        msg: "Could not upload media",
      };
    }

    console.log("data: ", data);

    return { success: true, data: data?.path };
  } catch (error) {
    console.log("file upload error: ", error);
    return {
      success: false,
      msg: "Could not upload media",
    };
  }
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
