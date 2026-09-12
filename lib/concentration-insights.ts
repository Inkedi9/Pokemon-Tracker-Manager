import type { CollectionConcentration } from "@/lib/collection-concentration";

export type ConcentrationInsightLevel =
  | "positive"
  | "info"
  | "warning"
  | "danger";

export type ConcentrationInsight = {
  title: string;
  description: string;
  level: ConcentrationInsightLevel;
};

export function getConcentrationInsights(
  concentration: CollectionConcentration
): ConcentrationInsight[] {
  const insights: ConcentrationInsight[] = [];

  const top5 = concentration.top5Percentage;
  const top1 = concentration.top1Percentage;
  const top10 = concentration.top10Percentage;

  // Overall concentration
  if (top5 >= 70) {
    insights.push({
      title: "Forte concentration",
      description: `Les 5 cartes les plus valorisées représentent ${top5.toFixed(
        1
      )} % de la valeur totale de ta collection.`,
      level: "danger",
    });
  } else if (top5 >= 50) {
    insights.push({
      title: "Concentration importante",
      description: `Les 5 cartes principales représentent ${top5.toFixed(
        1
      )} % de la valeur totale.`,
      level: "warning",
    });
  } else if (top5 >= 30) {
    insights.push({
      title: "Concentration modérée",
      description: `Les 5 cartes principales représentent ${top5.toFixed(
        1
      )} % de la valeur de ta collection.`,
      level: "info",
    });
  } else {
    insights.push({
      title: "Collection diversifiée",
      description: `Les 5 cartes principales représentent seulement ${top5.toFixed(
        1
      )} % de la valeur totale.`,
      level: "positive",
    });
  }

  // Dominant card
  if (concentration.topCard) {
    const card = concentration.topCard.card;

    if (top1 >= 30) {
      insights.push({
        title: "Carte fortement dominante",
        description: `${card.name} représente à elle seule ${top1.toFixed(
          1
        )} % de la valeur de ta collection.`,
        level: "warning",
      });
    } else if (top1 >= 15) {
      insights.push({
        title: "Carte dominante",
        description: `${card.name} représente ${top1.toFixed(
          1
        )} % de la valeur totale.`,
        level: "info",
      });
    }
  }

  // Top 10 vs Top 5
  if (top10 > top5 && top5 > 0) {
    const additional = top10 - top5;

    insights.push({
      title: "Valeur répartie au-delà du Top 5",
      description: `Les cartes classées de la 6e à la 10e position ajoutent ${additional.toFixed(
        1
      )} % de valeur supplémentaire.`,
      level: "positive",
    });
  }

  // Dominant set
  if (concentration.topSet) {
    const set = concentration.topSet;

    if (set.percentage >= 50) {
      insights.push({
        title: "Extension dominante",
        description: `${set.name} représente ${set.percentage.toFixed(
          1
        )} % de la valeur totale de ta collection.`,
        level: "warning",
      });
    } else if (set.percentage >= 30) {
      insights.push({
        title: "Extension principale",
        description: `${set.name} représente ${set.percentage.toFixed(
          1
        )} % de la valeur totale.`,
        level: "info",
      });
    }
  }

  return insights;
}