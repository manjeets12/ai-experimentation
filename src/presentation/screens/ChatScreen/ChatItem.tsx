import { View, TouchableOpacity } from "react-native";
import { ChatMessage } from "./types";
import CText from "@/presentation/components/atoms/CText";
import { makeStyles } from "@/theme/helper";
import { sizes } from "@/theme/tokens/sizes";
import { memo } from 'react'

/**
 * We can create one map of multiple component 
 * to render different type of components at runtime
 * @param param0 
 * @returns 
 */
const ChatItem = ({ role, id, text, status, isStreaming, activeAssistantMessageId, onRetry, isLastMessage }: ChatMessage & { isStreaming: boolean, activeAssistantMessageId: string | null, onRetry?: (id: string) => void, isLastMessage?: boolean }) => {
    const isUser = role === "user";
    const isCancelled = status === "cancelled";
    const isFailed = status === "failed";
    const { styles } = useStyles({ isUser, status });
    const showCursor =
        !isUser &&
        id === activeAssistantMessageId &&
        isStreaming;


    return (
        <View
            style={styles.messageContainer}
        >
            <View style={isUser ? styles.userMessage : styles.assistantMessage}>
                <CText color={isUser ? "background" : "textPrimary"}>
                    {text}
                    {showCursor ? " ▍" : ""}
                </CText>
                {(isCancelled || isFailed) && !isUser && (
                    <View style={styles.cancelledContainer}>
                        <CText variant="caption" color="error">
                            {isCancelled ? "Cancelled by user." : "Message failed."}
                        </CText>
                        {onRetry && isLastMessage && (
                            <TouchableOpacity onPress={() => onRetry(id)} style={styles.retryButton}>
                                <CText variant="caption" color="primary">Retry</CText>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}


const useStyles = makeStyles((theme, { isUser, status }: { isUser: boolean, status?: string }) => ({
    messageContainer: {
        maxWidth: "85%",
        alignSelf: isUser ? "flex-end" : "flex-start",
        opacity: (status === "cancelled" || status === "failed") && !isUser ? 0.7 : 1,
    },
    userMessage: {
        backgroundColor: theme.colors.primary,
        borderRadius: 18,
        paddingHorizontal: sizes.spacing.md,
        paddingVertical: sizes.spacing.sm,
    },
    assistantMessage: {
        alignSelf: "flex-start",
        backgroundColor: "transparent",
        paddingHorizontal: sizes.spacing.xs,
    },
    cancelledContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: sizes.spacing.xs,
        gap: sizes.spacing.sm,
    },
    retryButton: {
        padding: sizes.spacing.xs,
    }
}));

export default memo(ChatItem);