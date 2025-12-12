import { GoogleGenAI } from "@google/genai";
import { Transaction, Debt, SavingsGoal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  debts: Debt[],
  savings: SavingsGoal[]
): Promise<string> => {
  try {
    const transactionSummary = transactions.slice(0, 50).map(t => 
      `- ${t.date}: ${t.type === 'income' ? '+' : '-'}${t.amount} (${t.category}) - ${t.description}`
    ).join('\n');

    const debtSummary = debts.filter(d => !d.isPaid).map(d =>
      `- ${d.type === 'payable' ? 'Hutang ke' : 'Piutang dari'} ${d.personName}: ${d.amount}`
    ).join('\n');

    const savingsSummary = savings.map(s =>
      `- ${s.name}: Terkumpul ${s.currentAmount} dari ${s.targetAmount}`
    ).join('\n');

    const prompt = `
      Bertindaklah sebagai penasihat keuangan pribadi yang bijak dan ramah dalam Bahasa Indonesia.
      
      Analisis data keuangan berikut (maksimal 1 bulan terakhir):
      
      TRANSAKSI TERAKHIR:
      ${transactionSummary}
      
      STATUS HUTANG/PIUTANG (Belum Lunas):
      ${debtSummary}
      
      TARGET TABUNGAN:
      ${savingsSummary}
      
      Berikan ringkasan singkat tentang kesehatan keuangan saya, dan berikan 3 saran konkret dan dapat ditindaklanjuti untuk meningkatkan kondisi keuangan saya bulan ini. Gunakan format Markdown. Jangan terlalu formal, gunakan gaya bahasa yang memotivasi.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Kamu adalah asisten keuangan pribadi yang pintar dan suportif.",
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple advice
      }
    });

    return response.text || "Maaf, saya tidak dapat menghasilkan saran saat ini.";
  } catch (error) {
    console.error("Error getting AI advice:", error);
    return "Terjadi kesalahan saat menghubungkan ke asisten AI. Pastikan API Key valid.";
  }
};