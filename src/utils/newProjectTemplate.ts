import type { ProjectText } from '../config/projectTexts';

export function createEmptyProject(id: number): ProjectText {
  return {
    id,
    title: 'New project',
    subtitle: '',
    year: new Date().getFullYear(),
    tags: [],
    description: '',
    client: '',
    fullDescription: '',
    challenges: '',
    solutions: '',
    technologies: [],
    results: '',
    gallery: [],
    stickerColor: '#888888',
    stickerImage: '',
    challengeImages: [],
    solutionImages: [],
    resultsImages: [],
    mediaFolder: '',
  };
}
