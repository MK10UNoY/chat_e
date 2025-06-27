<script lang="ts">
  let recognizing = false;
  let transcript = '';
  let interimTranscript = '';
  let recognition: any;
  let interruptionMarkers: number[] = [];
  let markedTranscript = '';

  function getSpeechRecognition(): any {
    // Type guard for browser compatibility
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  }

  function startRecognition() {
    const SpeechRecognition = getSpeechRecognition();
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      recognizing = true;
      transcript = '';
      interimTranscript = '';
      interruptionMarkers = [];
      markedTranscript = '';
    };
    recognition.onresult = (event: any) => {
      interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };
    recognition.onerror = (event: any) => { recognizing = false; };
    recognition.onend = () => { recognizing = false; };

    // Detect interruptions (e.g., user noise, cough, or starts talking again)
    recognition.onsoundend = () => {
      // Insert a marker at the current transcript length
      interruptionMarkers.push(transcript.length + interimTranscript.length);
    };

    recognition.start();
  }

  function stopRecognition() {
    if (recognition) recognition.stop();
  }

  function sendVoiceMessage() {
    // Insert [INTERRUPT] markers at the right places in the transcript
    markedTranscript = transcript;
    interruptionMarkers.forEach((pos, idx) => {
      markedTranscript = markedTranscript.slice(0, pos + idx * 11) + '[INTERRUPT]' + markedTranscript.slice(pos + idx * 11);
    });
    // For demo: just show the marked transcript below
  }
</script>

<div class="max-w-lg mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4">
  <h1 class="text-2xl font-bold mb-2">Voice Agent Demo</h1>
  <p class="text-gray-600 mb-4">Press the mic to start speaking. Interruptions (noise, cough, etc.) will be marked in the transcript as <span class="font-mono">[INTERRUPT]</span>.</p>

  <div class="flex items-center gap-4">
    <button
      class="rounded-full bg-blue-500 text-white w-16 h-16 flex items-center justify-center text-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      on:click={recognizing ? stopRecognition : startRecognition}
      aria-label={recognizing ? 'Stop recording' : 'Start recording'}
    >
      {#if recognizing}
        <span class="animate-pulse">🎤</span>
      {:else}
        <span>🎙️</span>
      {/if}
    </button>
    <span class="text-gray-700">{recognizing ? 'Listening...' : 'Click to speak'}</span>
  </div>

  <div class="bg-gray-100 rounded p-3 min-h-[60px] font-mono text-sm">
    <span class="text-gray-400">Live transcript:</span><br>
    {transcript}{interimTranscript}
    {#if interruptionMarkers.length > 0}
      <span class="text-xs text-blue-500 ml-2">({interruptionMarkers.length} interruption{interruptionMarkers.length > 1 ? 's' : ''} detected)</span>
    {/if}
  </div>

  <button
    class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
    on:click={sendVoiceMessage}
    disabled={!transcript}
  >
    Send Transcript
  </button>

  {#if markedTranscript}
    <div class="bg-green-50 border border-green-200 rounded p-3 mt-2">
      <div class="font-bold mb-1">Transcript with [INTERRUPT] markers:</div>
      <div class="whitespace-pre-wrap font-mono text-sm">{markedTranscript}</div>
    </div>
  {/if}
</div>

<style>
  .min-h-\[60px\] { min-height: 60px; }
</style> 