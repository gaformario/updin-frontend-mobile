import { api } from "@/services/api-client";
import {
  buildPublicQuizzesResumo,
  mapPublicQuizResumo,
  mapQuizTentativaResumo,
} from "@/services/mappers";
import type {
  CreateQuizRequest,
  CreateQuizTentativaRequest,
  PublicQuizzesResponse,
  QuizResponse,
  QuizTentativaResponse,
} from "@/types/api";

export async function criarQuiz(payload: CreateQuizRequest) {
  return api.post<QuizResponse>("/quizzes", payload);
}

export async function listarQuizzesPublicos() {
  const quizzes = await api.get<PublicQuizzesResponse>("/quizzes");

  return quizzes
    .filter((quiz) => quiz.ativo !== false)
    .sort((left, right) => left.titulo.localeCompare(right.titulo, "pt-BR"));
}

export async function buscarQuizPublicoPorId(quizId: string) {
  return api.get<QuizResponse>(`/quizzes/${quizId}`);
}

export async function listarQuizzesDoCatalogoPublico() {
  const quizzes = await listarQuizzesPublicos();

  return quizzes.map(mapPublicQuizResumo);
}

export async function buscarResumoDoCatalogoPublico() {
  return buildPublicQuizzesResumo();
}

export async function enviarTentativaQuiz(params: {
  quizId: string;
  adolescenteId: string;
  respostas: CreateQuizTentativaRequest["respostas"];
}) {
  const { quizId, adolescenteId, respostas } = params;

  return api.post<QuizTentativaResponse>(
    `/quizzes/${quizId}/tentativas/adolescentes/${adolescenteId}`,
    { respostas } satisfies CreateQuizTentativaRequest,
  );
}

export async function buscarTentativaQuiz(tentativaId: string) {
  return api.get<QuizTentativaResponse>(`/quizzes/tentativas/${tentativaId}`);
}

export async function buscarResumoTentativaQuiz(tentativaId: string) {
  const tentativa = await buscarTentativaQuiz(tentativaId);

  return mapQuizTentativaResumo(tentativa);
}
