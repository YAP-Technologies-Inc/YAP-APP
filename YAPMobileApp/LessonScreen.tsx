import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const vocabCards = [
  { word: 'Hola', desc: 'Hello' },
  { word: 'Adiós', desc: 'Goodbye' },
  { word: 'Buenos días', desc: 'Good morning' },
  { word: 'Buenas tardes', desc: 'Good afternoon' },
  { word: 'Buenas noches', desc: 'Good evening/night' },
  { word: '¿Cómo estás?', desc: 'How are you?' },
  { word: 'Bien', desc: 'Good' },
  { word: 'Mal', desc: 'Bad' },
  { word: 'Más o menos', desc: 'So-so' },
  { word: 'Por favor', desc: 'Please' },
];

const AZURE_KEY = 'FyUzclVsQdkDSD7exFSMETzWWQToA9rRaQj52xsQIq9rYjSY1BmIJQQJ99BGACYeBjFXJ3w3AAAAACOGRJBi';
const AZURE_REGION = 'eastus'; // e.g., 'eastus'
const AZURE_ENDPOINT = `https://${AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=es-ES`;

export default function LessonScreen() {
  const [page, setPage] = useState(0);
  const totalPages = vocabCards.length;
  const progress = (page + 1) / totalPages;

  // Audio recording state
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<string | null>(null);
  const [phonemeFeedback, setPhonemeFeedback] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    Speech.speak(vocabCards[page].word, { language: 'es-ES' });
    setPronunciationResult(null);
    setPhonemeFeedback([]);
    setSuggestion(null);
    setError(null);
    setAudioUri(null);
    setWaveform([]);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  }, [page]);

  // Start recording audio
  const startRecording = async () => {
    try {
      setError(null);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone access.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording.');
    }
  };

  // Stop recording and send to Azure
  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        setAudioUri(uri);
        await extractWaveform(uri);
        await sendToAzure(uri, vocabCards[page].word);
      }
    } catch (err) {
      setError('Failed to stop recording.');
    }
  };

  // Extract a simple waveform (amplitude bar graph) from the audio file
  const extractWaveform = async (uri: string) => {
    // This is a placeholder: Expo does not provide direct PCM access, so we fake a waveform
    // For a real waveform, use a backend or a native module
    // Here, we just generate random bars for demo
    const bars = Array.from({ length: 32 }, () => Math.floor(Math.random() * 40) + 10);
    setWaveform(bars);
  };

  // Play the user's recording
  const playRecording = async () => {
    if (!audioUri) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
      await newSound.playAsync();
    } catch (err) {
      setError('Failed to play recording.');
    }
  };

  // Send audio to Azure Pronunciation Assessment API
  const sendToAzure = async (audioUri: string, referenceText: string) => {
    setPronunciationResult(null);
    setPhonemeFeedback([]);
    setSuggestion(null);
    setLoading(true);
    setError(null);
    try {
      const audioBase64 = await FileSystem.readAsStringAsync(audioUri, { encoding: FileSystem.EncodingType.Base64 });
      const audioBuffer = decodeBase64(audioBase64);
      const config = {
        ReferenceText: referenceText,
        GradingSystem: 'HundredMark',
        Granularity: 'Phoneme',
        Dimension: 'Comprehensive',
      };
      const response = await fetch(AZURE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_KEY,
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          'Pronunciation-Assessment': JSON.stringify(config),
        },
        body: audioBuffer,
      });
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API rate limit reached. Please try again later.');
        }
        const text = await response.text();
        throw new Error(`Azure API error: ${text}`);
      }
      const result = await response.json();
      // Main score
      const score = result.NBest?.[0]?.PronunciationAssessment?.AccuracyScore;
      setPronunciationResult(score !== undefined ? `Score: ${score}` : 'No score returned');
      // Phoneme-level feedback
      const words = result.NBest?.[0]?.Words || [];
      let phonemes: any[] = [];
      let tips: string[] = [];
      words.forEach((w: any) => {
        if (w.Phonemes) {
          w.Phonemes.forEach((p: any) => {
            phonemes.push({
              phoneme: p.Phoneme,
              accuracy: p.PronunciationAssessment?.AccuracyScore,
              errorType: p.PronunciationAssessment?.ErrorType,
            });
            if (p.PronunciationAssessment?.ErrorType && p.PronunciationAssessment.ErrorType !== 'None') {
              tips.push(`Try to improve the sound "${p.Phoneme}" (${p.PronunciationAssessment.ErrorType})`);
            }
          });
        }
      });
      setPhonemeFeedback(phonemes);
      setSuggestion(tips.length > 0 ? tips.join('\n') : null);
    } catch (e: any) {
      setError(e.message || 'Error scoring pronunciation');
    } finally {
      setLoading(false);
    }
  };

  // Helper: decode base64 to Uint8Array (for fetch body)
  function decodeBase64(base64: string) {
    const binaryString = globalThis.atob ? globalThis.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="close" size={28} color="#2D1C1C" />
        </TouchableOpacity>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Single card view */}
      <View style={styles.cardStack}>
        <View style={[styles.card, styles.cardTop]}>
          <Text style={styles.wordCount}>
            Words: {page + 1}/{totalPages < 10 ? `0${totalPages}` : totalPages}
          </Text>
          <Text style={styles.word}>{vocabCards[page].word}</Text>
          <Text style={styles.desc}>{vocabCards[page].desc}</Text>
        </View>
      </View>

      {/* Pronunciation result and feedback */}
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="small" color="#F85C5C" style={{ marginBottom: 8 }} />
        ) : error ? (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
            <TouchableOpacity onPress={() => audioUri && sendToAzure(audioUri, vocabCards[page].word)} style={{ marginTop: 4 }}>
              <Text style={{ color: '#2D1C1C', textDecorationLine: 'underline' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {pronunciationResult && <Text style={{ color: '#2D1C1C', fontSize: 18, marginBottom: 4 }}>{pronunciationResult}</Text>}
            {phonemeFeedback.length > 0 && (
              <View style={styles.phonemeTable}>
                <Text style={styles.phonemeTableTitle}>Phoneme Feedback</Text>
                <View style={styles.phonemeTableHeader}>
                  <Text style={styles.phonemeCol}>Phoneme</Text>
                  <Text style={styles.phonemeCol}>Score</Text>
                  <Text style={styles.phonemeCol}>Error</Text>
                </View>
                {phonemeFeedback.map((p, i) => (
                  <View key={i} style={styles.phonemeTableRow}>
                    <Text style={styles.phonemeCol}>{p.phoneme}</Text>
                    <Text style={styles.phonemeCol}>{p.accuracy !== undefined ? p.accuracy : '-'}</Text>
                    <Text style={styles.phonemeCol}>{p.errorType || '-'}</Text>
                  </View>
                ))}
              </View>
            )}
            {suggestion && (
              <View style={styles.suggestionBox}>
                <Text style={styles.suggestionTitle}>Suggestions</Text>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            )}
          </>
        )}
        {/* Waveform and playback */}
        {audioUri && (
          <View style={styles.waveformContainer}>
            <Text style={styles.waveformLabel}>Your Recording</Text>
            <View style={styles.waveformBarRow}>
              {waveform.map((h, i) => (
                <View key={i} style={[styles.waveformBar, { height: h }]} />
              ))}
            </View>
            <TouchableOpacity style={styles.playBtn} onPress={playRecording} disabled={isPlaying}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => Speech.speak(vocabCards[page].word, { language: 'es-ES' })}>
          <Ionicons name="refresh" size={28} color="#2D1C1C" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.micBtn, isRecording && { backgroundColor: '#FFD166' }]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Ionicons name={isRecording ? 'stop' : 'mic'} size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page === totalPages - 1}>
          <Ionicons name="volume-high" size={28} color="#2D1C1C" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f3ec', alignItems: 'center' },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    justifyContent: 'space-between',
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#f3e9d7',
    borderRadius: 4,
    marginLeft: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#FFD166',
    borderRadius: 4,
  },
  cardStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
    width: '100%',
  },
  card: {
    width: 320,
    minHeight: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    padding: 32,
  },
  cardTop: {
    zIndex: 1,
  },
  wordCount: {
    position: 'absolute',
    top: 24,
    right: 24,
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 12,
    marginTop: 32,
    textAlign: 'center',
  },
  desc: {
    fontSize: 18,
    color: '#5C4B4B',
    textAlign: 'center',
    marginBottom: 32,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'space-between',
    width: '80%',
  },
  controlBtn: {
    backgroundColor: '#fff',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  micBtn: {
    backgroundColor: '#F85C5C',
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  phonemeTable: {
    backgroundColor: '#fffbe6',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
  },
  phonemeTableTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#2D1C1C',
  },
  phonemeTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD166',
    paddingBottom: 2,
    marginBottom: 2,
  },
  phonemeTableRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  phonemeCol: {
    flex: 1,
    fontSize: 14,
    color: '#2D1C1C',
    textAlign: 'center',
  },
  suggestionBox: {
    backgroundColor: '#e6fff7',
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
  },
  suggestionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#2D1C1C',
  },
  suggestionText: {
    fontSize: 14,
    color: '#2D1C1C',
  },
  waveformContainer: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  waveformLabel: {
    fontSize: 15,
    color: '#2D1C1C',
    marginBottom: 4,
  },
  waveformBarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
    marginBottom: 8,
    width: '90%',
    alignSelf: 'center',
  },
  waveformBar: {
    width: 4,
    backgroundColor: '#FFD166',
    marginHorizontal: 1,
    borderRadius: 2,
  },
  playBtn: {
    backgroundColor: '#2D1C1C',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
});
