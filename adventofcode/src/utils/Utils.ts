export class Utils {
    public static xor(a: boolean, b: boolean) {
        return (a && !b) || (!a && b);
    }
}
