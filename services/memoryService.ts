import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";
import { Memory, Conversation, ChatMessage, ChatType } from "../types";

// Cloud Function for memory extraction
const extractMemoriesFunction = httpsCallable(functions, 'extractMemoriesFromConversation');

/**
 * Save a conversation to Firestore
 */
export const saveConversation = async (
  userId: string,
  projectId: string,
  chatType: ChatType,
  messages: ChatMessage[]
): Promise<string> => {
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const conversationRef = doc(db, "users", userId, "projects", projectId, "conversations", conversationId);
  
  const conversation: Conversation = {
    id: conversationId,
    messages,
    chatType,
    createdAt: Date.now(),
    extracted: false
  };

  await setDoc(conversationRef, {
    ...conversation,
    createdAt: Timestamp.fromMillis(conversation.createdAt)
  });

  return conversationId;
};

/**
 * Extract memories from a conversation using AI
 */
export const extractMemories = async (
  userId: string,
  projectId: string,
  conversationId: string,
  structureData: any
): Promise<void> => {
  try {
    // Get the conversation
    const conversationRef = doc(db, "users", userId, "projects", projectId, "conversations", conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      console.error("Conversation not found");
      return;
    }

    const conversationData = conversationSnap.data();
    const messages = conversationData.messages || [];
    const chatType = conversationData.chatType || 'business';

    // Get existing memories to avoid duplicates
    const existingMemories = await getMemories(userId, projectId);

    // Call Firebase Function to extract memories
    console.log('Calling extractMemoriesFromConversation function with:', {
      messageCount: messages.length,
      chatType,
      structureDataExists: !!structureData,
      existingMemoriesCount: existingMemories.length
    });
    
    const result = await extractMemoriesFunction({
      messages,
      chatType,
      structureData,
      existingMemories: existingMemories.map(m => m.fact)
    });

    console.log('Memory extraction result:', result);
    const extractedFacts = (result.data as any)?.facts || [];
    console.log('Extracted facts count:', extractedFacts.length);

    if (extractedFacts.length === 0) {
      // Mark as extracted even if no facts found
      await setDoc(conversationRef, { extracted: true }, { merge: true });
      return;
    }

    // Save extracted memories
    const memoriesRef = collection(db, "users", userId, "projects", projectId, "memories");
    
    for (const fact of extractedFacts) {
      const memoryId = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const memoryRef = doc(memoriesRef, memoryId);
      
      const memory: Memory = {
        id: memoryId,
        fact: fact.fact || fact,
        category: fact.category || 'other',
        importance: fact.importance || 3,
        createdAt: Date.now(),
        sourceChat: chatType,
        tags: fact.tags || []
      };

      await setDoc(memoryRef, {
        ...memory,
        createdAt: Timestamp.fromMillis(memory.createdAt)
      });
    }

    // Mark conversation as extracted
    await setDoc(conversationRef, { extracted: true }, { merge: true });
  } catch (error: any) {
    console.error("Error extracting memories:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      stack: error?.stack
    });
    // Don't throw - memory extraction failures shouldn't block the app
  }
};

/**
 * Get all memories for a project
 */
export const getMemories = async (userId: string, projectId: string): Promise<Memory[]> => {
  try {
    const memoriesRef = collection(db, "users", userId, "projects", projectId, "memories");
    const memoriesSnap = await getDocs(memoriesRef);
    
    return memoriesSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fact: data.fact,
        category: data.category || 'other',
        importance: data.importance || 3,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        sourceChat: data.sourceChat || 'business',
        tags: data.tags || []
      } as Memory;
    });
  } catch (error) {
    console.error("Error getting memories:", error);
    return [];
  }
};

/**
 * Get formatted memory context for system instructions
 * Returns top 5-7 most relevant high-importance memories sorted by importance and recency
 */
export const getMemoryContext = async (userId: string, projectId: string): Promise<string> => {
  try {
    const memories = await getMemories(userId, projectId);
    
    if (memories.length === 0) {
      return "";
    }

    // Filter to only high-importance memories (4-5)
    const highImportanceMemories = memories.filter(m => m.importance >= 4);

    if (highImportanceMemories.length === 0) {
      return "";
    }

    // Sort by importance (descending) and recency (descending)
    const sortedMemories = highImportanceMemories.sort((a, b) => {
      const importanceDiff = b.importance - a.importance;
      if (importanceDiff !== 0) return importanceDiff;
      return b.createdAt - a.createdAt;
    });

    // Take top 5-7 memories (fewer to avoid overwhelming context)
    const topMemories = sortedMemories.slice(0, 7);

    if (topMemories.length === 0) {
      return "";
    }

    // Format as readable context
    const memoryList = topMemories.map(m => `- ${m.fact}`).join('\n');

    return `\n\nPrevious discussions revealed the following critical facts about this structure:\n${memoryList}`;
  } catch (error) {
    console.error("Error getting memory context:", error);
    return "";
  }
};

/**
 * Delete a memory
 */
export const deleteMemory = async (userId: string, projectId: string, memoryId: string): Promise<void> => {
  try {
    const memoryRef = doc(db, "users", userId, "projects", projectId, "memories", memoryId);
    await deleteDoc(memoryRef);
  } catch (error) {
    console.error("Error deleting memory:", error);
    throw error;
  }
};
