// Typed boundaries around the existing validated learning engines. No duplicate solvers.
import {
  validateLesson as validate,
  lessonLanguageWarnings,
} from "../../public/lesson-schema.mjs";
import {
  galleryLessons as catalog,
  gallerySourceNote,
  galleryIdFromHash,
} from "../../public/gallery-lessons.mjs";
import { createLessonPlayer as create } from "../../public/lesson-player.mjs";
import { chapterExperiment as chapter } from "../../public/generated-demo.mjs";
import type {
  Lesson,
  Player,
  GalleryItem,
  Chapter,
  Experiment,
  Language,
} from "./types";
export const validateLesson = validate as (input: unknown) => Lesson;
export const createLessonPlayer = create as unknown as (
  lesson: Lesson,
) => Player;
export const chapterExperiment = chapter as unknown as (
  chapter: Chapter,
  variant?: number,
  language?: Language,
  controls?: Record<string, number>,
  metric?: number,
) => Experiment;
export const galleryLessons = catalog as GalleryItem[];
export { lessonLanguageWarnings, gallerySourceNote, galleryIdFromHash };
export { formatDemoNumber } from "../../public/demo-model.mjs";
export { studioWalkthrough } from "../../public/studio-showcase.mjs";
