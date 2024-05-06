import { useNavigation } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";

/**
 * Contains content for app drawer, conditionally
 * loads routes based on user login status
 * @param props
 * @returns
 */
const CustomDrawerContent = (props: any) => {
  const navigation = useNavigation<any>();
  const authContext = useAuth();

  /**
   * Logs user out, Resets navigation state and redirects user to login screen
   */
  const handleLogout = async () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: "login" }],
    });
    await authContext?.auth?.logout();
    navigation.dispatch(resetAction);
  };
  return (
    <>
      <DrawerContentScrollView {...props}>
        {!authContext.auth?.authenticated ? (
          <DrawerItem
            label="Login"
            onPress={() => navigation.navigate("login")}
          />
        ) : (
          <>
            <DrawerItem
              label="Home"
              onPress={() => navigation.navigate("index")}
            />
            <DrawerItem
              label="Schedule"
              onPress={() => navigation.navigate("schedule")}
            />
            <DrawerItem
              label="Calendar"
              onPress={() => navigation.navigate("calendar")}
            />
            <DrawerItem label="Logout" onPress={() => handleLogout()} />
          </>
        )}
      </DrawerContentScrollView>
    </>
  );
};
export default CustomDrawerContent;
