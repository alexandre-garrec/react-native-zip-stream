# react-native-zip-stream

[![npm](https://img.shields.io/npm/v/react-native-zip-stream.svg?style=flat-square)](https://www.npmjs.com/package/react-native-zip-stream)

A React Native module for working with ZIP archives. This module allows you to list the contents of ZIP files, stream files from ZIP archives, create new ZIP files. Now supports password-protected ZIPs.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [List Zip Contents](#list-zip-contents)
  - [Stream File from Zip](#stream-file-from-zip)
  - [Unzip File](#unzip-file)
  - [Create Zip File](#create-zip-file)
- [API Reference](#api-reference)
  - [listZipContents](#listzipcontents)
  - [streamFileFromZip](#streamfilefromzip)
  - [unzipFile](#unzipfile)
  - [createZipFile](#createzipfile)
- [Examples](#examples)
  - [List Zip Contents Example](#list-zip-contents-example)
  - [Stream File from Zip Example](#stream-file-from-zip-example)
  - [Unzip File Example](#unzip-file-example)
  - [Create Zip File Example](#create-zip-file-example)

## Installation

To install the module, follow these steps:

1. Add the dependency to your project:

   ```bash
   npm install react-native-zip-stream
   ```

2. For iOS, install the required CocoaPods dependencies:

   ```bash
   cd ios
   pod install
   ```


## Usage

### List Zip Contents

Lists the contents of a ZIP file. This function returns an array of file names contained within the ZIP archive.

### Stream File from Zip

Streams a specific file from a ZIP archive. You can retrieve the file data in one of three formats: `base64`, `arraybuffer`, or `string`. Now supports password-protected ZIPs.

### Unzip File

Extracts all the contents of a ZIP file to a specified destination directory. Now supports password-protected ZIPs.

### Create Zip File

Creates a new ZIP file from the contents of a specified directory.

## API Reference

### listZipContents

Lists the contents of a ZIP file.

#### Parameters

- `zipFilePath`: `string` - The full path to the ZIP file.

#### Returns

- `Promise<string[]>` - A promise that resolves to an array of file names inside the ZIP file.

### streamFileFromZip

Streams a specific file from the ZIP archive, with optional password support.

#### Parameters

- `zipFilePath`: `string` - The full path to the ZIP file.
- `entryName`: `string` - The name of the file within the ZIP archive to extract.
- `type`: `string` (optional, default: `base64`) - The format in which to return the file data. Can be `base64`, `arraybuffer`, or `string`.
- `password`: `string` (optional) - The password for the ZIP file, if it is encrypted.

#### Returns

- `Promise<string | ArrayBuffer | Uint8Array>` - A promise that resolves to the file content in the specified format.

---

### unzipFile

Extracts all the contents of a password-protected ZIP file to a specified destination directory.

#### Parameters

- `zipFilePath`: `string` - The full path to the ZIP file.
- `destinationPath`: `string` - The path where the contents of the ZIP file should be extracted.
- `password`: `string` (optional) - The password for the ZIP file, if it is encrypted.

#### Returns

- `Promise<boolean>` - A promise that resolves to `true` if the operation is successful.

---

### createZipFile

Creates a new ZIP file from the contents of a specified directory.

#### Parameters

- `destinationPath`: `string` - The full path where the ZIP file should be created.
- `sourcePath`: `string` - The path to the directory or file that should be zipped.

#### Returns

- `Promise<boolean>` - A promise that resolves to `true` if the ZIP file is created successfully.

## Examples

### List Zip Contents Example

```typescript
import { listZipContents } from 'react-native-zip-stream';

const zipFilePath = '/path/to/your/zipfile.zip';

const exampleListZipContents = async () => {
  try {
    const fileNames = await listZipContents(zipFilePath);
    console.log('Files in ZIP:', fileNames);
  } catch (error) {
    console.error('Error listing ZIP contents:', error);
  }
};
```

### Stream File from Password-Protected Zip Example

```typescript
import { streamFileFromZip } from 'react-native-zip-stream';

const zipFilePath = '/path/to/your/zipfile.zip';
const entryName = 'fileInsideZip.txt';
const password = 'yourPassword';

const exampleStreamFile = async () => {
  try {
    const base64Data = await streamFileFromZip(
      zipFilePath,
      entryName,
      'base64',
      password
    );
    console.log('Base64 Data:', base64Data);

    const arrayBufferData = await streamFileFromZip(
      zipFilePath,
      entryName,
      'arraybuffer',
      password
    );
    console.log('ArrayBuffer Data:', new Uint8Array(arrayBufferData));

    const stringData = await streamFileFromZip(
      zipFilePath,
      entryName,
      'string',
      password
    );
    console.log('String Data:', stringData);
  } catch (error) {
    console.error('Error streaming file:', error);
  }
};
```

### Unzip Password-Protected File Example

```typescript
import { unzipFile } from 'react-native-zip-stream';

const zipFilePath = '/path/to/your/zipfile.zip';
const destinationPath = '/path/to/extract/';
const password = 'yourPassword';

const exampleUnzipFile = async () => {
  try {
    const success = await unzipFile(zipFilePath, destinationPath, password);
    console.log('Unzip successful:', success);
  } catch (error) {
    console.error('Error unzipping file:', error);
  }
};
```

### Create Zip File Example

```typescript
import { createZipFile } from 'react-native-zip-stream';

const sourcePath = '/path/to/source/folder';
const destinationPath = '/path/to/output.zip';

const exampleCreateZipFile = async () => {
  try {
    const success = await createZipFile(destinationPath, sourcePath);
    console.log('Zip creation successful:', success);
  } catch (error) {
    console.error('Error creating zip file:', error);
  }
};
```
