import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

const videoConstraints = {
  width: 200,
  height: 100,
  facingMode: 'user',
};

const Camera = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const startStream = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopStream();
    } else {
      startStream();
    }
  };

  const toggleAudio = () => {
    setAudioEnabled((prevAudioEnabled) => {
      if (stream) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !prevAudioEnabled;
        });
      }
      return !prevAudioEnabled;
    });
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopStream();
    } else {
      startStream();
    }
    setIsCameraOn((prev) => !prev);
  };

  useEffect(() => {
    startStream();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      stopStream();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        style={{ width: '200px', height: '100px', display: isCameraOn ? 'block' : 'none' }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <FontAwesomeIcon
          icon={audioEnabled ? faMicrophone : faMicrophoneSlash}
          onClick={toggleAudio}
          style={{ cursor: 'pointer', marginRight: '20px', color: '#4aee88' }}
        />
        <FontAwesomeIcon
          icon={isCameraOn ? faVideo : faVideoSlash}
          onClick={toggleCamera}
          style={{ cursor: 'pointer', color: '#4aee88' }}
        />
      </div>
    </div>
  );
};

export default Camera;
