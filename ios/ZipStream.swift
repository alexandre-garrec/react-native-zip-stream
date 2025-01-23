import ZipArchive

@objc(ZipStream)
class ZipStream: NSObject {
   @objc
func listZipContents(_ zipFilePath: String, password: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
        let zipFile = ZipArchive()
        
        // Open the ZIP file, with or without a password
        let success: Bool
        if let password = password {
            success = zipFile.unzipOpenFile(zipFilePath, password: password)
        } else {
            success = zipFile.unzipOpenFile(zipFilePath)
        }
        
        if !success {
            throw NSError(domain: "com.zipstream", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to open ZIP file"])
        }
        
        // Retrieve the list of file names from the ZIP file
        let fileNames = zipFile.getZipFileContents()
        zipFile.unzipCloseFile()
        resolve(fileNames)
        
    } catch let error {
        reject("ERROR_LISTING_CONTENTS", "Failed to list contents of the ZIP file", error)
    }
}

   @objc
    func streamFileFromZip(_ zipFilePath: String, entryName: String, type: String, password: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let zipFile = ZipArchive()

            let success: Bool
            if let password = password {
                success = zipFile.unzipOpenFile(zipFilePath, password: password)
            } else {
                success = zipFile.unzipOpenFile(zipFilePath)
            }

            if !success {
                throw NSError(domain: "com.zipstream", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to open ZIP file with provided password"])
            }

            guard let fileData = zipFile.unzipFileToMemory() else {
                throw NSError(domain: "com.zipstream", code: 404, userInfo: [NSLocalizedDescriptionKey: "File not found in ZIP"])
            }

            guard let fileContents = fileData[entryName] as? Data else {
                throw NSError(domain: "com.zipstream", code: 404, userInfo: [NSLocalizedDescriptionKey: "File not found in ZIP"])
            }

            var result: Any?
            if type == "base64" {
                result = fileContents.base64EncodedString()
            } else if type == "arraybuffer" {
                result = [UInt8](fileContents)
            } else if type == "string" {
                if let stringData = String(data: fileContents, encoding: .utf8) {
                    result = stringData
                } else {
                    throw NSError(domain: "com.zipstream", code: 400, userInfo: [NSLocalizedDescriptionKey: "Failed to convert data to string"])
                }
            } else {
                throw NSError(domain: "com.zipstream", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid type specified"])
            }

            zipFile.unzipCloseFile()
            resolve(result)
        } catch let error {
            reject("ERROR_STREAMING_FILE", "Failed to stream the file", error)
        }
    }


    @objc
    func unzipFile(_ zipFilePath: String, destinationPath: String, password: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let zipFile = ZipArchive()

        if let password = password {
            if zipFile.unzipOpenFile(zipFilePath, password: password) {
                let success = zipFile.unzipFile(to: destinationPath, overWrite: true)
                zipFile.unzipCloseFile()

                if success {
                    resolve(true)
                } else {
                    reject("ERROR_UNZIPPING_FILE", "Failed to unzip the file", nil)
                }
            } else {
                reject("ERROR_OPENING_ZIP", "Failed to open ZIP file with password", nil)
            }
        } else {
            if zipFile.unzipOpenFile(zipFilePath) {
                let success = zipFile.unzipFile(to: destinationPath, overWrite: true)
                zipFile.unzipCloseFile()

                if success {
                    resolve(true)
                } else {
                    reject("ERROR_UNZIPPING_FILE", "Failed to unzip the file", nil)
                }
            } else {
                reject("ERROR_OPENING_ZIP", "Failed to open ZIP file", nil)
            }
        }
    }

    @objc
    func createZipFile(_ destinationPath: String, sourcePath: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let zipFile = ZipArchive()
        if zipFile.createZipFile2(destinationPath) {
            if zipFile.addFile(toZip: sourcePath, newname: (sourcePath as NSString).lastPathComponent) {
                zipFile.closeZipFile2()
                resolve(true)
            } else {
                reject("ERROR_ADDING_FILE", "Failed to add file to ZIP", nil)
            }
        } else {
            reject("ERROR_CREATING_ZIP", "Failed to create ZIP file", nil)
        }
    }
}
