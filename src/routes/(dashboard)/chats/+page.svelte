<script lang="ts">
  import { Button } from '$lib/shadcn/components/ui/button';
  import { Input } from '$lib/shadcn/components/ui/input';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/shadcn/components/ui/card';
  import { goto } from '$app/navigation';
  
  export let data: { chats: Array<{ 
    id: string; 
    title: string; 
    updated_at: string; 
    medical_context_id?: string;
    last_message?: string 
  }> };

  let search = '';
  let filteredChats = data.chats || [];

  $: filteredChats = search
    ? data.chats.filter(
        (chat) =>
          chat.title.toLowerCase().includes(search.toLowerCase()) ||
          (chat.last_message && chat.last_message.toLowerCase().includes(search.toLowerCase()))
      )
    : data.chats;

  function startNewChat() {
    goto('/chats/new');
  }
  function openChat(id: string) {
    goto(`/chats/${id}`);
  }
  
  function handleKeydown(event: KeyboardEvent, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openChat(id);
    }
  }
</script>

<div class="flex flex-col gap-6 max-w-2xl mx-auto w-full">
  <div class="flex items-center gap-2">
    <Input
      placeholder="Search chats..."
      bind:value={search}
      class="flex-1"
      aria-label="Search chats"
    />
    <Button onclick={startNewChat as any} variant="outline">New Chat</Button>
  </div>

  {#if filteredChats.length === 0}
    <Card class="text-center py-12">
      <CardHeader>
        <CardTitle>No chats found</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="mb-4">You have no past chats. Start a new conversation!</p>
        <Button onclick={startNewChat as any}>Start New Chat</Button>
      </CardContent>
    </Card>
  {:else}
    <div class="flex flex-col gap-2">
      {#each filteredChats as chat (chat.id)}
        <div 
          class="cursor-pointer hover:bg-accent transition" 
          on:click={() => openChat(chat.id)} 
          on:keydown={(e) => handleKeydown(e, chat.id)}
          tabindex="0" 
          role="button"
        >
          <Card>
            <CardHeader class="flex flex-row items-center justify-between">
              <CardTitle class="truncate">{chat.title}</CardTitle>
              <span class="text-xs text-muted-foreground">{new Date(chat.updated_at).toLocaleString()}</span>
            </CardHeader>
            {#if chat.last_message}
              <CardContent class="truncate text-sm text-muted-foreground">
                {chat.last_message}
              </CardContent>
            {/if}
          </Card>
        </div>
      {/each}
    </div>
  {/if}
</div>
