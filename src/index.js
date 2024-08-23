import { NativeModules, NativeEventEmitter } from 'react-native';
// Expose the module from the native code
const { ZipStreamModule } = NativeModules;

// Create an instance of NativeEventEmitter to listen to events
const zipStreamEvents = new NativeEventEmitter(ZipStreamModule);

/**
 * Lists the contents of a ZIP file.
 * @param {string} zipFilePath - Path to the ZIP file.
 * @returns {Promise<Array<string>>} - Promise resolving to an array of file names in the ZIP.
 */
export const listZipContents = (zipFilePath) => {
  return ZipStreamModule.listZipContents(zipFilePath)
    .then((fileNames) => {
      console.log('Files in ZIP:', fileNames);
      return fileNames;
    })
    .catch((error) => {
      console.error('Error listing ZIP contents:', error);
      throw error;
    });
};

/**
 * Streams a specific file from the ZIP.
 * @param {string} zipFilePath - Path to the ZIP file.
 * @param {string} entryName - Name of the file to stream.
 * @param {Function} progressCallback - Callback function to handle streaming progress.
 * @returns {Promise<string>} - Promise resolving when streaming is completed.
 */
export const streamFileFromZip = async (zipFilePath, entryName) => {
  try {
    const base64Data = await new Promise((resolve, reject) => {
      ZipStreamModule.streamFileFromZip(
        zipFilePath,
        entryName,
        resolve,
        reject
      );
    });
    return base64Data;
  } catch (error) {
    console.error('Error streaming file from ZIP:', error);
    throw error;
  }
};

/**
 * Example usage of listening to events emitted by the native module.
 * @param {Function} eventCallback - Callback to handle events from the native module.
 */
export const subscribeToEvents = (eventCallback) => {
  const eventSubscription = zipStreamEvents.addListener('EventName', (event) => {
    if (eventCallback) {
      eventCallback(event);
    }
  });

  // Clean up the subscription when no longer needed
  return () => {
    eventSubscription.remove();
  };
};