import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import AddProfilePicture from '../../components/OnboardingStages/AddProfilePicture/AddProfilePicture';
import OnBoardingWelcome from '../../components/OnboardingStages/OnBoardingWelcome/OnBoardingWelcome';
import PreLoader from '../../../../shared/components/PreLoader/PreLoader';


const Onboarding = () => {
  // Get onboarding stage information and completion status from Redux
  const { isLoading, stage, name, isOnboardingCompleted } = useSelector(
    (state) => state?.onboarding
  );

  // If still loading, show a loader
  if (isLoading) {
    return <PreLoader /> // Replace with your loader component if available
  }

  // Check if onboarding is complete and redirect to home
  if (isOnboardingCompleted) {
    return <Navigate to="/" />;
  }

  // Render components based on stage_id or stage_name
  switch (stage, name) {
    case 1:
    case "step1":
      return <AddProfilePicture />;
    case 2:
    case "step2":
       return <OnBoardingWelcome />;
    default:
      // Redirect to home for invalid stages
      return <Navigate to="/" />;
  }
}

export default Onboarding