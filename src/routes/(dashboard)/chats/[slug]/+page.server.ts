import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) {
    return fail(401, { error: 'Unauthorized' });
  }

  const chatId = params.slug;

  // Fetch the chat
  const { data: chat, error: chatError } = await locals.supabase
    .from('chats')
    .select('id, title, medical_context_id, created_at, updated_at')
    .eq('id', chatId)
    .eq('user_id', user.id)
    .single();

  if (chatError || !chat) {
    return fail(404, { error: 'Chat not found' });
  }

  // Fetch medical context if available
  let medicalContext = null;
  if (chat.medical_context_id) {
    const { data: context, error: contextError } = await locals.supabase
      .from('user_medical_data')
      .select('id, full_name, medical_history, allergies, medications')
      .eq('id', chat.medical_context_id)
      .eq('user_id', user.id)
      .single();
    
    if (!contextError && context) {
      medicalContext = context;
    }
  }

  // Fetch messages for this chat
  const { data: messages, error: messagesError } = await locals.supabase
    .from('messages')
    .select('id, content, responses, sender_id, created_at')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('Error fetching messages:', messagesError);
    return { chat, messages: [], user, medicalContext };
  }

  return { 
    chat, 
    messages: messages || [], 
    user,
    medicalContext
  };
};

export const actions: Actions = {
  createMessage: async ({ request, locals, params }) => {
    const user = locals.user;
    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const content = formData.get('content') as string;
    const chatId = params.slug;

    if (!content || content.trim().length === 0) {
      return fail(400, { error: 'Message content is required' });
    }

    // Verify user owns the chat
    const { data: chat, error: chatError } = await locals.supabase
      .from('chats')
      .select('id, title, medical_context_id')
      .eq('id', chatId)
      .eq('user_id', user.id)
      .single();

    if (chatError || !chat) {
      return fail(403, { error: 'Chat not found or access denied' });
    }

    // Create user message
    const { data: userMessage, error: userMessageError } = await locals.supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content: content.trim()
      })
      .select()
      .single();

    if (userMessageError) {
      console.error('Error creating user message:', userMessageError);
      return fail(500, { error: 'Failed to create message' });
    }

    // Update chat's updated_at timestamp
    await locals.supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId);

    // Call the local Python agent backend and await response
    try {
      console.log('Calling agent backend with:', {
        chat_id: chatId,
        sender_id: user.id,
        message: content.trim(),
        user_message_id: userMessage.id
      });

      const agentResponse = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          sender_id: user.id,
          message: content.trim(),
          user_message_id: userMessage.id
        })
      });

      if (!agentResponse.ok) {
        const errorText = await agentResponse.text();
        console.error('Agent backend error:', errorText);
        // Return success with user message but indicate agent failed
        return {
          type: 'success',
          data: {
            message: userMessage,
            warning: 'Agent response failed, but your message was saved'
          }
        };
      }

      // Parse the agent's reply
      const agentData = await agentResponse.json();
      console.log('Agent response:', agentData);

      // Return both the user message and agent reply
      return {
        type: 'success',
        data: {
          message: userMessage,
          agentReply: agentData.reply // This matches your Python backend's ChatResponse model
        }
      };

    } catch (error) {
      console.error('Error calling agent backend:', error);
      // Return success with user message but indicate agent failed
      return {
        type: 'success',
        data: {
          message: userMessage,
          warning: 'Agent response failed, but your message was saved'
        }
      };
    }
  }
};

// Healthcare-focused AI response generation
async function generateHealthcareAIResponse(userMessage: string, chatTitle: string, medicalContext: any): Promise<string> {
  const message = userMessage.toLowerCase();
  
  // Medical disclaimer
  const disclaimer = "\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.";
  
  // Context-aware responses based on message content
  if (message.includes('headache') && message.includes('fever')) {
    return `I understand you're experiencing a headache and fever. These symptoms can have various causes, from common colds to more serious conditions.

**Immediate steps you can take:**
• Rest in a cool, quiet room
• Stay hydrated with water or clear fluids
• Take acetaminophen or ibuprofen for fever/pain (if you're not allergic)
• Monitor your temperature

**When to seek immediate medical attention:**
• Temperature above 103°F (39.4°C)
• Severe headache with neck stiffness
• Confusion or difficulty thinking
• Rash that doesn't fade when pressed

**Questions to help assess severity:**
• How long have you had these symptoms?
• Are there any other symptoms (nausea, sensitivity to light)?
• Have you had any recent injuries or exposure to illness?

${disclaimer}`;
  }
  
  if (message.includes('medication') || message.includes('side effect')) {
    return `I can help you understand medication information, but I'll need more specific details to provide accurate guidance.

**What I can help with:**
• General information about common medications
• Typical side effects and what to watch for
• Drug interactions to be aware of
• When to contact your doctor

**What I need to know:**
• What medication are you asking about?
• Are you currently taking it or considering it?
• What specific concerns do you have?

**Important reminders:**
• Always follow your doctor's instructions
• Don't stop medications without consulting your healthcare provider
• Report any concerning side effects immediately

${disclaimer}`;
  }
  
  if (message.includes('lab result') || message.includes('blood test')) {
    return `I can help you understand lab results, but I'll need to see the actual values and reference ranges to provide meaningful interpretation.

**What I can help with:**
• Explaining what different lab tests measure
• General information about normal ranges
• Common reasons for abnormal results
• Questions to ask your doctor

**What I need:**
• The specific test name and your results
• Reference ranges (normal values)
• Any symptoms you're experiencing

**Remember:**
• Lab results should always be interpreted by your healthcare provider
• Results can vary based on many factors
• One abnormal result doesn't always indicate a problem

${disclaimer}`;
  }
  
  if (message.includes('lifestyle') || message.includes('health')) {
    return `Great question! Lifestyle changes can have a significant impact on your health. Here are some evidence-based recommendations:

**General Health Tips:**
• **Nutrition**: Focus on whole foods, plenty of vegetables, lean proteins
• **Exercise**: Aim for 150 minutes of moderate activity weekly
• **Sleep**: 7-9 hours of quality sleep per night
• **Stress Management**: Practice mindfulness, meditation, or deep breathing
• **Hydration**: Drink adequate water throughout the day

**Specific areas to consider:**
• What aspect of your health are you most interested in improving?
• Do you have any specific health goals?
• Are there any current health challenges you're facing?

**Getting Started:**
• Start with small, sustainable changes
• Track your progress
• Celebrate small wins
• Don't hesitate to ask for professional guidance

${disclaimer}`;
  }
  
  // Default healthcare response
  const responses = [
    "I understand your health concern. Let me help you with that.",
    "That's an important health question. Here's what I can tell you about that.",
    "I'd be happy to help you with your health inquiry. Let me provide some information.",
    "Thank you for sharing that health concern with me. I can help you understand this better.",
    "I see what you're asking about regarding your health. Let me give you a comprehensive answer."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)] + 
    " This is a placeholder response. In a real implementation, you would integrate with an AI service like OpenAI or Claude to generate contextual, helpful responses based on the user's message and any medical context available." + disclaimer;
}

async function generateHealthcareChatTitle(firstMessage: string): Promise<string> {
  const message = firstMessage.toLowerCase();
  
  if (message.includes('headache') || message.includes('fever')) {
    return 'Headache & Fever Consultation';
  }
  if (message.includes('medication')) {
    return 'Medication Questions';
  }
  if (message.includes('lab') || message.includes('blood')) {
    return 'Lab Results Discussion';
  }
  if (message.includes('lifestyle') || message.includes('health')) {
    return 'Lifestyle & Wellness';
  }
  if (message.includes('symptom')) {
    return 'Symptom Assessment';
  }
  
  // Extract key words from the first message to create a meaningful title
  const words = firstMessage.toLowerCase().split(' ').slice(0, 5);
  const title = words.join(' ').replace(/[^\w\s]/g, '');
  return title.charAt(0).toUpperCase() + title.slice(1) || 'Health Consultation';
} 