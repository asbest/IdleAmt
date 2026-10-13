/**
 * IdleAmt - Office Simulation Idle Game Engine
 */

class IdleAmtGame {
    constructor() {
        this.money = 0;
        this.tasksCompleted = 0;
        this.reputation = 100;

        // Civilian queue settings
        this.civQueue = [];
        this.maxCivQueue = 10;
        this.civArrivalTimer = 0;
        this.civArrivalInterval = 3; // seconds
        this.taskBaseReward = 20;

        // Officers
        this.officers = [];
        this.officerBaseCost = 50;

        // Consultants
        this.consultants = [];
        this.consultantBaseCost = 150;

        // Upgrades
        this.upgrades = {
            civSpawnRate: {
                id: 'civSpawnRate',
                name: 'Civilian Hotline',
                desc: 'Speed up civilian queue arrival by 20%.',
                level: 0,
                maxLevel: 10,
                baseCost: 30,
                costMult: 1.8
            },
            officerEfficiency: {
                id: 'officerEfficiency',
                name: 'Coffee Machine',
                desc: 'Officers process tasks 25% faster.',
                level: 0,
                maxLevel: 10,
                baseCost: 100,
                costMult: 2.0
            },
            autoDelegation: {
                id: 'autoDelegation',
                name: 'Bureaucracy Protocol',
                desc: 'Officers automatically delegate tasks to available consultants.',
                level: 0,
                maxLevel: 1,
                baseCost: 250,
                costMult: 1
            },
            consultantSkill: {
                id: 'consultantSkill',
                name: 'Outsourcing MBA',
                desc: 'Consultants earn 50% more reward per task completed.',
                level: 0,
                maxLevel: 10,
                baseCost: 200,
                costMult: 2.2
            }
        };

        this.lastTimestamp = Date.now();
        this.isBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';
        this.initDefaultState();
    }

    initDefaultState() {
        if (this.officers.length === 0) {
            // Give 1 starting officer so game is playable out of the box
            this.addOfficer('Officer #1');
        }
    }

    // Helper to format currency
    formatMoney(val) {
        return '$' + Math.floor(val).toLocaleString();
    }

    // --- Core Operations ---

    addCivilianTask() {
        if (this.civQueue.length >= this.maxCivQueue) {
            return false;
        }
        const taskId = 'task_' + Math.random().toString(36).substring(2, 9);
        const rewardMultiplier = 1 + (Math.random() * 0.5); // 1.0x to 1.5x
        const duration = 2.0 + Math.random() * 2.0; // 2 to 4 seconds work time
        const task = {
            id: taskId,
            title: `Request #${Math.floor(Math.random() * 899 + 100)}`,
            reward: Math.round(this.taskBaseReward * rewardMultiplier),
            duration: duration,
            progress: 0
        };
        this.civQueue.push(task);
        return true;
    }

    getOfficerCost() {
        return Math.floor(this.officerBaseCost * Math.pow(1.5, this.officers.length));
    }

    addOfficer(name = null) {
        const cost = this.getOfficerCost();
        const id = 'officer_' + (this.officers.length + 1);
        const officer = {
            id: id,
            name: name || `Officer #${this.officers.length + 1}`,
            status: 'idle', // 'idle', 'working', 'delegated'
            currentTask: null,
            progress: 0,
            duration: 3.0 // Default 3s processing time
        };
        this.officers.push(officer);
        return officer;
    }

    hireOfficer() {
        const cost = this.getOfficerCost();
        if (this.money >= cost) {
            this.money -= cost;
            this.addOfficer();
            return true;
        }
        return false;
    }

    getConsultantCost() {
        return Math.floor(this.consultantBaseCost * Math.pow(1.6, this.consultants.length));
    }

    addConsultant(name = null) {
        const id = 'consultant_' + (this.consultants.length + 1);
        const consultant = {
            id: id,
            name: name || `Consultant #${this.consultants.length + 1}`,
            status: 'idle', // 'idle', 'working'
            currentTask: null,
            progress: 0,
            duration: 4.0 // Default 4s task work time
        };
        this.consultants.push(consultant);
        return consultant;
    }

    hireConsultant() {
        const cost = this.getConsultantCost();
        if (this.money >= cost) {
            this.money -= cost;
            this.addConsultant();
            return true;
        }
        return false;
    }

    getUpgradeCost(upgradeKey) {
        const upg = this.upgrades[upgradeKey];
        if (!upg) return Infinity;
        return Math.floor(upg.baseCost * Math.pow(upg.costMult, upg.level));
    }

    buyUpgrade(upgradeKey) {
        const upg = this.upgrades[upgradeKey];
        if (!upg) return false;
        if (upg.level >= upg.maxLevel) return false;
        const cost = this.getUpgradeCost(upgradeKey);
        if (this.money >= cost) {
            this.money -= cost;
            upg.level += 1;
            return true;
        }
        return false;
    }

    // --- Officer & Consultant Actions ---

    assignTaskToOfficer(officerId) {
        const officer = this.officers.find(o => o.id === officerId);
        if (!officer || officer.status !== 'idle' || this.civQueue.length === 0) {
            return false;
        }
        const task = this.civQueue.shift();
        officer.status = 'working';
        officer.currentTask = task;
        officer.progress = 0;
        officer.duration = task.duration;
        return true;
    }

    delegateTaskToConsultant(officerId, consultantId = null) {
        const officer = this.officers.find(o => o.id === officerId);
        if (!officer || officer.status !== 'working' || !officer.currentTask) {
            return false;
        }

        let consultant = null;
        if (consultantId) {
            consultant = this.consultants.find(c => c.id === consultantId && c.status === 'idle');
        } else {
            consultant = this.consultants.find(c => c.status === 'idle');
        }

        if (!consultant) return false;

        const task = officer.currentTask;
        officer.currentTask = null;
        officer.status = 'idle';

        consultant.status = 'working';
        consultant.currentTask = task;
        consultant.progress = 0;
        consultant.duration = task.duration * 0.8; // Consultants handle tasks faster
        return true;
    }

    // --- Game Loop Update ---

    update(dt) { // dt in seconds
        if (dt <= 0) return;

        // 1. Civilian Queue Spawning
        const spawnMultiplier = 1 + (this.upgrades.civSpawnRate.level * 0.2);
        const actualInterval = this.civArrivalInterval / spawnMultiplier;

        this.civArrivalTimer += dt;
        while (this.civArrivalTimer >= actualInterval) {
            this.civArrivalTimer -= actualInterval;
            this.addCivilianTask();
        }

        // 2. Auto Officer Assignment (if idle officer available and tasks in queue)
        for (const officer of this.officers) {
            if (officer.status === 'idle' && this.civQueue.length > 0) {
                this.assignTaskToOfficer(officer.id);
            }
        }

        // 3. Officer Processing & Auto Delegation
        const officerSpeedMult = 1 + (this.upgrades.officerEfficiency.level * 0.25);
        for (const officer of this.officers) {
            if (officer.status === 'working' && officer.currentTask) {
                // Auto Delegation if unlocked
                if (this.upgrades.autoDelegation.level > 0) {
                    const freeConsultant = this.consultants.find(c => c.status === 'idle');
                    if (freeConsultant) {
                        this.delegateTaskToConsultant(officer.id, freeConsultant.id);
                        continue;
                    }
                }

                // If not delegated, officer works on task directly
                officer.progress += dt * officerSpeedMult;
                if (officer.progress >= officer.duration) {
                    // Task Completed by Officer
                    this.money += officer.currentTask.reward;
                    this.tasksCompleted += 1;
                    officer.currentTask = null;
                    officer.status = 'idle';
                    officer.progress = 0;
                }
            }
        }

        // 4. Consultant Work Processing
        const consultantBonus = 1 + (this.upgrades.consultantSkill.level * 0.5);
        for (const consultant of this.consultants) {
            if (consultant.status === 'working' && consultant.currentTask) {
                consultant.progress += dt * 1.2; // Consultants work at 1.2x base speed
                if (consultant.progress >= consultant.duration) {
                    // Task Completed by Consultant
                    this.money += consultant.currentTask.reward * consultantBonus;
                    this.tasksCompleted += 1;
                    consultant.currentTask = null;
                    consultant.status = 'idle';
                    consultant.progress = 0;
                }
            }
        }
    }

    calculateIncomeRate() {
        // Approximate current income rate per second
        let rate = 0;
        const officerSpeedMult = 1 + (this.upgrades.officerEfficiency.level * 0.25);
        for (const officer of this.officers) {
            if (officer.status === 'working' && officer.currentTask) {
                rate += officer.currentTask.reward / officer.duration * officerSpeedMult;
            }
        }
        const consultantBonus = 1 + (this.upgrades.consultantSkill.level * 0.5);
        for (const consultant of this.consultants) {
            if (consultant.status === 'working' && consultant.currentTask) {
                rate += (consultant.currentTask.reward * consultantBonus) / consultant.duration * 1.2;
            }
        }
        return rate;
    }

    // --- Serialization & Storage ---

    saveState() {
        const state = {
            money: this.money,
            tasksCompleted: this.tasksCompleted,
            reputation: this.reputation,
            civQueue: this.civQueue,
            officers: this.officers,
            consultants: this.consultants,
            upgrades: Object.fromEntries(
                Object.entries(this.upgrades).map(([k, v]) => [k, { level: v.level }])
            ),
            lastTimestamp: Date.now()
        };
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('idleAmt_save', JSON.stringify(state));
        }
        return state;
    }

    loadState(savedState = null) {
        let state = savedState;
        if (!state && typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem('idleAmt_save');
            if (raw) {
                try {
                    state = JSON.parse(raw);
                } catch (e) {
                    console.error('Failed to parse save state', e);
                }
            }
        }

        if (!state) return false;

        this.money = state.money || 0;
        this.tasksCompleted = state.tasksCompleted || 0;
        this.reputation = state.reputation || 100;
        this.civQueue = state.civQueue || [];
        this.officers = state.officers || [];
        this.consultants = state.consultants || [];

        if (state.upgrades) {
            for (const key in state.upgrades) {
                if (this.upgrades[key]) {
                    this.upgrades[key].level = state.upgrades[key].level || 0;
                }
            }
        }

        // Process Offline Progress if timestamp present
        if (state.lastTimestamp) {
            const elapsedSeconds = Math.min((Date.now() - state.lastTimestamp) / 1000, 3600 * 12); // Max 12h offline
            if (elapsedSeconds > 1) {
                this.update(elapsedSeconds);
            }
        }

        this.initDefaultState();
        return true;
    }

    resetState() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('idleAmt_save');
        }
        this.money = 0;
        this.tasksCompleted = 0;
        this.reputation = 100;
        this.civQueue = [];
        this.officers = [];
        this.consultants = [];
        for (const key in this.upgrades) {
            this.upgrades[key].level = 0;
        }
        this.initDefaultState();
    }
}

// Browser UI Controller
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const game = new IdleAmtGame();
        game.loadState();

        // UI Element bindings
        const elMoney = document.getElementById('stat-money');
        const elIncome = document.getElementById('stat-income');
        const elTasks = document.getElementById('stat-tasks');
        const elReputation = document.getElementById('stat-reputation');
        const elCivBadge = document.getElementById('civ-count-badge');
        const elCivQueue = document.getElementById('civ-queue-list');
        const elBtnInviteCiv = document.getElementById('btn-invite-civ');
        const elCivArrivalRate = document.getElementById('civ-arrival-rate');

        const elOfficerBadge = document.getElementById('officer-count-badge');
        const elBtnHireOfficer = document.getElementById('btn-hire-officer');
        const elOfficerCost = document.getElementById('officer-cost');
        const elOfficersList = document.getElementById('officers-list');

        const elConsultantBadge = document.getElementById('consultant-count-badge');
        const elBtnHireConsultant = document.getElementById('btn-hire-consultant');
        const elConsultantCost = document.getElementById('consultant-cost');
        const elConsultantsList = document.getElementById('consultants-list');

        const elUpgradesList = document.getElementById('upgrades-list');
        const elBtnSave = document.getElementById('btn-save');
        const elBtnReset = document.getElementById('btn-reset');

        // Event Handlers
        if (elBtnInviteCiv) {
            elBtnInviteCiv.addEventListener('click', () => {
                game.addCivilianTask();
                render();
            });
        }

        if (elBtnHireOfficer) {
            elBtnHireOfficer.addEventListener('click', () => {
                if (game.hireOfficer()) {
                    render();
                }
            });
        }

        if (elBtnHireConsultant) {
            elBtnHireConsultant.addEventListener('click', () => {
                if (game.hireConsultant()) {
                    render();
                }
            });
        }

        if (elBtnSave) {
            elBtnSave.addEventListener('click', () => {
                game.saveState();
                alert('Game state saved successfully!');
            });
        }

        if (elBtnReset) {
            elBtnReset.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all game progress?')) {
                    game.resetState();
                    render();
                }
            });
        }

        function render() {
            // Stats
            if (elMoney) elMoney.textContent = game.formatMoney(game.money);
            if (elIncome) elIncome.textContent = '$' + game.calculateIncomeRate().toFixed(1) + '/s';
            if (elTasks) elTasks.textContent = game.tasksCompleted;
            if (elReputation) elReputation.textContent = game.reputation + '%';

            // Civilians
            if (elCivBadge) elCivBadge.textContent = `${game.civQueue.length} / ${game.maxCivQueue}`;
            const spawnMult = 1 + (game.upgrades.civSpawnRate.level * 0.2);
            const interval = (game.civArrivalInterval / spawnMult).toFixed(1);
            if (elCivArrivalRate) elCivArrivalRate.textContent = `Arrival: 1 every ${interval}s`;

            if (elCivQueue) {
                if (game.civQueue.length === 0) {
                    elCivQueue.innerHTML = '<p class="sub-text">Queue is empty. Waiting for civilians...</p>';
                } else {
                    elCivQueue.innerHTML = game.civQueue.map(t => `
                        <div class="queue-item">
                            <div class="queue-item-header">
                                <span>📋 ${t.title}</span>
                                <span class="task-reward">+$${t.reward}</span>
                            </div>
                            <div class="sub-text">Duration: ${t.duration.toFixed(1)}s</div>
                        </div>
                    `).join('');
                }
            }

            // Officers
            if (elOfficerBadge) elOfficerBadge.textContent = game.officers.length;
            if (elOfficerCost) elOfficerCost.textContent = game.getOfficerCost();
            if (elBtnHireOfficer) elBtnHireOfficer.disabled = game.money < game.getOfficerCost();

            if (elOfficersList) {
                if (game.officers.length === 0) {
                    elOfficersList.innerHTML = '<p class="sub-text">No officers hired.</p>';
                } else {
                    elOfficersList.innerHTML = game.officers.map(off => {
                        const pct = off.duration ? Math.min(100, Math.floor((off.progress / off.duration) * 100)) : 0;
                        const taskName = off.currentTask ? off.currentTask.title : 'Waiting for task...';
                        const canDelegate = off.status === 'working' && game.consultants.some(c => c.status === 'idle');

                        return `
                            <div class="worker-card">
                                <div class="worker-header">
                                    <span>👔 ${off.name}</span>
                                    <span class="badge">${off.status.toUpperCase()}</span>
                                </div>
                                <div class="sub-text">${taskName}</div>
                                ${off.status === 'working' ? `
                                    <div class="progress-container">
                                        <div class="progress-bar" style="width: ${pct}%"></div>
                                    </div>
                                    <div class="progress-text">
                                        <span>Progress</span>
                                        <span>${pct}%</span>
                                    </div>
                                ` : ''}
                                <div class="worker-controls">
                                    ${canDelegate ? `<button class="btn btn-sm btn-primary delegate-btn" data-officer="${off.id}">Delegate to Consultant</button>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('');

                    // Add delegation click handlers
                    document.querySelectorAll('.delegate-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const offId = e.target.getAttribute('data-officer');
                            game.delegateTaskToConsultant(offId);
                            render();
                        });
                    });
                }
            }

            // Consultants
            if (elConsultantBadge) elConsultantBadge.textContent = game.consultants.length;
            if (elConsultantCost) elConsultantCost.textContent = game.getConsultantCost();
            if (elBtnHireConsultant) elBtnHireConsultant.disabled = game.money < game.getConsultantCost();

            if (elConsultantsList) {
                if (game.consultants.length === 0) {
                    elConsultantsList.innerHTML = '<p class="sub-text">No consultants hired yet.</p>';
                } else {
                    elConsultantsList.innerHTML = game.consultants.map(c => {
                        const pct = c.duration ? Math.min(100, Math.floor((c.progress / c.duration) * 100)) : 0;
                        const taskName = c.currentTask ? c.currentTask.title : 'Idle / Available';

                        return `
                            <div class="worker-card">
                                <div class="worker-header">
                                    <span>💼 ${c.name}</span>
                                    <span class="badge">${c.status.toUpperCase()}</span>
                                </div>
                                <div class="sub-text">${taskName}</div>
                                ${c.status === 'working' ? `
                                    <div class="progress-container">
                                        <div class="progress-bar consultant-bar" style="width: ${pct}%"></div>
                                    </div>
                                    <div class="progress-text">
                                        <span>Processing</span>
                                        <span>${pct}%</span>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('');
                }
            }

            // Upgrades
            if (elUpgradesList) {
                elUpgradesList.innerHTML = Object.entries(game.upgrades).map(([key, upg]) => {
                    const cost = game.getUpgradeCost(key);
                    const isMax = upg.level >= upg.maxLevel;
                    const canAfford = game.money >= cost && !isMax;

                    return `
                        <div class="upgrade-card">
                            <div class="upgrade-info">
                                <h4>${upg.name} (Lvl ${upg.level}/${upg.maxLevel})</h4>
                                <p>${upg.desc}</p>
                            </div>
                            <button class="btn btn-sm btn-primary buy-upg-btn" data-key="${key}" ${!canAfford ? 'disabled' : ''}>
                                ${isMax ? 'MAX' : `Buy ($${cost})`}
                            </button>
                        </div>
                    `;
                }).join('');

                document.querySelectorAll('.buy-upg-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const key = e.target.getAttribute('data-key');
                        if (game.buyUpgrade(key)) {
                            render();
                        }
                    });
                });
            }
        }

        // Main Loop
        let lastTime = Date.now();
        setInterval(() => {
            const now = Date.now();
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            game.update(dt);
            render();
        }, 100);

        // Auto Save every 10 seconds
        setInterval(() => {
            game.saveState();
        }, 10000);

        // Initial render
        render();
    });
}

// Export for Node/testing environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IdleAmtGame };
}
