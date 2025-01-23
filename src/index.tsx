import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-zip-stream' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ZipStreamModule = NativeModules.ZipStream
  ? NativeModules.ZipStream
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const validateStringParam = (param: string, paramName: string): void => {
  if (typeof param !== 'string' || param.trim() === '') {
    throw new Error(`${paramName} should be a non-empty string.`);
  }
};

// Enhanced logging function
const log = (message: string, error?: any) => {
  if (__DEV__) {
    console.log(`[DEV LOG]: ${message}`);
    if (error) {
      console.error(error);
    }
  } else {
    // In production, you might send logs to a logging service
    // Example: sendLogToService({ message, error });
  }
};

export const listZipContents = async (
  zipFilePath: string,
  password?: string
): Promise<string[]> => {
  validateStringParam(zipFilePath, 'zipFilePath');

  try {
    return await ZipStreamModule.listZipContents(zipFilePath, password || null);
  } catch (error) {
    log('Error listing ZIP contents', error);
    throw error;
  }
};

export const streamFileFromZip = async (
  zipFilePath: string,
  entryName: string,
  type: 'base64' | 'arraybuffer' | 'string' = 'base64',
  password?: string
): Promise<string | ArrayBuffer | Uint8Array> => {
  validateStringParam(zipFilePath, 'zipFilePath');
  validateStringParam(entryName, 'entryName');

  try {
    return await ZipStreamModule.streamFileFromZip(
      zipFilePath,
      entryName,
      type,
      password || null
    );
  } catch (error) {
    log('Error streaming file from ZIP', error);
    throw error;
  }
};

export const unzipFile = async (
  zipFilePath: string,
  destinationPath: string,
  password?: string
): Promise<boolean> => {
  validateStringParam(zipFilePath, 'zipFilePath');
  validateStringParam(destinationPath, 'destinationPath');

  try {
    return await ZipStreamModule.unzipFile(
      zipFilePath,
      destinationPath,
      password || null
    );
  } catch (error) {
    log('Error unzipping file', error);
    throw error;
  }
};

export const createZipFile = async (
  destinationPath: string,
  sourcePath: string,
  password?: string
): Promise<boolean> => {
  validateStringParam(destinationPath, 'destinationPath');
  validateStringParam(sourcePath, 'sourcePath');

  try {
    return await ZipStreamModule.createZipFile(
      destinationPath,
      sourcePath,
      password || null
    );
  } catch (error) {
    log('Error creating ZIP file', error);
    throw error;
  }
};
