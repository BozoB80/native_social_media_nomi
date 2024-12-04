import { theme } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";

type TexextEditorProps = {
  editorRef: any;
  onChange: (body: string) => void;
};

const TextEditor = ({ editorRef, onChange }: TexextEditorProps) => {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        editor={editorRef}
        disabled={false}
        iconMap={{
          [actions.heading1]: ({ tintColor }: any) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }: any) => (
            <Text style={{ color: tintColor }}>H4</Text>
          ),
        }}
        actions={[
          actions.heading1,
          actions.heading4,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.insertBulletsList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.code,
          actions.line,
          actions.undo,
          actions.redo,
        ]}
        selectedIconTint={theme.colors.primaryDark}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder="What's on your mind"
        onChange={onChange}
      />
    </View>
  );
};

export default TextEditor;

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomRightRadius: theme.radius.xl,
    borderBottomLeftRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },
  contentStyle: {
    color: theme.colors.textDark,
  },
});
