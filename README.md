# Collaborative Online Judge System

This is a full-stack project with an Angular based front end, NodeJS based restful API, and docker based code execution engine. Multiple components are created in the front end to allow users to review and add problems and provide solution. The data is passed to the restful API, which in turn saves to MongoDB. Multiple users can also collaborate on problems real-time using websocket.

---

## Project Design

- Scenario: case / interface [Use Case]
  - Problems
    - CRUD (Create, Read, Update, Delete) --- Admin
    - R (Read) --- Users
  - Edit code
    - Collaborative
  - Submit code
    - Execute code
    - Show result

- Necessary: constraint / hypothesis (input)
  - Daily active user
    - 100,000 (assume)
  - Lookup problems --- heaviest (Users)
    - Per day: 100,000 * 100% (function usage) * 3 (function frequency) = 300,000
    - Per second: 300,000 / (3600 * 24) = 3.5
    - Peak per second: 3.5 * 10 = 35
  - Editing
    - Average concurrent users: 100,000 * 60 * 60 / (86400) = 4166 (assume 1 hour/per user one day)
    - Per second: 4000 * 50% (function usage) * 10 (function frequency: send or receive) [collaborate 2-5 users] = 20,000
    - Peak per second: 20,000 * 10 = 200,000 [*one server cannot handle this*]
  - Submit code
    - Per second: 4000 * 1% (function usage) * 1 (function frequency)[*warning if more than one times*] = 40 
    - Peak per second: 40 * 10 = 400 [*run code, too heavy*]

- Application: service / algorithm (Angular 5)

  ![./COJ.jpg](/home/yingqian/CollaborativeOnlineJudgeSystem/COJ.jpg)

- Kilobit: data (output)
  - Editing
    - Per second: 4000 * 50% (function usage) * 10 (function frequency) = 20,000
    - Data Size: 20,000 * 1KB = 20MB [transmission]
  - Submit Code
    - Per second: 4000 * 1% (function usage) * 1 (function frequency) = 40
    - Data Size: 40 * N

- Evolve
  - Can everyone add problem?
    *No. User Management System*
  - What if people are changing one place at the same time?
    *Same time (1 minute?)  Time stamp, machine number*  
  - Easier idea?
    *maker: different color to avoid the possibility*
  - Faster on storing the doc? 
    *Only send updating* 
  - How to isolate? (execute) 
    *Docker*
  - How to scale up?
    *Load Balancer --- Nginx*
  - Fail and stop? 
    *Several servers, Timestamp*
