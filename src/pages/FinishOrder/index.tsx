import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type RouteDetailParams = {
  FinishOrder: {
    number: string | number;
    order_id: string;
  };
};

type FinishOrderRouteProp = RouteProp<RouteDetailParams, "FinishOrder">;

export default function FinishOrder() {
  const route = useRoute<FinishOrderRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const handleFinish = async () => {
    try {
      await api.patch(`/order/${route.params.order_id}/send`);
      navigation.popToTop();
    } catch (err) {
      console.log("Erro ao finalizar", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.alert}>Voce deseja finalizar esse pedido?</Text>
      <Text style={styles.title}>Mesa {route.params?.number}</Text>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.textButton}>Finalizar pedido</Text>
        <Feather name="shopping-cart" size={20} color="#1D1D2E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1D2E",
    paddingVertical: "5%",
    paddingHorizontal: "4%",
    alignItems: "center",
    justifyContent: "center",
  },
  alert: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3FFFA3",
    flexDirection: "row",
    width: "65%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  textButton: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: "bold",
    color: "#1d1d2e",
  },
});
