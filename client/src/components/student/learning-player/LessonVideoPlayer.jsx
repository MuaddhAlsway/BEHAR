
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  LoaderCircle,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

import "../../../styles/student/learning-player/lesson-video-player.css";

const translations = {
  en: {
    play: "Play",
    pause: "Pause",
    replay: "Replay lesson",
    mute: "Mute",
    unmute: "Unmute",
    fullscreen: "Enter fullscreen",
    exitFullscreen: "Exit fullscreen",
    pictureInPicture: "Picture in picture",
    playbackSpeed: "Playback speed",
    volume: "Volume",
    seek: "Seek video",
    backward: "Back 10 seconds",
    forward: "Forward 10 seconds",
    loading: "Preparing your lesson",
    buffering: "Buffering video...",
    unavailable: "Video unavailable",
    unavailableDescription:
      "This lesson doesn't have a video source yet.",
    playbackError: "Unable to play this video",
    playbackErrorDescription:
      "The video could not be loaded. Check the source and try again.",
    retry: "Try again",
    videoLesson: "VIDEO LESSON",
    completed: "Lesson playback finished",
    unsupported:
      "Your browser does not support HTML5 video.",
  },

  ar: {
    play: "تشغيل",
    pause: "إيقاف مؤقت",
    replay: "إعادة تشغيل الدرس",
    mute: "كتم الصوت",
    unmute: "إلغاء كتم الصوت",
    fullscreen: "ملء الشاشة",
    exitFullscreen: "الخروج من ملء الشاشة",
    pictureInPicture: "صورة داخل صورة",
    playbackSpeed: "سرعة التشغيل",
    volume: "مستوى الصوت",
    seek: "تقديم أو تأخير الفيديو",
    backward: "الرجوع 10 ثوانٍ",
    forward: "التقدم 10 ثوانٍ",
    loading: "جاري تجهيز الدرس",
    buffering: "جاري تحميل الفيديو...",
    unavailable: "الفيديو غير متاح",
    unavailableDescription:
      "لم تتم إضافة مصدر فيديو لهذا الدرس بعد.",
    playbackError: "تعذر تشغيل الفيديو",
    playbackErrorDescription:
      "تعذر تحميل الفيديو. تحقق من المصدر وحاول مجدداً.",
    retry: "إعادة المحاولة",
    videoLesson: "درس فيديو",
    completed: "انتهى تشغيل الدرس",
    unsupported:
      "المتصفح لا يدعم تشغيل الفيديو.",
  },
};

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const value = Math.floor(seconds);
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remainingSeconds = value % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getLocalized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

export default function LessonVideoPlayer({
  lesson,
  language = "en",
  onEnded,
  mode = "learning",
  autoPlay = false,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const seekRef = useRef(null);

  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const videoSrc = lesson?.videoUrl || lesson?.video?.url || "";
  const poster = lesson?.posterUrl || lesson?.video?.poster || "";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(videoSrc));
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  const hasSource = Boolean(videoSrc);

  // Reset the player when switching lessons.
  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.pause();
    }

    setIsPlaying(false);
    setIsLoading(Boolean(videoSrc));
    setIsBuffering(false);
    setHasError(false);
    setIsEnded(false);
    setCurrentTime(0);
    setDuration(0);

    if (video) {
      video.currentTime = 0;
      video.load();
    }
  }, [lesson?.id, videoSrc]);

  useEffect(() => {
    if (!autoPlay || !videoRef.current || !videoSrc) return undefined;

    const video = videoRef.current;
    const playWhenReady = () => {
      video.play().catch(() => {
        // Autoplay can be blocked; the visible play control remains available.
      });
    };

    video.addEventListener("canplay", playWhenReady, { once: true });
    return () => video.removeEventListener("canplay", playWhenReady);
  }, [autoPlay, lesson?.id, videoSrc]);

  // Sync fullscreen state with browser events.
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === containerRef.current
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !hasSource) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  }, [hasSource]);

  const seekTo = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    const nextTime = Math.max(
      0,
      Math.min(seconds, video.duration)
    );

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const skip = useCallback(
    (seconds) => {
      const video = videoRef.current;
      if (!video) return;
      seekTo(video.currentTime + seconds);
    },
    [seekTo]
  );

  const handleSeek = (event) => {
    seekTo(Number(event.target.value));
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    const video = videoRef.current;

    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);

    if (video) {
      video.volume = nextVolume;
      video.muted = nextVolume === 0;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSpeedChange = (event) => {
    const nextRate = Number(event.target.value);
    const video = videoRef.current;

    setPlaybackRate(nextRate);

    if (video) {
      video.playbackRate = nextRate;
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (container.requestFullscreen) {
        await container.requestFullscreen();
      }
    } catch {
      // Browser may restrict fullscreen.
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) return;

    try {
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch {
      // PiP is not available in every browser.
    }
  };

  const retryPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    setIsLoading(true);
    setIsBuffering(false);

    video.load();
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
    onEnded?.(lesson);
  };

  const handleKeyDown = (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest(
        "button, input, select, textarea, a"
      )
    ) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case " ":
      case "k":
        event.preventDefault();
        togglePlayback();
        break;

      case "arrowleft":
        event.preventDefault();
        skip(-10);
        break;

      case "arrowright":
        event.preventDefault();
        skip(10);
        break;

      case "m":
        event.preventDefault();
        toggleMute();
        break;

      case "f":
        event.preventDefault();
        toggleFullscreen();
        break;

      default:
        break;
    }
  };

  if (!lesson) return null;

  return (
    <section
      ref={containerRef}
      className={`behar-video-player behar-video-player--${mode}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={getLocalized(lesson.title, locale)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="behar-video-player__viewport">
        <video
          ref={videoRef}
          key={`${lesson.id}-${videoSrc}`}
          className="behar-video-player__video"
          src={videoSrc || undefined}
          poster={poster || undefined}
          preload="metadata"
          playsInline
          onPlay={() => {
            setIsPlaying(true);
            setIsEnded(false);
          }}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onLoadedMetadata={(event) => {
            setDuration(
              Number.isFinite(event.currentTarget.duration)
                ? event.currentTarget.duration
                : 0
            );
            setIsLoading(false);
          }}
          onCanPlay={() => {
            setIsLoading(false);
            setIsBuffering(false);
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onError={() => {
            if (!hasSource) return;
            setHasError(true);
            setIsLoading(false);
            setIsBuffering(false);
          }}
          onEnded={handleVideoEnded}
          onVolumeChange={(event) => {
            setVolume(event.currentTarget.volume);
            setIsMuted(event.currentTarget.muted);
          }}
          onRateChange={(event) =>
            setPlaybackRate(event.currentTarget.playbackRate)
          }
          onEnterPictureInPicture={() => setIsPiP(true)}
          onLeavePictureInPicture={() => setIsPiP(false)}
        >
          {t.unsupported}
        </video>

        <div
          className="behar-video-player__grid"
          aria-hidden="true"
        />

        <div className="behar-video-player__topline">
          <span className="behar-video-player__brand">
            BEHAR<span>.</span>
          </span>

          <span className="behar-video-player__type">
            <span />
            {t.videoLesson}
          </span>
        </div>

        {!hasSource && (
          <div className="behar-video-player__state">
            <div className="behar-video-player__state-icon">
              <Play size={30} strokeWidth={1.4} />
            </div>

            <h2>{t.unavailable}</h2>
            <p>{t.unavailableDescription}</p>
          </div>
        )}

        {hasSource && hasError && (
          <div className="behar-video-player__state">
            <AlertCircle size={32} strokeWidth={1.4} />
            <h2>{t.playbackError}</h2>
            <p>{t.playbackErrorDescription}</p>

            <button
              type="button"
              className="behar-video-player__retry"
              onClick={retryPlayback}
            >
              <RotateCcw size={15} />
              {t.retry}
            </button>
          </div>
        )}

        {hasSource && !hasError && (isLoading || isBuffering) && (
          <div
            className="behar-video-player__state behar-video-player__state--loading"
            role="status"
          >
            <LoaderCircle
              size={30}
              className="behar-video-player__spinner"
            />
            <p>{isLoading ? t.loading : t.buffering}</p>
          </div>
        )}

        {hasSource &&
          !hasError &&
          !isLoading &&
          !isPlaying && (
            <button
              type="button"
              className="behar-video-player__center-play"
              onClick={togglePlayback}
              aria-label={isEnded ? t.replay : t.play}
            >
              {isEnded ? (
                <RotateCcw size={30} />
              ) : (
                <Play size={32} fill="currentColor" />
              )}
            </button>
          )}

        {hasSource && isEnded && !hasError && (
          <div className="behar-video-player__ended">
            {t.completed}
          </div>
        )}
      </div>

      {/* PLAYER CONTROLS */}
      <div className="behar-video-player__controls">
        <div className="behar-video-player__timeline">
          <input
            ref={seekRef}
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            disabled={!hasSource || hasError || duration <= 0}
            aria-label={t.seek}
            style={{ "--video-progress": `${progress}%` }}
          />
          <div className="behar-video-player__time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="behar-video-player__controls-row">
          <div className="behar-video-player__control-group">
            <button
              type="button"
              onClick={togglePlayback}
              disabled={!hasSource || hasError}
              aria-label={isPlaying ? t.pause : t.play}
              title={isPlaying ? t.pause : t.play}
            >
              {isPlaying ? (
                <Pause size={19} fill="currentColor" />
              ) : (
                <Play size={19} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skip(-10)}
              disabled={!hasSource || hasError}
              aria-label={t.backward}
              title={t.backward}
            >
              <SkipBack size={17} />
            </button>

            <button
              type="button"
              onClick={() => skip(10)}
              disabled={!hasSource || hasError}
              aria-label={t.forward}
              title={t.forward}
            >
              <SkipForward size={17} />
            </button>

            <div className="behar-video-player__volume">
              <button
                type="button"
                onClick={toggleMute}
                disabled={!hasSource || hasError}
                aria-label={isMuted ? t.unmute : t.mute}
                title={isMuted ? t.unmute : t.mute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                disabled={!hasSource || hasError}
                aria-label={t.volume}
              />
            </div>
          </div>

          <div className="behar-video-player__control-group">
            <select
              value={playbackRate}
              onChange={handleSpeedChange}
              disabled={!hasSource || hasError}
              aria-label={t.playbackSpeed}
              title={t.playbackSpeed}
            >
              {playbackSpeeds.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}×
                </option>
              ))}
            </select>

            {typeof document !== "undefined" &&
              document.pictureInPictureEnabled && (
                <button
                  type="button"
                  onClick={togglePiP}
                  disabled={!hasSource || hasError}
                  aria-label={t.pictureInPicture}
                  title={t.pictureInPicture}
                  aria-pressed={isPiP}
                >
                  <PictureInPicture2 size={18} />
                </button>
              )}

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen
                  ? t.exitFullscreen
                  : t.fullscreen
              }
              title={
                isFullscreen
                  ? t.exitFullscreen
                  : t.fullscreen
              }
            >
              {isFullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
