// Typed boundaries around the existing validated learning engines. No duplicate solvers.
// The engines' shapes come from frontend/lib/engines.d.ts; no casts are needed here.
export {
  validateLesson,
  lessonLanguageWarnings,
} from "../../public/lesson-schema.mjs";
export {
  galleryLessons,
  gallerySourceNote,
  galleryIdFromHash,
} from "../../public/gallery-lessons.mjs";
export { createLessonPlayer } from "../../public/lesson-player.mjs";
export { chapterExperiment } from "../../public/generated-demo.mjs";
export { formatDemoNumber } from "../../public/demo-model.mjs";
export { studioWalkthrough } from "../../public/studio-showcase.mjs";
