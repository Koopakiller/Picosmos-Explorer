export class Formatter {
    public static formatByteSize(bytes: number): string {
        if (bytes === 0) {
            return `0 B`;
        }
        const overhang = 10;
        let isNegative = bytes < 0;
        bytes = Math.abs(bytes);
        if (bytes < 1024 * overhang) {
            return `${isNegative?"-":""}${Math.ceil(bytes)} B`;
        }
        bytes /= 1024;
        if (bytes < 1024 * overhang) {
            return `${isNegative?"-":""}${Math.ceil(bytes)} KiB`;
        }
        bytes /= 1024;
        if (bytes < 1024 * overhang) {
            return `${isNegative?"-":""}${Math.ceil(bytes)} MiB`;
        }
        bytes /= 1024;
        if (bytes < 1024 * overhang) {
            return `${isNegative?"-":""}${Math.ceil(bytes)} GiB`;
        }
        bytes /= 1024;
        return `${isNegative?"-":""}${Math.ceil(bytes)} TiB`;
    }
}