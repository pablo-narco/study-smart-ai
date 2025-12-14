import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Subject {
  name: string;
  deadline: string;
  priority?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subjects } = await req.json() as { subjects: Subject[] };
    
    console.log("Received subjects:", subjects);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const today = new Date().toLocaleDateString('ru-RU', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const subjectsList = subjects.map(s => {
      const deadline = new Date(s.deadline);
      const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return `- ${s.name}: дедлайн ${deadline.toLocaleDateString('ru-RU')}, осталось ${daysLeft} дней, приоритет: ${s.priority || 'medium'}`;
    }).join('\n');

    const prompt = `Ты опытный репетитор и планировщик учебы. Сегодня ${today}.

У студента следующие предметы и дедлайны:
${subjectsList}

Создай подробный персональный учебный план. Ответ должен включать:

1. **ЧТО УЧИТЬ СЕГОДНЯ** - конкретные задачи на сегодня (2-3 пункта)
2. **НЕДЕЛЬНЫЙ ПЛАН** - распределение предметов по дням недели
3. **СОВЕТЫ** - краткие рекомендации по эффективной подготовке

Формат ответа: используй markdown с эмодзи для наглядности. Будь конкретным и практичным.`;

    console.log("Sending request to Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Ты дружелюбный помощник для студентов. Отвечай на русском языке." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Слишком много запросов. Подождите немного." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Превышен лимит использования AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");
    
    const studyPlan = data.choices?.[0]?.message?.content || "Не удалось создать план";

    return new Response(JSON.stringify({ studyPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in generate-study-plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
