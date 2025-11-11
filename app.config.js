export default {
  expo: {
    name: "beside-mobile",
    slug: "beside-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.beside.mobile",
      buildNumber: "3"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.beside.mobile",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiUrl: process.env.API_URL || "https://beside-backend-production.up.railway.app/api/v1",
      eas: {
        projectId: "9073d3db-6296-43a4-82ff-0299e8b2af04"
      }
    }
  }
};

