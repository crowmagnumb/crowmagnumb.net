export class Utils {
    public static xor(a: boolean, b: boolean) {
        return (a && !b) || (!a && b);
    }

    //
    // NOTE: This is slow so use sparingly.
    //
    public static deepCopy(obj: any) {
        //
        // NOTE: This works with null but not undefined for which it barfs.
        //
        if (obj === undefined) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(obj));
    }
}
