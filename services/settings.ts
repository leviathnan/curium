import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSettingsService } from "@curium/shared/services/settings";

export type { AppSettings } from "@curium/shared/services/settings";

export const { loadSettings, saveSettings } = createSettingsService(AsyncStorage);
