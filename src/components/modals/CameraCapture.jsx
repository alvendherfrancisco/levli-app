import React, { useEffect, useRef, useState } from "react";
import { X, RotateCcw, Check } from "lucide-react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef();
  const streamRef = useRef();
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Camera access was denied. Please allow camera permission in your browser settings and try again."));
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.92));
  };

  const handleUsePhoto = () => {
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `progress-${Date.now()}.jpg`, { type: "image/jpeg" });
        onCapture(file);
      });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={onClose} className="text-white p-1">
          <X size={26} />
        </button>
      </div>
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <p className="text-white text-sm text-center px-8">{error}</p>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
      </div>
      {!error && (
        <div className="flex items-center justify-center gap-10 py-8 shrink-0">
          {capturedImage ? (
            <>
              <button onClick={() => setCapturedImage(null)} className="flex flex-col items-center gap-1.5 text-white">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                  <RotateCcw size={22} />
                </div>
                <span className="text-xs">Retake</span>
              </button>
              <button onClick={handleUsePhoto} className="flex flex-col items-center gap-1.5 text-white">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check size={26} />
                </div>
                <span className="text-xs">Use Photo</span>
              </button>
            </>
          ) : (
            <button onClick={handleCapture} className="w-16 h-16 rounded-full border-4 border-white bg-white/20" />
          )}
        </div>
      )}
    </div>
  );
}