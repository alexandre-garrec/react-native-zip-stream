import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { listZipContents } from 'react-native-zip-stream'; // Assuming the import is correct
import RNFS from 'react-native-fs';

export default function App() {
  // Async function wrapped in useEffect
  const test = async () => {
    try {
      // Check if the file exists before trying to list its contents
      const filePath = `${RNFS.DocumentDirectoryPath}/`;
      const fileExists = await RNFS.exists(filePath);

      if (!fileExists) {
        console.log(`File not found at path: ${filePath}`);
        return;
      }

      const data = await listZipContents(filePath);

      console.log('Contents of the ZIP file:', data);

      // Uncomment if you want to test other functionalities
      // const file = await streamFileFromZip(
      //   `${RNFS.DocumentDirectoryPath}/esmod-1.epub`,
      //   data[0]
      // );
      // console.log('File from ZIP:', file);

      // console.log(`${RNFS.DocumentDirectoryPath}/test`);
      // const unzipResult = await unzipFile(
      //   `${RNFS.DocumentDirectoryPath}/esmod-1.epub`,
      //   `${RNFS.DocumentDirectoryPath}/test`
      // );
      // console.log('Unzipped successfully:', unzipResult);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Use effect to run the test only once when the component mounts
  useEffect(() => {
    test(); // Call test only once on component mount
  }, []); // Empty dependency array ensures this runs only once

  return (
    <View style={styles.container}>
      <Text>Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
