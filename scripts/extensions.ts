Array.prototype.pushRange = function <T>(array: T[]) {
    for (let i = 0; i < array.length; i++) {
        this.push(array[i]);
    }
}