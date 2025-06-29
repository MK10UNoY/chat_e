<script lang="ts">
  import {tick, onMount, onDestroy} from 'svelte';
  import { Button } from '$lib/shadcn/components/ui/button';
  import { Input } from '$lib/shadcn/components/ui/input';
  import { Card, CardContent } from '$lib/shadcn/components/ui/card';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/shadcn/components/ui/avatar';
  import SendIcon from '@lucide/svelte/icons/send';
  import UserIcon from '@lucide/svelte/icons/user';
  import StethoscopeIcon from '@lucide/svelte/icons/stethoscope';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  
  export let data: { 
    chat: { id: string; title: string; medical_context_id?: string };
    messages: Array<{ id: string; content: string; responses?: string | null; sender_id: string; created_at: string }>;
    user: { id: string; email: string };
    medicalContext?: { full_name: string; medical_history?: any };
  };
  
  let messageInput = '';
  let isTyping = false;
  let messagesEnd: HTMLElement;
  let isSubmitting = false;
  let localMessages = data.messages;
  let subscription: any;
  
  // Auto-scroll to bottom when messages change or typing state changes
  $: if (localMessages || isTyping) {
    tick().then(() => {
      if (messagesEnd) {
        messagesEnd.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Random typing duration between 1-2 seconds
  function getTypingDuration() {
    return Math.floor(1000 + Math.random() * 1000);
  }
  
  function handleEnhance() {
    isSubmitting = true;
    const optimisticId = `local-${Date.now()}`;
    const optimisticMessage = {
      id: optimisticId,
      content: messageInput,
      responses: null,
      sender_id: data.user.id,
      created_at: new Date().toISOString()
    };
    localMessages = [...localMessages, optimisticMessage];
    return async ({ result }: { result: any }) => {
      try {
        if (result.type === 'success') {
          messageInput = '';
          // No need to add message here, already added optimistically
        }
        // If agent reply is missing, fallback to fetching from DB
        if (!result.data?.message?.responses && !result.data?.agentReply) {
          isTyping = true;
          await tick();
          await new Promise(resolve => setTimeout(resolve, 1000));
          isTyping = false;
          // Fallback: fetch latest messages from DB
          try {
            const res = await fetch(window.location.pathname + '/messages.json');
            if (res.ok) {
              const dbMessages = await res.json();
              localMessages = dbMessages;
            }
          } catch (e) {
            console.error('Failed to fetch fallback messages:', e);
          }
        }
      } catch (error) {
        console.error('Error handling message:', error);
      } finally {
        isSubmitting = false;
      }
    };
  }
  
  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  function isOwnMessage(senderId: string) {
    return senderId === data.user.id;
  }
  
  function isAIMessage(senderId: string) {
    return senderId === 'ai-assistant';
  }
  
  function getInitials(email: string) {
    return email.substring(0, 2).toUpperCase();
  }

  onMount(() => {
    if (!data?.user) return;
    subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          schema: 'public',
          table: 'messages',
          event: '*',
          filter: `chat_id=eq.${data.chat.id}`
        },
        (payload) => {
          if (!data?.user) return;
          // Type guard for payload.new
          if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
            const newMsg = payload.new as { id: string; content?: string; responses?: string | null; sender_id?: string; created_at?: string };
            // Always update by id (for both INSERT and UPDATE)
            let found = false;
            localMessages = localMessages.map(msg => {
              if (msg.id === String(newMsg.id)) {
                found = true;
                return {
                  id: String(newMsg.id),
                  content: newMsg.content ?? '',
                  responses: newMsg.responses ?? null,
                  sender_id: newMsg.sender_id ?? '',
                  created_at: newMsg.created_at ?? ''
                };
              }
              return msg;
            });
            // If not found, add as new message (for INSERT)
            if (!found) {
              localMessages = [
                ...localMessages,
                {
                  id: String(newMsg.id),
                  content: newMsg.content ?? '',
                  responses: newMsg.responses ?? null,
                  sender_id: newMsg.sender_id ?? '',
                  created_at: newMsg.created_at ?? ''
                }
              ];
            }
            console.log('Realtime payload:', payload, 'localMessages:', localMessages);
          } else if (payload.eventType === 'DELETE' && payload.old && typeof payload.old === 'object' && 'id' in payload.old) {
            const oldMsg = payload.old as { id: string };
            localMessages = localMessages.filter(msg => msg.id !== oldMsg.id);
            console.log('Realtime DELETE:', payload, 'localMessages:', localMessages);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  });
</script>

<style>
  /* Custom scrollbar for messages area */
  .chat-messages-scroll::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  .chat-messages-scroll::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.25); /* slate-500/25 */
    border-radius: 4px;
  }
  .chat-messages-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(100,116,139,0.25) transparent;
  }
</style>

<!-- Hybrid: Centered chat card, sidebar/dashboard visible -->
<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800">
  <div class="w-full h-[88vh] rounded-xl shadow-lg bg-white/90 dark:bg-zinc-900/90 flex flex-col overflow-hidden">
    <!-- Chat Header -->
    <div class="top-16 z-20 bg-white dark:bg-zinc-900 shadow-md border-b border-gray-200 dark:border-zinc-700 px-4 py-3 flex items-center gap-3 rounded-t-xl shrink-0">
      <Button variant="ghost" size="sm" onclick={() => goto('/chats') as any} class="p-2">
        ←
      </Button>
      <Avatar class="h-10 w-10">
        <AvatarImage src="/avatars/avatar.png" alt="Health AI Assistant" />
        <AvatarFallback class="bg-green-500 text-white">
          <StethoscopeIcon size={20} />
        </AvatarFallback>
      </Avatar>
      <div class="flex-1 min-w-0">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{data.chat.title}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-300">Health AI Assistant</p>
        {#if data.medicalContext}
          <p class="text-xs text-green-600 dark:text-green-400">📋 {data.medicalContext.full_name}</p>
        {/if}
      </div>
    </div>

    <!-- Messages Container (scrollable only) -->
    <div class="flex-1 overflow-hidden">
      <div class="overflow-y-auto h-full px-2 sm:px-4 py-2 space-y-3 chat-messages-scroll">
        {#if localMessages.length === 0}
          <div class="text-center py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <StethoscopeIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Welcome to your Health Assistant</h3>
            <p class="text-gray-500 dark:text-gray-300 mb-4">I'm here to help with your health questions and concerns.</p>
            <!-- Quick Action Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
              <Card class="cursor-pointer hover:bg-green-50 dark:hover:bg-green-800 transition" onclick={() => messageInput = 'I have a headache and fever. What should I do?' as any}>
                <CardContent class="p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Urgent Symptoms</span>
                  </div>
                </CardContent>
              </Card>
              <Card class="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition" onclick={() => messageInput = 'Can you explain my medication side effects?' as any}>
                <CardContent class="p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Medication Help</span>
                  </div>
                </CardContent>
              </Card>
              <Card class="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900 transition" onclick={() => messageInput = 'I need help understanding my lab results' as any}>
                <CardContent class="p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Lab Results</span>
                  </div>
                </CardContent>
              </Card>
              <Card class="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900 transition" onclick={() => messageInput = 'What lifestyle changes can improve my health?' as any}>
                <CardContent class="p-3 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Lifestyle Tips</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-4">Click any card above or type your own question</p>
          </div>
        {:else}
          {#each localMessages as message (message.id)}
            <!-- User message -->
            <div class="flex justify-end">
              <div class="flex gap-2 max-w-[70%] flex-row-reverse">
                <Avatar class="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/user-avatar.png" alt="You" />
                  <AvatarFallback class="bg-gray-500 text-white text-xs">
                    <UserIcon size={12} />
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-col gap-1">
                  <div class="bg-blue-500 text-white rounded-2xl rounded-br-md px-3 py-2 shadow-sm text-sm sm:text-base md:text-lg">
                    {message.content}
                  </div>
                  <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-right px-2">
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            </div>
            {#if message.responses}
              <!-- Agent response -->
              <div class="flex justify-start">
                <div class="flex gap-2 max-w-[70%] flex-row">
                  <Avatar class="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/avatars/avatar.png" alt="Health AI Assistant" />
                    <AvatarFallback class="bg-green-500 text-white text-xs">
                      <StethoscopeIcon size={12} />
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex flex-col gap-1">
                    <div class="bg-green-50 dark:bg-green-900 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-md border border-green-200 dark:border-green-700 px-3 py-2 shadow-sm text-sm sm:text-base md:text-lg">
                      {message.responses}
                    </div>
                    <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-left px-2">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        {/if}
        
        <!-- Typing Indicator -->
        {#if isTyping}
          <div class="flex justify-start">
            <div class="flex gap-2">
              <Avatar class="h-8 w-8">
                <AvatarImage src="/avatars/avatar.png" alt="Health AI Assistant" />
                <AvatarFallback class="bg-green-500 text-white text-xs">
                  <StethoscopeIcon size={12} />
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col gap-1">
                <div class="bg-green-50 dark:bg-green-900 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-md border border-green-200 dark:border-green-700 px-4 py-2 shadow-sm">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
        
        <!-- Scroll anchor -->
        <div bind:this={messagesEnd}></div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="p-4 border-t shrink-0 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
      <form
        method="POST"
        action="?/createMessage"
        use:enhance={handleEnhance}
        class="flex gap-2"
      >
        <div class="flex-1">
          <Input
            type="text"
            name="content"
            bind:value={messageInput}
            placeholder="Type your message..."
            disabled={isSubmitting}
            class="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-zinc-700"
            onkeydown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
                e.preventDefault();
                if (messageInput.trim()) {
                  const form = (e.currentTarget as HTMLInputElement).form;
                  if (form) form.requestSubmit();
                }
              }
            }}
          />
        </div>
        <Button type="submit" disabled={!messageInput.trim() || isSubmitting} class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white">
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {:else}
            <SendIcon size={18} />
          {/if}
        </Button>
      </form>
    </div>
  </div>
</div> 