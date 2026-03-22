import AsyncStorage from "@react-native-async-storage/async-storage";

import type { QuizStatus } from "@/types/view-models";

const QUIZ_PROGRESS_STORAGE_PREFIX = "@updin:quiz-progress";

export interface QuizProgressSnapshot {
  quizId: string;
  status: QuizStatus;
  respostas: Record<string, string>;
  respondidas: number;
  totalPerguntas: number;
  tentativaId?: string;
  pontuacao?: number;
  acertos?: number;
  finalizadoEm?: string;
  atualizadoEm: string;
}

type QuizProgressMap = Record<string, QuizProgressSnapshot>;

function getStorageKey(adolescenteId: string) {
  return `${QUIZ_PROGRESS_STORAGE_PREFIX}:${adolescenteId}`;
}

async function persistQuizProgressMap(
  adolescenteId: string,
  progressMap: QuizProgressMap,
) {
  await AsyncStorage.setItem(
    getStorageKey(adolescenteId),
    JSON.stringify(progressMap),
  );
}

export async function loadQuizProgressMap(
  adolescenteId?: string | null,
): Promise<QuizProgressMap> {
  if (!adolescenteId) {
    return {};
  }

  const rawValue = await AsyncStorage.getItem(getStorageKey(adolescenteId));

  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as QuizProgressMap;
  } catch {
    await AsyncStorage.removeItem(getStorageKey(adolescenteId));
    return {};
  }
}

export async function loadQuizProgress(params: {
  adolescenteId?: string | null;
  quizId?: string | null;
}) {
  const { adolescenteId, quizId } = params;

  if (!adolescenteId || !quizId) {
    return null;
  }

  const progressMap = await loadQuizProgressMap(adolescenteId);

  return progressMap[quizId] ?? null;
}

export async function saveQuizDraft(params: {
  adolescenteId: string;
  quizId: string;
  respostas: Record<string, string>;
  totalPerguntas: number;
}) {
  const { adolescenteId, quizId, respostas, totalPerguntas } = params;
  const respondidas = Object.keys(respostas).length;

  if (!respondidas) {
    return;
  }

  const progressMap = await loadQuizProgressMap(adolescenteId);
  const previousProgress = progressMap[quizId];

  progressMap[quizId] = {
    quizId,
    status: "em_progresso",
    respostas,
    respondidas,
    totalPerguntas,
    atualizadoEm: new Date().toISOString(),
    tentativaId: previousProgress?.tentativaId,
    pontuacao: previousProgress?.pontuacao,
    acertos: previousProgress?.acertos,
    finalizadoEm: previousProgress?.finalizadoEm,
  };

  await persistQuizProgressMap(adolescenteId, progressMap);
}

export async function markQuizAsCompleted(params: {
  adolescenteId: string;
  quizId: string;
  respostas: Record<string, string>;
  tentativaId: string;
  pontuacao: number;
  acertos: number;
  totalPerguntas: number;
  finalizadoEm: string;
}) {
  const {
    adolescenteId,
    quizId,
    respostas,
    tentativaId,
    pontuacao,
    acertos,
    totalPerguntas,
    finalizadoEm,
  } = params;

  const progressMap = await loadQuizProgressMap(adolescenteId);

  progressMap[quizId] = {
    quizId,
    status: "concluido",
    respostas,
    respondidas: totalPerguntas,
    totalPerguntas,
    tentativaId,
    pontuacao,
    acertos,
    finalizadoEm,
    atualizadoEm: new Date().toISOString(),
  };

  await persistQuizProgressMap(adolescenteId, progressMap);
}
