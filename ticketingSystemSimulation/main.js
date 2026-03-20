const { Ticket, TicketQueue } = require('./ticket');

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTickets(queue, count) {
  for (let i = 1; i <= count; i++) {
    const ticket = new Ticket(i, new Date().toISOString());
    queue.enqueue(ticket);
    console.log(`Generated Ticket #${ticket.number} at ${ticket.timestamp}`);
  }
}

function processTickets(queue) {
  while (!queue.isEmpty()) {
    const ticket = queue.dequeue();
    console.log(`Serving Ticket #${ticket.number} (issued at ${ticket.timestamp})`);
  }
}

// Example usage
const queue = new TicketQueue();
generateTickets(queue, 5);
processTickets(queue);
