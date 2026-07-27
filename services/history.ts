import AsyncStorage from "@react-native-async-storage/async-storage";
import { createHistoryService } from "@curium/shared/services/history";

export type { HistoryItem } from "@curium/shared/services/history";

export const { loadHistory, saveToHistory, deleteFromHistory, clearHistory } =
  createHistoryService(AsyncStorage);
