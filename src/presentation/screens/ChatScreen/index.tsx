import React, { useCallback } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { getChatStyles } from "./styles";
import CText from "../../components/atoms/CText";
import CInput from "../../components/atoms/CInput";
import CIconButton from "../../components/atoms/CIconButton";
import Header from "../../components/molecules/Header";
import useChatLogics from "./hooks/useChatLogics";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage, } from "./types";
import ChatItem from "./ChatItem";
import { ConversationDrawer } from "./ConversationDrawer";

export const ChatScreen = () => {
  const { theme } = useTheme();
  const styles = getChatStyles(theme.colors);

  const {
    messages,
    inputText,
    setInputText,
    handleSend,
    flatListRef,
    activeAssistantMessageId,
    isStreaming,
    onContentSizeChange,
    onListScroll,
    isThinking,
    isBusy,
    handleStop,
    handleRetry,
    isLoading,
    loadError,
    retryLoad,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    conversations,
    isFetchingConversations,
    switchConversation,
    conversationId
  } = useChatLogics({});

  const renderListFooter = useCallback(() => {
    return isThinking ? (
      <View style={styles.thinkingContainer}>
        <CText variant="subheading">Thinking...</CText>
      </View>
    ) : null;
  }, [isThinking, styles.thinkingContainer]);

  const renderEmptyState = useCallback(() => {
    return (
      <View style={styles.emptyStateContainer}>
        <CIconButton
          iconName="chatbubbles-outline"
          variant="ghost"
          size={64}
          iconColor="textSecondary"
          disabled
        />
        <CText variant="heading" style={styles.emptyStateTitle}>Welcome!</CText>
        <CText variant="body" color="textSecondary" style={styles.emptyStateSubtitle}>
          Start typing below to kick off your conversation with the AI.
        </CText>
      </View>
    );
  }, [styles]);

  const renderItem = useCallback(({ item, index }: { item: ChatMessage, index: number }) => {
    return (
      <ChatItem 
        {...item} 
        isStreaming={isStreaming} 
        activeAssistantMessageId={activeAssistantMessageId} 
        onRetry={handleRetry} 
        isLastMessage={index === messages.length - 1}
      />
    );
  }, [isStreaming, activeAssistantMessageId, handleRetry, messages.length]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <CText variant="body" style={styles.loadingText}>
          Taking you into the AI world...
        </CText>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <CText variant='body' color="error" style={styles.loadingText}>
          {loadError}
        </CText>
        <TouchableOpacity onPress={retryLoad} style={styles.retryBtn}>
          <CText color="primary">Retry</CText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon="menu"
        onLeftPress={openDrawer}
        hasUpgrade
        rightIcons={["person-circle-outline", "share-outline"]}
      />

      <ConversationDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        styles={styles}
      />

      {/* Chat List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[styles.chatList, messages.length === 0 && { flexGrow: 1 }]}
        onContentSizeChange={onContentSizeChange}
        //onScroll={onListScroll}
        onScrollBeginDrag={onListScroll}
        onScrollEndDrag={onListScroll}
      />

      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        style={styles.inputBarContainer}
      >
        <View style={styles.inputRow}>
          <CIconButton iconName="add" variant="ghost" size={24} />

          <View style={styles.pillContainer}>
            <CInput
              placeholder="Message"
              value={inputText}
              onChangeText={setInputText}
              containerStyle={styles.input}
              inputWrapperStyle={styles.inputWrapper}
              editable={!isBusy}
            />
            {isBusy ? (
              <CIconButton
                iconName="stop"
                variant="ghost"
                iconColor="textPrimary"
                size={24}
                onPress={handleStop}
                style={{ padding: 4 }}
              />
            ) : (
              <CIconButton
                iconName="arrow-up"
                variant={inputText.trim() === "" ? "ghost" : "primary"}
                iconColor={inputText.trim() === "" ? "textSecondary" : "textPrimary"}
                size={24}
                onPress={handleSend}
                disabled={inputText.trim() === ""}
                style={{ padding: 4 }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
