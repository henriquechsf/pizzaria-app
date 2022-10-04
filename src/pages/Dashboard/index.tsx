import React, { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { signOut } = useContext(AuthContext);

  return (
    <View>
      <Text>Tela Dashboard</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
}
