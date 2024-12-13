import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { PostWithUserAndPostLikes, Tables } from '../helpers/types';
import { Router } from 'expo-router';
import { hp, stripHtmlTags, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import Avatar from './Avatar';
import moment from "moment"
import Icon from '@/assets/icons';
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image';
import { downloadFile, getSupabaseFileUrl } from '@/services/imageService';
import { ResizeMode, Video } from 'expo-av';
import { createPostLike, removePostLike } from '@/services/postService';
import { useEffect, useState } from 'react';
import Loading from './Loading';

const textStyles = {
  color: theme.colors.dark,
  fontSize: hp(1.75)
}
const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
}

type PostCardProps = {
  item: PostWithUserAndPostLikes
  currentUser: any
  router: Router
  hasShadow?: boolean
  showMoreIcon?: boolean
}

const PostCard = ({ item, currentUser, router, hasShadow = true, showMoreIcon = true }: PostCardProps) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1
  }

  const createdAt = moment(item?.created_at).format("MMM D YYYY")
  const [likes, setLikes] = useState<Partial<Tables<"postLikes">>[]>([])
  const [loading, setLoading] = useState(false)
  const liked = likes.filter(like => like?.userId === currentUser?.id)[0] ? true : false

  useEffect(() => {
    setLikes(item.postLikes)
  }, [])


  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({
      pathname: "/postDetails",
      params: {
        postId: item?.id
      }
    })
  }

  const onLike = async () => {
    if (liked) {
      // remove like
      let updatedLikes = likes.filter(like => like.userId != currentUser?.id)
      setLikes([...updatedLikes])
      let res = await removePostLike(item?.id, currentUser?.id)
      console.log("removed like: ", res);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong")
      }
    } else {
      // create like
      let data = {
        userId: currentUser?.id,
        postId: item?.id
      }
      setLikes([...likes, data])
      let res = await createPostLike(data)
      console.log("added like: ", res);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong")
      }
    }
  }

  const onShare = async () => {
    let content: { message: string; url?: string } = {
      message: stripHtmlTags(item?.body ?? "")
    };
    if (item?.file) {
      // download the file and then share uri
      setLoading(true)
      const fileUrl = getSupabaseFileUrl(item?.file);
      if (fileUrl) {
        let url = await downloadFile(fileUrl);
        setLoading(false)
        if (url) {
          content.url = url;
        }
      }
    }
    Share.share(content)
  }

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar size={hp(4.5)} uri={item?.user?.image} rounded={theme.radius.md} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
          {item.body && <RenderHtml contentWidth={wp(100)} source={{ html: item.body }} tagsStyles={tagsStyles} />}
        </View>
        {item?.file && item?.file.includes("postImages") && (
          <Image source={getSupabaseFileUrl(item?.file)} transition={100} style={styles.postMedia} contentFit='cover' />
        )}
        {item?.file && item?.file.includes("postVideos") && (
          <Video source={{ uri: getSupabaseFileUrl(item?.file) || '' }} useNativeControls resizeMode={ResizeMode.COVER} isLooping style={[styles.postMedia, { height: hp(40) }]} />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon name="heart" size={24} fill={liked ? theme.colors.rose : "transparent"} color={liked ? theme.colors.rose : theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments[0]?.count}</Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? <Loading size="small" /> : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medlum,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medlum,
  },
  content: {
    gap: 10
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18
  },
  count: {
    fontSize: hp(1.8),
    color: theme.colors.text,
  }
})