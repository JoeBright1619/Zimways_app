import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors_fonts from "../../constants/colors_fonts";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';



const stages = ["Paid", "Order Placed", "Preparing", "Picked Up", "Delivered"];

// helper function: map backend status -> progress indices
// returns { completedIndex, currentIndex, isFailed, failedIndex }
// completedIndex: highest stage index that is fully completed (green)
// currentIndex: stage index currently in progress (shows 'waiting...'). -1 if none.
// isFailed: whether the order ended in a failed/cancelled terminal state
// failedIndex: stage index where failure is shown (red cross)
const getProgress = (
  status: string
): {
  completedIndex: number;
  currentIndex: number;
  isFailed: boolean;
  failedIndex: number;
} => {
  switch (status) {
    // Payment flow
    case "PAYMENT_PENDING":
    case "PAYMENT_PROCESSING":
      return {
        completedIndex: -1,
        currentIndex: 0,
        isFailed: false,
        failedIndex: -1,
      };
    case "PAYMENT_COMPLETED":
      return {
        completedIndex: 0,
        currentIndex: 1,
        isFailed: false,
        failedIndex: -1,
      };

    // Order placed and prep
    case "CONFIRMED":
    case "PREPARING":
      return {
        completedIndex: 1,
        currentIndex: 2,
        isFailed: false,
        failedIndex: -1,
      };

    // Ready for pickup / driver states → waiting at Picked Up
    case "READY_FOR_PICKUP":
    case "DRIVER_ASSIGNED":
    case "DRIVER_EN_ROUTE":
      return {
        completedIndex: 2,
        currentIndex: 3,
        isFailed: false,
        failedIndex: -1,
      };

    // Picked up / out for delivery → waiting at Delivered
    case "DRIVER_PICKED_UP":
    case "OUT_FOR_DELIVERY":
      return {
        completedIndex: 3,
        currentIndex: 4,
        isFailed: false,
        failedIndex: -1,
      };

    // Delivery done
    case "DELIVERED":
    case "COMPLETED":
      return {
        completedIndex: 4,
        currentIndex: -1,
        isFailed: false,
        failedIndex: -1,
      };

    // Cancellations / terminal failures → show a red cross at a sensible stage
    case "PAYMENT_FAILED":
    case "CANCELLED_BY_CUSTOMER":
    case "REFUNDED":
      // Typically cancelled after placing but before preparing
      return {
        completedIndex: -1,
        currentIndex: -1,
        isFailed: true,
        failedIndex:0,
      };
    case "CANCELLED_BY_RESTAURANT":
      // Typically during preparing
      return {
        completedIndex: 0,
        currentIndex: -1,
        isFailed: true,
        failedIndex: 1,
      };
    case "FAILED":
    case "CANCELLED_BY_SYSTEM":
      // Often during pickup/delivery logistics
      return {
        completedIndex: 2,
        currentIndex: -1,
        isFailed: true,
        failedIndex: 3,
      };
    

    default:
      return {
        completedIndex: -1,
        currentIndex: -1,
        isFailed: false,
        failedIndex: -1,
      };
  }
};

const getIcon = (stage: string)=>{
  switch(stage){
    case "Paid":
      return <Ionicons name="cash-outline" size={20} color="black" />
    case  "Order Placed":
      return <MaterialCommunityIcons name="check" size={20} color="black" />
    case "Preparing":
      return <Ionicons name="hourglass-outline" size={20} color="black" />
    case "Picked Up":
      return <MaterialCommunityIcons name="truck-fast-outline" size={20} color="black" />
    case "Delivered":
      return <FontAwesome6 name="people-carry-box" size={15} color="black" />
  }
}
const OrderProgress = ({ status }: { status: string }) => {
  const { completedIndex, currentIndex, isFailed, failedIndex } =
    getProgress(status);

  return (
    <View style={styles.container}>
      {stages.map((stage, index) => {
        const showFailed = isFailed && index === failedIndex;
        const showWaiting = !isFailed && index === currentIndex;
        return (
          <View key={stage} style={styles.stageContainer}>
            {/* Circle */}
            <View
              style={[
                styles.circle,
                index <= completedIndex
                  ? styles.circleActive
                  : styles.circleInactive,
                showFailed ? styles.circleFailed : null,
              ]}
            >
              {getIcon(stage)}
              {showFailed && <Text style={styles.cross}>✕</Text>}
            </View>

            {/* Label */}
            <Text style={[styles.label, showFailed ? styles.failedText : null]}>
              {stage}
            </Text>

            {/* Waiting or Failed text for the current stage */}
            {showFailed && <Text style={styles.failedText}>failed</Text>}
            {showWaiting && <Text style={styles.waiting}>waiting...</Text>}

            {/* Connector line */}
            {index < stages.length - 1 && <View style={styles.line} />}
          </View>
        );
      })}
    </View>
  );
};

export default OrderProgress;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 20,
  },
  stageContainer: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  circleActive: {
    backgroundColor: colors_fonts.tertiary,
  },
  circleInactive: {
    backgroundColor: "lightgray",
  },
  circleFailed: {
    backgroundColor: colors_fonts.secondary,
  },
  cross: {
    color: "white",
    fontSize: 12,
    lineHeight: 12,
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
  waiting: {
    fontSize: 10,
    color: "red",
    marginTop: 2,
    textAlign: "center",
  },
  failedText: {
    fontSize: 10,
    color: "red",
    marginTop: 2,
    textAlign: "center",
    textTransform: "lowercase",
  },
  line: {
    position: "absolute",
    top: 10,
    left: "50%",
    height: 2,
    width: "100%",
    backgroundColor: "lightgray",
    zIndex: -1,
  },
});
