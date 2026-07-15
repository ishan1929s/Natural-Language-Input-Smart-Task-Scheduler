import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Grid,
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
  Refresh,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useVoiceQueries } from '../../../shared/hooks/useVoiceQueries';
import { VoiceInput } from '../../../shared/components/VoiceComponents';
import { TaskForm } from '../../../shared/components/FormComponents';
import { TaskPriority } from '../../../shared/api/types';

const VoicePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [parsedTask, setParsedTask] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskHistory, setTaskHistory] = useState([]);
  
  const mediaRecorderRef = React.useRef(null);
  const audioRef = React.useRef(null);
  const intervalRef = React.useRef(null);

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

  const processAudio = async (mode = 'transcribe') => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      
      if (mode === 'transcribe') {
        const result = await transcribeMutation.mutateAsync({ audioFile });
        setTranscription(result.data.text);
      } else if (mode === 'parse') {
        const result = await parseMutation.mutateAsync({ audioFile });
        setTranscription(result.data.transcribedText);
        setParsedTask(result.data.parsedTask);
      } else if (mode === 'create') {
        const result = await createTaskMutation.mutateAsync({ audioFile });
        setTranscription(result.data.transcribedText);
        setParsedTask(result.data.parsedTask);
        
        // Add to task history
        setTaskHistory(prev => [{
          id: Date.now(),
          task: result.data.task,
          transcription: result.data.transcribedText,
          timestamp: new Date(),
        }, ...prev]);
        
        // Clear current recording
        clearRecording();
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

  const handleCreateTaskFromParsed = (taskData) => {
    // This would typically call the create task API
    console.log('Creating task from parsed data:', taskData);
    setShowTaskForm(false);
    setParsedTask(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Voice Input
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Use your voice to create tasks quickly and efficiently. The AI will automatically extract details like title, deadline, priority, and duration from your speech.
      </Typography>

      <Grid container spacing={3}>
        {/* Voice Recording Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voice Recording
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
                    size="large"
                  >
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Stop />}
                    onClick={stopRecording}
                    size="large"
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
                      onClick={() => processAudio('transcribe')}
                      disabled={isProcessing}
                      startIcon={<Upload />}
                    >
                      {isProcessing ? 'Processing...' : 'Transcribe Only'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => processAudio('parse')}
                      disabled={isProcessing}
                      startIcon={<Upload />}
                    >
                      {isProcessing ? 'Processing...' : 'Parse Task'}
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => processAudio('create')}
                      disabled={isProcessing}
                      startIcon={<CheckCircle />}
                    >
                      {isProcessing ? 'Creating...' : 'Create Task'}
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
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body1">
                      {transcription}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Parsed Task Results */}
              {parsedTask && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Parsed Task Details:
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
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
                          color={parsedTask.priority === TaskPriority.URGENT ? 'error' : 
                                 parsedTask.priority === TaskPriority.HIGH ? 'warning' : 'default'}
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
                      
                      <Button
                        variant="contained"
                        onClick={() => setShowTaskForm(true)}
                        startIcon={<CheckCircle />}
                      >
                        Create Task from Parsed Data
                      </Button>
                    </Stack>
                  </Card>
                </Box>
              )}

              {/* Instructions */}
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Instructions:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Click "Start Recording" to begin voice input
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Speak clearly and describe your task naturally
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Include details like deadline, priority, and duration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Click "Stop Recording" when finished
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Choose to transcribe, parse, or create task directly
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task History Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Recent Voice Tasks
                </Typography>
                <Tooltip title="Refresh">
                  <IconButton size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {taskHistory.length === 0 ? (
                <Alert severity="info">
                  No voice-created tasks yet. Start recording to create your first task!
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {taskHistory.slice(0, 5).map((item) => (
                    <Paper key={item.id} sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {item.task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        "{item.transcription}"
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          size="small"
                          label={item.task.priority}
                          color={item.task.priority === TaskPriority.URGENT ? 'error' : 
                                 item.task.priority === TaskPriority.HIGH ? 'warning' : 'default'}
                        />
                        <Chip
                          size="small"
                          label={item.task.category}
                          color="primary"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {item.timestamp.toLocaleString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Task Form Modal */}
      <TaskForm
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleCreateTaskFromParsed}
        initialData={parsedTask}
        title="Create Task from Voice Input"
      />
    </Box>
  );
};

export default VoicePage;