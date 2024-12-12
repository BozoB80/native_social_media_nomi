import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import { PostWithUserAndPostLikes } from "@/helpers/types";
import Loading from "@/components/Loading";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";

var limit = 0

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithUserAndPostLikes[]>([])
  const [hasMore, setHasMore] = useState(true)

  const handlePostEvent = async (payload: any) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new }
      let res = await getUserData(newPost.userId)
      newPost.user = res.success ? res.data : {}
      setPosts(prevPosts => [newPost, ...prevPosts])
    }
  }

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on("postgres_changes", {
        event: '*',
        schema: 'public',
        table: 'posts',
      }, handlePostEvent)
      .subscribe()

    return () => { supabase.removeChannel(postChannel) }
  }, [])


  const getPosts = async () => {
    if (!hasMore) return null
    limit += 2

    let res = await fetchPosts(limit)

    if (res.success) {
      if (posts.length == res.data?.length) setHasMore(false)
      setPosts(res.data ?? [])
    }
  }

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("/notifications")}>
              <Icon name="heart" size={hp(3.2)} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon name="plus" size={hp(3.2)} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{
                  borderWidth: 2,
                }}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <PostCard item={item} currentUser={user} router={router} />}
          onEndReached={() => {
            getPosts()
          }}
          ListFooterComponent={hasMore ? (
            <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text style={styles.noPosts}>No more posts</Text>
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    width: hp(4.3),
    height: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    backgroundColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.roseLight,
    borderRadius: 20
  },
})
