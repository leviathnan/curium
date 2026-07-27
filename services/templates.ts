import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTemplatesService } from "@curium/shared/services/templates";

export type { Template } from "@curium/shared/services/templates";

export const { loadTemplates, saveTemplate, deleteTemplate, renameTemplate } =
  createTemplatesService(AsyncStorage);
