import { useNavigation } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { CommonActions } from "@react-navigation/native";

export default function CustomDrawerContent(props: any) {
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
            <DrawerItem label="Logout" onPress={() => handleLogout()} />
          </>
        )}
      </DrawerContentScrollView>
    </>
  );
}
