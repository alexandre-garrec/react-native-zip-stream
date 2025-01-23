package com.zipstream

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import net.lingala.zip4j.ZipFile
import net.lingala.zip4j.exception.ZipException
import net.lingala.zip4j.model.FileHeader
import net.lingala.zip4j.model.ZipParameters
import net.lingala.zip4j.model.enums.EncryptionMethod
import net.lingala.zip4j.model.enums.CompressionLevel
import java.io.ByteArrayOutputStream
import java.io.File
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray

class ZipStreamModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ZipStream"
    }

@ReactMethod
fun listZipContents(zipFilePath: String, promise: Promise, password: String?) {
    try {
        val zipFile = ZipFile(zipFilePath)
        if (zipFile.isEncrypted && password != null) {
            zipFile.setPassword(password.toCharArray())
        }

        val fileHeaders = zipFile.fileHeaders
        val fileNames = ArrayList<String>()

        for (fileHeader in fileHeaders) {
            fileNames.add(fileHeader.fileName)
        }

        // Convert ArrayList<String> to WritableArray
        val writableArray: WritableArray = Arguments.createArray()
        for (fileName in fileNames) {
            writableArray.pushString(fileName)
        }

        promise.resolve(writableArray)
    } catch (e: ZipException) {
        promise.reject("ERROR_LISTING_CONTENTS", "Failed to list contents of the ZIP file", e)
    }
}
@ReactMethod
fun streamFileFromZip(zipFilePath: String, entryName: String, password: String?, type: String, promise: Promise) {
    try {
        val zipFile = ZipFile(zipFilePath)
        if (zipFile.isEncrypted && password != null) {
            zipFile.setPassword(password.toCharArray())
        }

        val fileHeader = zipFile.getFileHeader(entryName)
        if (fileHeader == null) {
            promise.reject("ERROR_STREAMING_FILE", "File not found in ZIP")
            return
        }

        val inputStream = zipFile.getInputStream(fileHeader)
        val byteArrayOutputStream = ByteArrayOutputStream()

        val buffer = ByteArray(4096)
        var length: Int
        while (inputStream.read(buffer).also { length = it } != -1) {
            byteArrayOutputStream.write(buffer, 0, length)
        }

        val fileContents = byteArrayOutputStream.toByteArray()

        when (type) {
            "base64" -> {
                val base64Data = android.util.Base64.encodeToString(fileContents, android.util.Base64.NO_WRAP)
                promise.resolve(base64Data)
            }
            "arraybuffer" -> promise.resolve(fileContents)
            "string" -> {
                val stringData = String(fileContents, Charsets.UTF_8)
                promise.resolve(stringData)
            }
            else -> promise.reject("ERROR_STREAMING_FILE", "Invalid type specified")
        }
    } catch (e: Exception) {
        promise.reject("ERROR_STREAMING_FILE", "Failed to stream the file", e)
    }
}


    @ReactMethod
    fun unzipFile(zipFilePath: String, destinationPath: String, password: String?, promise: Promise) {
        try {
            val zipFile = ZipFile(zipFilePath)
            if (zipFile.isEncrypted && password != null) {
                zipFile.setPassword(password.toCharArray())
            }
            zipFile.extractAll(destinationPath)
            promise.resolve(true)
        } catch (e: ZipException) {
            promise.reject("ERROR_UNZIPPING_FILE", "Failed to unzip the file", e)
        }
    }

    @ReactMethod
    fun createZipFile(destinationPath: String, sourcePath: String, password: String?, promise: Promise) {
        try {
            val zipFile = ZipFile(destinationPath)
            val parameters = ZipParameters()
            parameters.compressionLevel = CompressionLevel.NORMAL

            if (password != null && password.isNotEmpty()) {
                parameters.isEncryptFiles = true
                parameters.encryptionMethod = EncryptionMethod.ZIP_STANDARD
            }

            val sourceFile = File(sourcePath)
            if (sourceFile.isDirectory) {
                zipFile.addFolder(sourceFile, parameters)
            } else {
                zipFile.addFile(sourceFile, parameters)
            }

            if (password != null && password.isNotEmpty()) {
                zipFile.setPassword(password.toCharArray())
            }

            promise.resolve(true)
        } catch (e: ZipException) {
            promise.reject("ERROR_CREATING_ZIP", "Failed to create ZIP file", e)
        }
    }
}
