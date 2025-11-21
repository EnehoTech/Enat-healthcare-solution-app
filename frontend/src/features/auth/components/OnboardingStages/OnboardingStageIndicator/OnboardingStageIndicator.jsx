import styles from "./OnboardingStageIndicator.module.css";

const OnboardingStageIndicator = ({ currentStage }) => {
  const stages = [1, 2]; //  1: Profile Picture, 2: Welcome
  return (
    <div
      className={`${styles["onboarding-stage-indicator"]}`}
      aria-label="Onboarding progress"
    >
      {stages?.map((stage) => (
        <span
          key={stage}
          className={`${styles["onboarding-stage-dot"]} ${
            currentStage === stage ? styles["onboarding-stage-dot-active"] : ""
          }`}
          aria-current={currentStage === stage ? "stage" : undefined}
        />
      ))}
    </div>
  );
};

export default OnboardingStageIndicator;
