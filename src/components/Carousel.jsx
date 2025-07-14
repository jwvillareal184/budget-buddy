import React, { useEffect, useState } from 'react';
import styles from '../styles/styles.module.css';
import { WhiteHeaders } from './WhiteHeaders';

export const Carousel = ({ goals }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = goals.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [totalSlides]);

  return (
    <div className={styles.carouselContainer}>
        
      <div
        className={styles.carouselTrack}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {goals.map((goal, index) => {
        const progress = Math.min(
            (goal.currentAmount / goal.targetAmount) * 100,
            100
        );

        return (
            <div className={styles.slide} key={index}>
            <div className={styles.card}>
          
                <div className={styles.progressCircle}>
                <svg className={styles.svg} viewBox="0 0 36 36">
                    <path
                    className={styles.bg}
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                    className={styles.fg}
                    strokeDasharray={`${progress}, 100`}
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className={styles.text}>
                    {Math.round(progress)}%
                    </text>
                </svg>
                </div>
                <h3 className={styles.goalTitle}>{goal.name}</h3>
                <p className={styles.goalAmount}>
                ₱{goal.currentAmount} / ₱{goal.targetAmount}
                </p>
            </div>
            <div className={styles.goalDescription}>
                    <WhiteHeaders label={goal.description} />
                </div>
            </div>
        );
        })}

      </div>
    </div>
  );
};
