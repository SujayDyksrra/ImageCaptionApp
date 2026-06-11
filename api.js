// api.js
// REPLACE WITH YOUR COMPUTER'S LOCAL IP ADDRESS (e.g., '192.168.1.50') IF TESTING ON A REAL PHONE
const BASE_URL = 'http://10.0.2.2:8000'; // '10.0.2.2' is the gateway to your computer's localhost in the Android Emulator


// 1. Add a new state variable for the base64 data
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); // <-- NEW

  // 2. Update your Image Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5, // Important: Compress the image so the API request isn't too large
      base64: true, // Tell Expo to extract the raw data
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // For displaying on the screen
      setImageBase64(result.assets[0].base64); // For sending to the AI
    }
  };



