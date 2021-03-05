import useAuth from "../shared/hooks/useAuth";

export default function ShowToGuestUsers({ children }) {
  const { isUserLogged, isUserHotelLogged } = useAuth();

  return <>{!isUserLogged && !isUserHotelLogged ? children : null}</>;
}
