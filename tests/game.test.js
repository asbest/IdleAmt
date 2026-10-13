const test = require('node:test');
const assert = require('node:assert/strict');
const { IdleAmtGame } = require('../game.js');

test('IdleAmtGame initial state has 1 starting officer', () => {
    const game = new IdleAmtGame();
    assert.equal(game.officers.length, 1);
    assert.equal(game.money, 0);
    assert.equal(game.tasksCompleted, 0);
    assert.equal(game.civQueue.length, 0);
});

test('addCivilianTask adds task up to queue max capacity', () => {
    const game = new IdleAmtGame();
    assert.equal(game.civQueue.length, 0);

    const added = game.addCivilianTask();
    assert.equal(added, true);
    assert.equal(game.civQueue.length, 1);

    for (let i = 0; i < 20; i++) {
        game.addCivilianTask();
    }
    assert.equal(game.civQueue.length, game.maxCivQueue);
});

test('Officer takes task from civilian queue during update tick', () => {
    const game = new IdleAmtGame();
    game.addCivilianTask();
    assert.equal(game.civQueue.length, 1);

    game.update(0.1);
    assert.equal(game.civQueue.length, 0);
    assert.equal(game.officers[0].status, 'working');
    assert.ok(game.officers[0].currentTask);
});

test('Officer completes task and earns money', () => {
    const game = new IdleAmtGame();
    game.addCivilianTask();
    const reward = game.civQueue[0].reward;

    game.update(0.1); // officer picks up task
    const duration = game.officers[0].duration;

    game.update(duration + 0.1); // officer finishes task
    assert.equal(game.officers[0].status, 'idle');
    assert.ok(game.tasksCompleted >= 1);
    assert.ok(game.money >= reward);
});

test('Officer delegates task to consultant', () => {
    const game = new IdleAmtGame();
    game.addConsultant('Consultant #1');
    game.addCivilianTask();

    game.update(0.1); // officer takes task
    assert.equal(game.officers[0].status, 'working');

    const delegated = game.delegateTaskToConsultant(game.officers[0].id, game.consultants[0].id);
    assert.equal(delegated, true);
    assert.equal(game.officers[0].status, 'idle');
    assert.equal(game.consultants[0].status, 'working');

    // Finish consultant work
    const cDuration = game.consultants[0].duration;
    game.update(cDuration + 0.5);

    assert.equal(game.consultants[0].status, 'idle');
    assert.ok(game.tasksCompleted >= 1);
    assert.ok(game.money > 0);
});

test('Hiring officer increases cost dynamically', () => {
    const game = new IdleAmtGame();
    game.money = 1000;
    const initialCost = game.getOfficerCost();

    const hired = game.hireOfficer();
    assert.equal(hired, true);
    assert.equal(game.officers.length, 2);
    assert.ok(game.getOfficerCost() > initialCost);
});

test('Upgrades modify costs and values', () => {
    const game = new IdleAmtGame();
    game.money = 1000;

    const bought = game.buyUpgrade('officerEfficiency');
    assert.equal(bought, true);
    assert.equal(game.upgrades.officerEfficiency.level, 1);
});

test('Serialization save and load restores game state', () => {
    const game = new IdleAmtGame();
    game.money = 500;
    game.tasksCompleted = 12;
    const upgCost = game.getUpgradeCost('civSpawnRate');
    game.buyUpgrade('civSpawnRate');

    const expectedMoney = 500 - upgCost;
    const state = game.saveState();

    const newGame = new IdleAmtGame();
    newGame.loadState(state);

    assert.equal(newGame.money, expectedMoney);
    assert.equal(newGame.tasksCompleted, 12);
    assert.equal(newGame.upgrades.civSpawnRate.level, 1);
});
