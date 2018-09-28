import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Observer } from "rxjs/Rx";
import { RequestOptions, Http } from "@angular/http";
import { FileViewModel } from "../models/File";
import { Formatter } from "../helper/Formatter";
//import * as fs from "fs";
const fs = (<any>window).require("fs");
const path = (<any>window).require("path");

@Injectable()
export class FileSystemService {
    public constructor(
    ) {
    }

    getParent(fullPath: string) {
        return path.resolve(fullPath, '..');
    }

    public async getContents(fullPath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            try {
                let contents = fs.readdirSync(fullPath);
                contents = contents.map(entry => path.join(fullPath, entry));
                resolve(contents);
            }
            catch (ex) {
                reject(ex);
            }
        })
    }

    private propertyProvider: IPropertyProvider[] = [
        new FilePropertyProvider(),
        new PathPropertyProvider()
    ]

    public getProperty(fullPath: string, key: string) {
        for (let provider of this.propertyProvider) {
            if (provider.supportedKeys.indexOf(key) > -1) {
                return provider.getValue(fullPath, key);
            }
        }
        throw "No provider found";
    }

    public hasContent(fullPath: string) {
        const stats = fs.statSync(fullPath);
        return stats.isDirectory();
    }

    public isFile(fullPath: string) {
        const stats = fs.statSync(fullPath);
        return stats.isFile();
    }
}

interface IPropertyProvider {
    getValue(fullPath, key): string;
    supportedKeys: string[];
}

class FilePropertyProvider implements IPropertyProvider {
    public supportedKeys: string[] = [
        "Name",
        "Size",
        "Type"
    ]
    getValue(fullPath: string, key: string): string {
        if (key === "Name") {
            return fullPath.substr(Math.max(fullPath.lastIndexOf("/"), fullPath.lastIndexOf("\\")) + 1);
        }

        try {
            //? https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats
            const stats = fs.statSync(fullPath)
            switch (key) {
                case "Size":
                    if (stats.isFile()) {
                        return Formatter.formatByteSize(stats.size);
                    }
                    return "";
                case "Type":
                    if (stats.isFile()) {
                        return "File";
                    }
                    if (stats.isDirectory()) {
                        return "Directory";
                    }
                    if (stats.isSymbolicLink()) {
                        return "Symbolic Link";
                    }
                    if (stats.isSocket()) {
                        return "Socket";
                    }
                    if (stats.isFIFO()) {
                        return "Named Pipe";
                    }
                    if (stats.isCharacterDevice()) {
                        return "Character Device";
                    }
                    if (stats.isBlockDevice()) {
                        return "Block Device";
                    }
                    return "Unknown";
            }
        }
        catch (ex) {
            return null;
        }

        throw "Unknown key";
    }
}

class PathPropertyProvider implements IPropertyProvider {
    public supportedKeys: string[] = [
        "FullPath"
    ]
    getValue(fullPath: string, key: string): string {
        if (key === "FullPath") {
            return fullPath;
        }
        throw "Unknown key";
    }
}