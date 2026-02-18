// ── Normalization ────────────────────────────────────────────

function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?]+$/, "");
}

// ── Single answer checking ───────────────────────────────────

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  alsoAccept?: string[],
): {
  correct: boolean;
  normalizedUser: string;
  normalizedCorrect: string;
} {
  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(correctAnswer);

  if (normalizedUser === normalizedCorrect) {
    return { correct: true, normalizedUser, normalizedCorrect };
  }

  if (alsoAccept) {
    for (const alt of alsoAccept) {
      if (normalizedUser === normalize(alt)) {
        return { correct: true, normalizedUser, normalizedCorrect };
      }
    }
  }

  return { correct: false, normalizedUser, normalizedCorrect };
}

// ── Multi-part answer checking ───────────────────────────────

export function checkMultiAnswer(
  userAnswer: string,
  correctAnswer: string,
): {
  correct: boolean;
} {
  const userParts = userAnswer.split(",").map((part) => normalize(part));
  const correctParts = correctAnswer.split(",").map((part) => normalize(part));

  if (userParts.length !== correctParts.length) {
    return { correct: false };
  }

  for (let i = 0; i < correctParts.length; i++) {
    if (userParts[i] !== correctParts[i]) {
      return { correct: false };
    }
  }

  return { correct: true };
}
