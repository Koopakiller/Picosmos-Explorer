import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Observer } from "rxjs/Rx";
import { RequestOptions, Http } from "@angular/http";
import { FileViewModel } from "../models/File";

@Injectable()
export class FileSystemService {

    public constructor(
    ) {
    }

    public async getFiles(folder: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            resolve([
                "File1.txt",
                "index.html",
                "README.MD",
                "New Document.docx"
            ]);
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
}

interface IPropertyProvider {
    getValue(fullPath, key);
    supportedKeys: string[];
}

class FilePropertyProvider implements IPropertyProvider {
    public supportedKeys: string[] = [
        "Name",
        "Size",
        "Type"
    ]
    getValue(fullPath: any, key: any) {
        return key;
    }
}

class PathPropertyProvider implements IPropertyProvider {
    public supportedKeys: string[] = [
        "FullPath"
    ]
    getValue(fullPath: any, key: any) {
        if (key === "FullPath") {
            return fullPath;
        }
        throw "Unknown key";
    }
}