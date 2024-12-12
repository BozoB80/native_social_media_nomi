import { UpdateTables } from "@/helpers/types";
import { uploadFile } from "./imageService";
import { supabase } from "@/lib/supabase";

interface FileUpload {
  type: "image" | "video"
  uri: string
}

type PostWithUpload = Omit<UpdateTables<"posts">, "file"> & {
  file: string | FileUpload | null
}

export const createOrUpdatePost = async (post: PostWithUpload) => {
  try {
    let postToUpsert = { ...post };

    if (post.file && typeof post.file === "object") {
      let isImage = post.file.type === "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post.file.uri, isImage)
      if (fileResult.success && fileResult.data) {
        postToUpsert.file = fileResult.data
      } else {
        return fileResult
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(postToUpsert as UpdateTables<"posts">)
      .select()
      .single()

    if (error) {
      console.log("create post error: ", error);
      return {success: false, msg: "Could not create your post"}
    }

    return {success: true, data: data}

  } catch (error) {
    console.log("create post error: ", error);
    return {success: false, msg: "Could not create your post"}
  }
};


export const fetchPosts = async (limit=10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *, 
        user: users(id, name, image),
        postLikes(*)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.log("fetch posts error: ", error);
      return {success: false, msg: "Could not create the posts"}
    }

    return {success: true, data: data}    

  } catch (error) {
    console.log("fetch posts error: ", error);
    return {success: false, msg: "Could not create the posts"}
  }
};


export const createPostLike = async (postLike: UpdateTables<"postLikes">) => {
  try {
    const { data, error } = await supabase
    .from("postLikes")
    .insert(postLike)
    .select()
    .single()      

    if (error) {
      console.log("postLike error: ", error);
      return {success: false, msg: "Could not like the posts"}
    }

    return {success: true, data: data}    

  } catch (error) {
    console.log("postLike error: ", error);
    return {success: false, msg: "Could not like the posts"}
  }
};


export const removePostLike = async (postId: number, userId: string) => {
  try {
    const { error } = await supabase
    .from("postLikes")
    .delete()
    .eq("postId", postId)
    .eq("userId", userId)
    .single()

    if (error) {
      console.log("postLike error: ", error);
      return {success: false, msg: "Could not remove the like"}
    }

    return {success: true}    

  } catch (error) {
    console.log("postLike error: ", error);
    return {success: false, msg: "Could not remove the like"}
  }
};
