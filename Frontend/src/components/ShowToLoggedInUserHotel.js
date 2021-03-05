import useAuth from "../shared/hooks/useAuth";

export default function ShowToLoggedInUserHotel({ children }) {
  const { isUserHotelLogged, isUserLogged } = useAuth();

  return <>{isUserHotelLogged && !isUserLogged ? children : null}</>;
}
