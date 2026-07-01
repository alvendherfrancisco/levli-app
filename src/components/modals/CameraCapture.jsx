import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, Check, SwitchCamera, Zap, ZapOff } from "lucide-react";

const FLASH_MODES = ["off", "on", "auto"];

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef();
  const streamRef = useRef();
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [flashMode, setFlashMode] = useState("off");

  useEffect(() => {
    let active = true;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode }, audio: false })
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
  }, [facingMode]);

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

  const cycleFlash = () => {
    setFlashMode((m) => FLASH_MODES[(FLASH_MODES.indexOf(m) + 1) % FLASH_MODES.length]);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white text-sm text-center px-8">{error}</p>
          </div>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <button onClick={cycleFlash} className="absolute top-4 left-4 text-white p-1 flex flex-col items-center">
              {flashMode === "off" ? <ZapOff size={22} /> : <Zap size={22} className={flashMode === "on" ? "fill-white" : ""} />}
              <span className="text-[10px] uppercase mt-0.5 tracking-wide">{flashMode}</span>
            </button>
          </>
        )}
      </div>
      {!error && (
        <div className="relative flex items-center justify-center py-8 shrink-0">
          {capturedImage ? (
            <div className="flex items-center justify-center gap-10">
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
            </div>
          ) : (
            <>
              <button onClick={onClose} className="absolute left-6 text-white text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleCapture} className="w-16 h-16 rounded-full border-4 border-white bg-white/20" />
              <button onClick={() => setFacingMode((m) => (m === "environment" ? "user" : "environment"))}
                className="absolute right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <SwitchCamera size={20} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}