const { Ticket, TicketQueue } = require('./ticket');

//Normal cases
describe('Ticket', () => {
  it('should create a ticket with number and timestamp', () => {
    const t = new Ticket(1, '2026-03-19T12:00:00Z');
    expect(t.number).toBe(1);
    expect(t.timestamp).toBe('2026-03-19T12:00:00Z');
  });
});

describe('TicketQueue', () => {
  it('should enqueue and dequeue tickets in order', () => {
    const q = new TicketQueue();
    q.enqueue(new Ticket(1, 't1'));
    q.enqueue(new Ticket(2, 't2'));
    expect(q.dequeue().number).toBe(1);
    expect(q.dequeue().number).toBe(2);
  });

  it('should return undefined when dequeue on empty', () => {
    const q = new TicketQueue();
    expect(q.dequeue()).toBeUndefined();
  });

  it('should report correct size', () => {
    const q = new TicketQueue();
    expect(q.size()).toBe(0);
    q.enqueue(new Ticket(1, 't1'));
    expect(q.size()).toBe(1);
  });

  // Edge cases
  it('should handle enqueueing many tickets', () => {
    const q = new TicketQueue();
    for (let i = 0; i < 1000; i++) q.enqueue(new Ticket(i, 't'));
    expect(q.size()).toBe(1000);
  });

  it('should handle dequeueing all tickets', () => {
    const q = new TicketQueue();
    for (let i = 0; i < 10; i++) q.enqueue(new Ticket(i, 't'));
    for (let i = 0; i < 10; i++) q.dequeue();
    expect(q.isEmpty()).toBe(true);
  });

  it('should handle dequeue on empty repeatedly', () => {
    const q = new TicketQueue();
    q.dequeue();
    q.dequeue();
    expect(q.size()).toBe(0);
  });
});
