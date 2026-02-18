"use client";

import Card from "@/components/ui/Card";

interface ConjugationTableProps {
  conjugation: Record<string, string>;
  tip: string;
}

const PRONOUN_ORDER = ["I", "you", "he/she/it", "we", "they"];

export default function ConjugationTable({
  conjugation,
  tip,
}: ConjugationTableProps) {
  const thirdPersonValue = conjugation["he/she/it"];
  const baseValue = conjugation["I"];
  const thirdPersonDiffers =
    thirdPersonValue !== undefined &&
    baseValue !== undefined &&
    thirdPersonValue !== baseValue;

  return (
    <div className="space-y-3">
      <Card>
        <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[280px]">
          <thead>
            <tr className="border-b border-primary-100">
              <th className="pb-2 text-left text-caption font-semibold text-text-secondary uppercase tracking-wide">
                Pronoun
              </th>
              <th className="pb-2 text-left text-caption font-semibold text-text-secondary uppercase tracking-wide">
                Conjugation
              </th>
            </tr>
          </thead>
          <tbody>
            {PRONOUN_ORDER.map((pronoun) => {
              const value = conjugation[pronoun];
              if (!value) return null;

              const isHighlighted =
                pronoun === "he/she/it" && thirdPersonDiffers;

              return (
                <tr
                  key={pronoun}
                  className="border-b border-primary-50 last:border-b-0"
                >
                  <td className="py-2.5 text-body text-text-primary font-medium">
                    {pronoun}
                  </td>
                  <td
                    className={`py-2.5 text-body ${
                      isHighlighted
                        ? "font-bold text-accent-600"
                        : "text-text-primary"
                    }`}
                  >
                    {value}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </Card>

      <Card className="bg-surface-muted">
        <p className="text-caption text-text-secondary leading-relaxed">
          {tip}
        </p>
      </Card>
    </div>
  );
}
