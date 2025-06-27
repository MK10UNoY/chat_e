<script lang="ts">
  import { Button } from '$lib/shadcn/components/ui/button';
  import { Input } from '$lib/shadcn/components/ui/input';
  import { Label } from '$lib/shadcn/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/shadcn/components/ui/card';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  
  export let data: { medicalContexts: Array<{ id: string; title: string }> };
  
  let title = '';
  let selectedMedicalContext = '';
  let isSubmitting = false;
  
  function handleEnhance() {
    return async () => {
      isSubmitting = true;
    };
  }
  
  function cancel() {
    goto('/chats');
  }
</script>

<div class="flex flex-col gap-6 max-w-2xl mx-auto w-full">
  <Card>
    <CardHeader>
      <CardTitle>Start New Chat</CardTitle>
    </CardHeader>
    <CardContent>
      <form 
        method="POST" 
        action="?/createChat" 
        use:enhance={handleEnhance}
        class="space-y-4"
      >
        <div class="space-y-2">
          <Label for="title">Chat Title</Label>
          <Input
            id="title"
            name="title"
            bind:value={title}
            placeholder="Enter a title for your chat..."
            required
            disabled={isSubmitting}
          />
        </div>
        
        {#if data.medicalContexts.length > 0}
          <div class="space-y-2">
            <Label for="medical_context">Link to Medical Context (Optional)</Label>
            <select
              id="medical_context"
              name="medical_context_id"
              bind:value={selectedMedicalContext}
              class="w-full p-2 border border-input rounded-md bg-background"
              disabled={isSubmitting}
            >
              <option value="">No medical context</option>
              {#each data.medicalContexts as context}
                <option value={context.id}>{context.title}</option>
              {/each}
            </select>
          </div>
        {/if}
        
        <div class="flex gap-2 pt-4">
          <Button type="submit" disabled={!title.trim() || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Chat'}
          </Button>
          <Button type="button" variant="outline" onclick={cancel as any} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</div> 