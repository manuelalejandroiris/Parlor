import useAuth from "../shared/hooks/useAuth";

export default function ShowToLoggedInUsers({ children }) {
  const { isUserLogged, isUserHotelLogged } = useAuth();

  return <>{isUserLogged ? children : null}</>;
}
