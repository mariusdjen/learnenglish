import type { VerbData } from "@/types/verb";

import beData from "@/data/verbs/be.json";
import haveData from "@/data/verbs/have.json";
import doData from "@/data/verbs/do.json";
import goData from "@/data/verbs/go.json";
import getData from "@/data/verbs/get.json";
import makeData from "@/data/verbs/make.json";
import sayData from "@/data/verbs/say.json";
import knowData from "@/data/verbs/know.json";
import takeData from "@/data/verbs/take.json";
import comeData from "@/data/verbs/come.json";
import seeData from "@/data/verbs/see.json";
import wantData from "@/data/verbs/want.json";
import giveData from "@/data/verbs/give.json";
import thinkData from "@/data/verbs/think.json";
import lookData from "@/data/verbs/look.json";
import likeData from "@/data/verbs/like.json";
import workData from "@/data/verbs/work.json";
import canData from "@/data/verbs/can.json";
import needData from "@/data/verbs/need.json";
import putData from "@/data/verbs/put.json";

const ALL_VERBS: Record<string, VerbData> = {
  be: beData as unknown as VerbData,
  have: haveData as unknown as VerbData,
  do: doData as unknown as VerbData,
  go: goData as unknown as VerbData,
  get: getData as unknown as VerbData,
  make: makeData as unknown as VerbData,
  say: sayData as unknown as VerbData,
  know: knowData as unknown as VerbData,
  take: takeData as unknown as VerbData,
  come: comeData as unknown as VerbData,
  see: seeData as unknown as VerbData,
  want: wantData as unknown as VerbData,
  give: giveData as unknown as VerbData,
  think: thinkData as unknown as VerbData,
  look: lookData as unknown as VerbData,
  like: likeData as unknown as VerbData,
  work: workData as unknown as VerbData,
  can: canData as unknown as VerbData,
  need: needData as unknown as VerbData,
  put: putData as unknown as VerbData,
};

export const VERB_ORDER = [
  "be", "have", "do", "go", "get", "make", "say", "know", "take", "come",
  "see", "want", "give", "think", "look", "like", "work", "can", "need", "put",
] as const;

export function getVerb(id: string): VerbData | undefined {
  return ALL_VERBS[id];
}

export function getVerbList(): VerbData[] {
  return VERB_ORDER.map((id) => ALL_VERBS[id]);
}

export function getNextVerbId(currentId: string): string | null {
  const idx = VERB_ORDER.indexOf(currentId as typeof VERB_ORDER[number]);
  if (idx === -1 || idx === VERB_ORDER.length - 1) return null;
  return VERB_ORDER[idx + 1];
}

export function getPreviousVerbId(currentId: string): string | null {
  const idx = VERB_ORDER.indexOf(currentId as typeof VERB_ORDER[number]);
  if (idx <= 0) return null;
  return VERB_ORDER[idx - 1];
}
