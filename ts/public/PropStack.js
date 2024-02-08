export class Stack {
    constructor() {
        this.props = [];
    }
    push(item) {
        this.props.push(item);
    }
    pop() {
        return this.props.pop();
    }
    peek() {
        return this.props[this.props.length - 1];
    }
    isEmpty() {
        return this.props.length === 0;
    }
    size() {
        return this.props.length;
    }
}
