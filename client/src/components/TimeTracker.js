import React, { useState, useEffect, useRef } from 'react';
import './TimeTracker.css';

const TimeTracker = ({ task, onTimeUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpent, setTimeSpent] = useState(task.timeSpent || 0); // in seconds
  const [sessionTime, setSessionTime] = useState(0); // current session time
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState('work'); // 'work' or 'break'
  const intervalRef = useRef(null);

  // Pomodoro durations (in seconds)
  const WORK_DURATION = 25 * 60; // 25 minutes
  const SHORT_BREAK = 5 * 60; // 5 minutes
  const LONG_BREAK = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSessionTime((prev) => {
          const newTime = prev + 1;
          setTimeSpent((prevTotal) => prevTotal + 1);
          
          if (pomodoroMode) {
            const currentPhaseTime = pomodoroPhase === 'work' ? WORK_DURATION : 
                                   pomodoroPhase === 'shortBreak' ? SHORT_BREAK : LONG_BREAK;
            
            if (newTime >= currentPhaseTime) {
              // Phase complete
              handlePhaseComplete();
              return 0;
            }
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, pomodoroMode, pomodoroPhase]);

  // Debounce time updates to avoid too many API calls
  useEffect(() => {
    if (onTimeUpdate && timeSpent > 0 && timeSpent % 30 === 0) {
      // Only update every 30 seconds to reduce API calls
      onTimeUpdate(task._id, timeSpent);
    }
  }, [timeSpent, task._id, onTimeUpdate]);

  // Save time when component unmounts or timer stops
  useEffect(() => {
    return () => {
      if (onTimeUpdate && timeSpent > 0) {
        onTimeUpdate(task._id, timeSpent);
      }
    };
  }, []);

  const handlePhaseComplete = () => {
    setIsRunning(false);
    if (pomodoroPhase === 'work') {
      // Show notification or alert
      if (window.confirm('Work session complete! Take a break?')) {
        setPomodoroPhase('shortBreak');
        setSessionTime(0);
      }
    } else {
      setPomodoroPhase('work');
      setSessionTime(0);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSessionTime(0);
    if (!pomodoroMode) {
      setTimeSpent(0);
    }
  };

  const togglePomodoro = () => {
    setPomodoroMode(!pomodoroMode);
    if (!pomodoroMode) {
      setPomodoroPhase('work');
      setSessionTime(0);
    }
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPomodoroProgress = () => {
    if (!pomodoroMode) return 0;
    const currentPhaseTime = pomodoroPhase === 'work' ? WORK_DURATION : 
                           pomodoroPhase === 'shortBreak' ? SHORT_BREAK : LONG_BREAK;
    return (sessionTime / currentPhaseTime) * 100;
  };

  return (
    <div className="time-tracker">
      <div className="time-tracker-header">
        <h4>Time Tracker</h4>
        <button
          className={`pomodoro-toggle ${pomodoroMode ? 'active' : ''}`}
          onClick={togglePomodoro}
          title="Toggle Pomodoro Mode"
        >
          🍅
        </button>
      </div>

      {pomodoroMode && (
        <div className="pomodoro-info">
          <div className="pomodoro-phase">
            {pomodoroPhase === 'work' ? '⏱️ Work' : pomodoroPhase === 'shortBreak' ? '☕ Short Break' : '🌴 Long Break'}
          </div>
          <div className="pomodoro-progress">
            <div 
              className="pomodoro-progress-bar"
              style={{ width: `${getPomodoroProgress()}%` }}
            />
          </div>
        </div>
      )}

      <div className="time-display">
        <div className="session-time">
          <span className="time-label">Session</span>
          <span className="time-value">{formatTime(sessionTime)}</span>
        </div>
        <div className="total-time">
          <span className="time-label">Total</span>
          <span className="time-value">{formatTime(timeSpent)}</span>
        </div>
      </div>

      <div className="time-controls">
        {!isRunning ? (
          <button className="btn btn-primary btn-time" onClick={startTimer}>
            ▶️ Start
          </button>
        ) : (
          <button className="btn btn-secondary btn-time" onClick={stopTimer}>
            ⏸️ Pause
          </button>
        )}
        <button className="btn btn-secondary btn-time" onClick={resetTimer}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default TimeTracker;

