import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Observer } from "rxjs/Rx";
import { RequestOptions, Http } from "@angular/http";
import { FileViewModel } from "../models/File";
//import * as fs from "fs";
const fs = (<any>window).require("fs");
const path = (<any>window).require("path");

@Injectable()
export class FileSystemService {

    public constructor(
    ) {
    }

    public async getContents(fullPath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            let contents = fs.readdirSync(fullPath);
            contents = contents.map(entry => path.join(fullPath, entry));
            resolve(contents);
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
    getValue(fullPath, key): any;
    supportedKeys: string[];
}

class FilePropertyProvider implements IPropertyProvider {
    public supportedKeys: string[] = [
        "Name",
        "Size"
    ]
    getValue(fullPath: string, key: string): any {
        switch (key) {
            case "Size":
                const stats = fs.statSync(fullPath)
                return stats.size;
            case "Name":
                return fullPath.substr(Math.max(fullPath.lastIndexOf("/"), fullPath.lastIndexOf("\\")) + 1);
        }
        throw "Unknown key";
    }
}

class PathPropertyProvider implements IPropertyProvider {
    public supportedKeys: string[] = [
        "FullPath"
    ]
    getValue(fullPath: string, key: string): any {
        if (key === "FullPath") {
            return fullPath;
        }
        throw "Unknown key";
    }
}