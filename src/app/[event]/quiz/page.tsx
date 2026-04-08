import { notFound } from "next/navigation";
import { EVENTS } from "@/config/events";
import QuizSlideshow from "@/components/quiz/QuizSlideshow";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ event: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event: slug } = await params;
  const event = EVENTS[slug];
  if (!event?.quiz) return {};
  return { title: `${event.quiz.title} — ${event.name}` };
}

export default async function QuizPage({ params }: Props) {
  const { event: slug } = await params;
  const event = EVENTS[slug];

  if (!event?.quiz) notFound();

  return <QuizSlideshow quiz={event.quiz} eventSlug={slug} />;
}
