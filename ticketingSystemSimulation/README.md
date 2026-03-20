# Ticketing System Simulation (Draft)

## Objective
Implement a queue to manage a ticketing system where users take a number and wait for their turn to be served.

## Features
- Ticket class with ticket number and timestamp

- Generate ticket phase: simulate arrival of customers by generating ticket objects and adding them to the queue.

- Process tickets phase: implement a system where tickets are dequeued and "served" by displaying the details of the ticket being processed.

- Timing: introduce a simple form of timing where tickets are generated at random intervals, and the serving time may vary slightly.


## Clarifying Questions
1. Should the system support concurrent ticket processing?
2. Is there a maximum queue length or should it be unbounded?
3. Should tickets have additional metadata (e.g., customer name, service type)?
4. Should the simulation persist data or is it in-memory only?
5. What is the expected range for random timing intervals?

## Time and Space Complexity

### Ticket Generation
- Time: O(n) for n tickets
- Space: O(n) for queue storage

### Ticket Processing
- Time: O(n) for n tickets
- Space: O(1) (queue shrinks as tickets are served)