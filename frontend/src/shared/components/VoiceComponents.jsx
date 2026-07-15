import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Stop,
  PlayArrow,
  Pause,
  Delete,
  Upload,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { useVoiceQueries } from '../hooks/useVoiceQueries';

// Voice input component
export const VoiceInput = ({ 
  onTranscriptionComplete, 
  onTaskCreated,
  mode = 'transcribe' // 'transcribe', 'parse', 'create'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [parsedTask, setParsedTask] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const { useTranscribeAudio, useParseVoice, useCreateTaskFromVoice } = useVoiceQueries();
  const transcribeMutation = useTranscribeAudio();
  const parseMutation = useParseVoice();
  const createTaskMutation = useCreateTaskFromVoice();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const processAudio = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      
      if (mode === 'transcribe') {
        const result = await transcribeMutation.mutateAsync({ audioFile });
        setTranscription(result.data.text);
        onTranscriptionComplete?.(result.data.text);
      } else if (mode === 'parse') {
        const result = await parseMutation.mutateAsync({ audioFile });
        setTranscription(result.data.transcribedText);
        setParsedTask(result.data.parsedTask);
        onTranscriptionComplete?.(result.data.transcribedText, result.data.parsedTask);
      } else if (mode === 'create') {
        const result = await createTaskMutation.mutateAsync({ audioFile });
        setTranscription(result.data.transcribedText);
        setParsedTask(result.data.parsedTask);
        onTaskCreated?.(result.data.task);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setTranscription('');
    setParsedTask(null);
    setError(null);
    setRecordingTime(0);
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Voice Input
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Recording Controls */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {!isRecording ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Mic />}
              onClick={startRecording}
              disabled={isProcessing}
            >
              Start Recording
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={stopRecording}
            >
              Stop Recording ({formatTime(recordingTime)})
            </Button>
          )}

          {audioBlob && (
            <>
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={playAudio}
                disabled={isProcessing}
              >
                Play
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={processAudio}
                disabled={isProcessing}
                startIcon={<Upload />}
              >
                {isProcessing ? 'Processing...' : 'Process Audio'}
              </Button>
              
              <IconButton
                color="error"
                onClick={clearRecording}
                disabled={isProcessing}
              >
                <Delete />
              </IconButton>
            </>
          )}
        </Box>

        {/* Processing Status */}
        {isProcessing && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Processing audio...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Audio Player */}
        <audio ref={audioRef} style={{ display: 'none' }} />

        {/* Transcription Results */}
        {transcription && (
          <Box mb={2}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Transcription:
            </Typography>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">
                {transcription}
              </Typography>
            </Card>
          </Box>
        )}

        {/* Parsed Task Results */}
        {parsedTask && (
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Parsed Task Details:
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Title:
                  </Typography>
                  <Typography variant="body1">
                    {parsedTask.title}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Description:
                  </Typography>
                  <Typography variant="body1">
                    {parsedTask.description}
                  </Typography>
                </Box>
                
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={`Priority: ${parsedTask.priority}`}
                    color={parsedTask.priority === 'urgent' ? 'error' : 
                           parsedTask.priority === 'high' ? 'warning' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={`Category: ${parsedTask.category}`}
                    color="primary"
                    size="small"
                  />
                  {parsedTask.time_required && (
                    <Chip
                      label={`Duration: ${parsedTask.time_required}m`}
                      color="info"
                      size="small"
                    />
                  )}
                  {parsedTask.deadline && (
                    <Chip
                      label={`Deadline: ${new Date(parsedTask.deadline).toLocaleString()}`}
                      color="secondary"
                      size="small"
                    />
                  )}
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {Math.round(parsedTask.confidence * 100)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={parsedTask.confidence * 100} 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Stack>
            </Card>
          </Box>
        )}

        {/* Instructions */}
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            {mode === 'transcribe' && 'Click "Start Recording" to begin voice input. Speak clearly and click "Stop Recording" when finished.'}
            {mode === 'parse' && 'Record your task description. The AI will extract details like title, deadline, priority, and duration.'}
            {mode === 'create' && 'Record your task description. A new task will be created automatically with AI-extracted details.'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Voice input button (minimal version)
export const VoiceInputButton = ({ onVoiceInput, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        onVoiceInput?.(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Tooltip title={isRecording ? "Stop Recording" : "Start Voice Input"}>
      <IconButton
        color={isRecording ? "error" : "primary"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        sx={{
          animation: isRecording ? 'pulse 1s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        {isRecording ? <MicOff /> : <Mic />}
      </IconButton>
    </Tooltip>
  );
};
