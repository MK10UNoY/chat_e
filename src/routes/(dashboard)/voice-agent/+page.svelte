<script lang="ts">
  import { onMount } from 'svelte';

  let recognizing = false;
  let transcript = '';
  let interimTranscript = '';
  let recognition: any;
  let canvas: HTMLCanvasElement;
  let canvasContext: CanvasRenderingContext2D | null = null;
  
  // Audio visualization variables
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let microphone: MediaStreamAudioSourceNode | null = null;
  let dataArray: Uint8Array | null = null;
  let animationId: number | null = null;
  let audioStream: MediaStream | null = null;
  let currentIntensity = 0;
  let buttonColor = 'blue';
  let buttonIcon = '🎙️';

  let selectedLanguage = 'hi-IN';
  const languages = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'hi-IN', label: 'Hindi' },
    { code: 'bn-IN', label: 'Bengali' },
    { code: 'ta-IN', label: 'Tamil' },
    { code: 'te-IN', label: 'Telugu' }
  ];

  function getSpeechRecognition(): any {
    console.log('Checking for SpeechRecognition support...');
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  }

  async function startRecognition() {
    console.log('Attempting to start recognition with language:', selectedLanguage);
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onstart = async () => {
      console.log('Speech recognition started');
      recognizing = true;
      transcript = '';
      interimTranscript = '';
      
      // Initialize canvas context
      if (canvas && !canvasContext) {
        canvasContext = canvas.getContext('2d');
        console.log('Canvas context initialized:', !!canvasContext);
      }
      
      // Start audio visualization
      await startAudioVisualization();
    };

    recognition.onresult = (event: any) => {
      console.log('Received speech result:', event);
      interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          console.log('Final transcript:', event.results[i][0].transcript);
          transcript += event.results[i][0].transcript + ' ';
        } else {
          console.log('Interim transcript:', event.results[i][0].transcript);
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Recognition error:', event.error);
      recognizing = false;
      stopAudioVisualization();
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      recognizing = false;
      stopAudioVisualization();
    };

    recognition.start();
    console.log('Recognition started');
  }

  function stopRecognition() {
    console.log('Stopping recognition...');
    if (recognition) {
      recognition.stop();
    }
    recognizing = false;
    stopAudioVisualization();
  }

  function toggleRecording() {
    console.log('Toggle recording called, recognizing =', recognizing);
    if (recognizing) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }

  // Dummy transliteration + translation
  async function transliterateAndTranslate(text: string): Promise<string> {
    console.log('Translating text:', text);
    const response = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=' + encodeURIComponent(text));
    const data = await response.json();
    console.log('Translation response:', data);
    return data[0].map((item: any) => item[0]).join('');
  }

  let translatedTranscript = '';
  async function handleTranslate() {
    console.log('Handling translation for:', transcript);
    translatedTranscript = await transliterateAndTranslate(transcript);
    console.log('Translated transcript:', translatedTranscript);
  }

  async function startAudioVisualization() {
    try {
      console.log('Starting audio visualization...');
      
      // Get microphone access
      audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      console.log('Microphone access granted');
      
      // Create audio context
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(audioStream);
      
      // Configure analyser
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      // Connect microphone to analyser
      microphone.connect(analyser);
      
      console.log('Audio setup complete, starting visualization');
      
      // Start the visualization loop
      drawWaveform();
    } catch (error) {
      console.error('Error in audio visualization:', error);
    }
  }

  function drawWaveform() {
    if (!recognizing || !canvas || !canvasContext || !analyser || !dataArray) {
      console.log('Missing required components for visualization');
      return;
    }
    
    animationId = requestAnimationFrame(drawWaveform);
    
    analyser.getByteTimeDomainData(dataArray);
    
    // Clear canvas
    canvasContext.fillStyle = 'rgb(15, 23, 42)'; // slate-900 background
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate average amplitude for color intensity
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += Math.abs(dataArray[i] - 128);
    }
    const averageAmplitude = sum / dataArray.length;
    currentIntensity = Math.min(averageAmplitude / 64, 1); // Normalize to 0-1
    
    // Update button color and icon based on intensity
    updateButtonState();
    
    // Create gradient colors based on intensity
    const colors = [
      { r: 59, g: 130, b: 246 },   // blue-500
      { r: 147, g: 51, b: 234 },   // violet-600
      { r: 236, g: 72, b: 153 },   // pink-500
      { r: 239, g: 68, b: 68 },    // red-500
      { r: 245, g: 158, b: 11 },   // amber-500
      { r: 34, g: 197, b: 94 }     // green-500
    ];
    
    // Interpolate between colors based on intensity
    const colorIndex = currentIntensity * (colors.length - 1);
    const color1 = colors[Math.floor(colorIndex)];
    const color2 = colors[Math.min(Math.ceil(colorIndex), colors.length - 1)];
    const fraction = colorIndex - Math.floor(colorIndex);
    
    const r = Math.round(color1.r + (color2.r - color1.r) * fraction);
    const g = Math.round(color1.g + (color2.g - color1.g) * fraction);
    const b = Math.round(color1.b + (color2.b - color1.b) * fraction);
    
    // Draw animated sonogram bars
    const barWidth = canvas.width / dataArray.length;
    const maxBarHeight = canvas.height * 0.8;
    
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i] / 128.0;
      const barHeight = Math.abs(value) * maxBarHeight;
      
      // Create gradient for each bar
      const gradient = canvasContext.createLinearGradient(
        i * barWidth, 
        canvas.height - barHeight, 
        i * barWidth, 
        canvas.height
      );
      
      // Add multiple gradient stops for more dynamic effect
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.6)`);
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.4)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`);
      
      canvasContext.fillStyle = gradient;
      
      // Draw mirrored bars for symmetrical effect
      const y = (canvas.height - barHeight) / 2;
      canvasContext.fillRect(i * barWidth, y, barWidth - 1, barHeight);
      canvasContext.fillRect(i * barWidth, canvas.height - y - barHeight, barWidth - 1, barHeight);
    }
    
    // Add glow effect
    canvasContext.shadowColor = `rgb(${r}, ${g}, ${b})`;
    canvasContext.shadowBlur = 10;
    canvasContext.shadowOffsetX = 0;
    canvasContext.shadowOffsetY = 0;
    
    // Draw center line with glow
    canvasContext.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
    canvasContext.lineWidth = 2;
    canvasContext.beginPath();
    canvasContext.moveTo(0, canvas.height / 2);
    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.stroke();
    
    // Reset shadow
    canvasContext.shadowBlur = 0;
    
    // Add animated particles for extra effect
    if (currentIntensity > 0.3) {
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3 + 1;
        
        canvasContext.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.random() * 0.5 + 0.2})`;
        canvasContext.beginPath();
        canvasContext.arc(x, y, size, 0, 2 * Math.PI);
        canvasContext.fill();
      }
    }
  }

  function updateButtonState() {
    if (!recognizing) {
      buttonColor = 'blue';
      buttonIcon = '🎙️';
      return;
    }
    
    // Update button color based on intensity
    if (currentIntensity < 0.2) {
      buttonColor = 'red';
      buttonIcon = '⏹️';
    } else if (currentIntensity < 0.4) {
      buttonColor = 'orange';
      buttonIcon = '🎤';
    } else if (currentIntensity < 0.6) {
      buttonColor = 'yellow';
      buttonIcon = '🔊';
    } else if (currentIntensity < 0.8) {
      buttonColor = 'green';
      buttonIcon = '📢';
    } else {
      buttonColor = 'purple';
      buttonIcon = '🚨';
    }
  }

  function stopAudioVisualization() {
    console.log('Stopping audio visualization...');
    
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    if (microphone) {
      microphone.disconnect();
      microphone = null;
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    
    analyser = null;
    dataArray = null;
  }
</script>

<div class="max-w-xl mx-auto mt-8 p-6 bg-white shadow rounded space-y-4">
  <h1 class="text-2xl font-bold">Multilingual Voice Agent</h1>

  <div>
    <label class="block font-medium text-gray-700 mb-1">Select Language:</label>
    <select bind:value={selectedLanguage} class="border p-2 rounded">
      {#each languages as lang}
        <option value={lang.code}>{lang.label}</option>
      {/each}
    </select>
  </div>

  <div class="flex gap-4 items-center">
    <button
      class="rounded-full text-white w-16 h-16 flex items-center justify-center text-2xl shadow-lg focus:outline-none focus:ring-2 transition-all duration-200 {recognizing ? 
        buttonColor === 'red' ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300' :
        buttonColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300' :
        buttonColor === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300' :
        buttonColor === 'green' ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300' :
        buttonColor === 'purple' ? 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-300' :
        'bg-red-500 hover:bg-red-600 focus:ring-red-300'
        : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'}"
      on:click={toggleRecording}
    >
      <span class="{recognizing ? 'animate-pulse' : ''}">{buttonIcon}</span>
    </button>
    <span class="text-gray-700">{recognizing ? 'Listening...' : 'Click to start'}</span>
  </div>

  <!-- Voice Reactive Visualization -->
  <div class="bg-slate-900 rounded-lg p-4 border border-slate-700">
    <div class="text-sm text-slate-300 mb-3 font-medium">Voice Sonogram</div>
    <canvas 
      bind:this={canvas}
      width="500" 
      height="120" 
      class="w-full h-30 border border-slate-600 rounded-lg"
    ></canvas>
    <div class="text-xs text-slate-400 mt-2 text-center">
      Colors change with voice intensity • Blue → Violet → Pink → Red → Amber → Green
    </div>
  </div>

  <div class="p-3 bg-gray-50 rounded border">
    <strong class="block text-gray-600 mb-1">Transcript:</strong>
    <div class="whitespace-pre-wrap text-sm">
      <span class="text-black">{transcript}</span>
      <span class="text-gray-400 italic">{interimTranscript}</span>
    </div>
  </div>

  <button
    on:click={handleTranslate}
    class="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    disabled={!transcript}
  >
    Translate to English
  </button>

  {#if translatedTranscript}
    <div class="bg-green-50 p-3 border rounded">
      <div class="font-bold mb-1">Translated Transcript:</div>
      <div class="text-sm text-green-800 whitespace-pre-wrap">{translatedTranscript}</div>
    </div>
  {/if}
</div>

<style>
  select { width: 100%; }
</style>
