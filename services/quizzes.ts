import { listarQuizzesDoAdolescente } from "@/services/adolescente";
import { buildQuizzesResumo, mapQuizResumo } from "@/services/mappers";

export async function listarQuizzesParaAdolescente(adolescenteId: string) {
  const quizzes = await listarQuizzesDoAdolescente(adolescenteId);

  return quizzes.map(mapQuizResumo);
}

export async function buscarResumoQuizzesDoAdolescente(adolescenteId: string) {
  const quizzes = await listarQuizzesDoAdolescente(adolescenteId);

  return buildQuizzesResumo(quizzes);
}
