// Ticket class and queue logic
class Ticket {
  constructor(number, timestamp) {
    this.number = number;
    this.timestamp = timestamp;
  }
}

class TicketQueue {
  constructor() {
    this.queue = [];
  }
  enqueue(ticket) {
    this.queue.push(ticket);
  }
  dequeue() {
    return this.queue.shift();
  }
  isEmpty() {
    return this.queue.length === 0;
  }
  size() {
    return this.queue.length;
  }
}

module.exports = { Ticket, TicketQueue };
