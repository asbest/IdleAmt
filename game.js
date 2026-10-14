/**
 * IdleAmt - Office Simulation Idle Game Engine & UI Controller
 */

// Sound FX Synthesizer using Web Audio API
class SoundFX {
    constructor() {
        this.enabled = true;
        this.ctx = null;
    }

    init() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    playSpell() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const notes = [440.00, 554.37, 659.25, 880.00, 1108.73]; // A4, C#5, E5, A5, C#6
            notes.forEach((freq, idx) => {
                const now = this.ctx.currentTime + idx * 0.05;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.2);
            });
        } catch (e) { }
    }

    playCoin() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1); // E6
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) { }
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) { }
    }

    playFanfare() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const now = this.ctx.currentTime + idx * 0.08;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            });
        } catch (e) { }
    }

    playArrival() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        } catch (e) { }
    }

    playSwoosh() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) { }
    }

    playPop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) { }
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';
        if (this.isBrowserEnv) {
            this.initCanvas();
        }
    }

    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9998';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    spawnBurst(x, y, count = 15, color = '#facc15') {
        if (!this.canvas) return;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                radius: 3 + Math.random() * 4,
                color: color,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.02,
                shape: Math.random() > 0.5 ? 'circle' : 'star'
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravity
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'star') {
                this.ctx.font = `${p.radius * 3}px sans-serif`;
                this.ctx.fillText('⭐', p.x, p.y);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

class IdleAmtGame {
    constructor() {
        this.money = 0;
        this.tasksCompleted = 0;
        this.reputation = 100;

        // Prestige & Offline Vault Settings
        this.prestigeLevel = 0;
        this.prestigeTokens = 0; // Bureaucratic Seals
        this.offlineCapHours = 12;

        // Audit Micro-Event Settings
        this.activeAudit = null; // { id, reward, duration, timeLeft }
        this.auditTimer = 0;
        this.auditInterval = 25; // seconds

        // Department Expansion Settings
        this.departments = {
            tax: { id: 'tax', name: 'Tax Bureau', icon: '🏛️', unlocked: false, cost: 300, multiplier: 1.25, desc: '+25% Revenue Boost' },
            dmv: { id: 'dmv', name: 'DMV Office', icon: '🚗', unlocked: false, cost: 750, multiplier: 1.5, desc: '+50% Revenue Boost' },
            finance: { id: 'finance', name: 'Treasury Dept', icon: '🏦', unlocked: false, cost: 2000, multiplier: 2.0, desc: '+100% Revenue Boost' }
        };

        // Achievements System
        this.achievements = {
            firstOfficer: { id: 'firstOfficer', title: 'First Staff', desc: 'Hire an officer', icon: '👔', unlocked: false },
            firstConsultant: { id: 'firstConsultant', title: 'Outsourcing', desc: 'Hire a consultant', icon: '💼', unlocked: false },
            tasks10: { id: 'tasks10', title: 'Paper Pusher', desc: 'Complete 10 tasks', icon: '📄', unlocked: false },
            tasks50: { id: 'tasks50', title: 'Bureaucracy Master', desc: 'Complete 50 tasks', icon: '🏆', unlocked: false },
            firstReform: { id: 'firstReform', title: 'Bureaucratic Reform', desc: 'Perform 1 Reform', icon: '🏛️', unlocked: false },
            bigSpender: { id: 'bigSpender', title: 'Treasury Accumulator', desc: 'Reach $1,000 budget', icon: '💰', unlocked: false }
        };

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

        // Moving Figures Animation Tracker
        this.movingFigures = [];

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
        this.soundFx = new SoundFX();
        this.particleSystem = null;
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

    getDepartmentMultiplier() {
        let mult = 1.0;
        for (const key in this.departments) {
            if (this.departments[key].unlocked) {
                mult *= this.departments[key].multiplier;
            }
        }
        return mult;
    }

    getPrestigeMultiplier() {
        return (1 + (this.prestigeTokens * 0.1)) * this.getDepartmentMultiplier();
    }

    unlockDepartment(depKey) {
        const dep = this.departments[depKey];
        if (!dep || dep.unlocked) return false;
        if (this.money >= dep.cost) {
            this.money -= dep.cost;
            dep.unlocked = true;
            return true;
        }
        return false;
    }

    getPendingPrestigeTokens() {
        return Math.floor(this.money / 1000);
    }

    performPrestige() {
        const earned = this.getPendingPrestigeTokens();
        if (earned <= 0) return false;

        this.prestigeTokens += earned;
        this.prestigeLevel += 1;

        // Soft reset progress
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
        return true;
    }

    // --- Core Operations ---

    addCivilianTask(forceVip = false) {
        if (this.civQueue.length >= this.maxCivQueue) {
            return false;
        }
        const taskId = 'task_' + Math.random().toString(36).substring(2, 9);
        const isVip = forceVip || (Math.random() < 0.15);
        const rewardMultiplier = (1 + (Math.random() * 0.5)) * (isVip ? 5 : 1); // 5x for VIPs
        const duration = 2.0 + Math.random() * 2.0; // 2 to 4 seconds work time
        const civIcons = isVip ? ['👑 VIP', '💎 VIP', '🎩 VIP'] : ['🧑‍💼', '👨‍💼', '👩‍💻', '👨‍🏭', '👩‍🏫', '👨‍💼', '👩‍⚖️'];
        const avatar = civIcons[Math.floor(Math.random() * civIcons.length)];
        const reqNum = Math.floor(Math.random() * 899 + 100);
        const task = {
            id: taskId,
            title: isVip ? `🌟 VIP Request #${reqNum}` : `Request #${reqNum}`,
            reward: Math.round(this.taskBaseReward * rewardMultiplier),
            duration: duration,
            progress: 0,
            avatar: avatar,
            isVip: isVip
        };
        this.civQueue.push(task);

        if (this.isBrowserEnv) {
            this.soundFx.playArrival();
        }

        // Spawn walking civilian figure from Entrance -> Queue
        this.spawnWalkingFigure({
            id: 'walk_' + taskId,
            type: 'civ',
            express: isVip ? '👑' : '😟',
            from: '#office-entrance',
            to: '#zone-waiting',
            text: isVip ? '🌟 VIP Arrival!' : 'Need help!',
            hasDoc: true
        });

        return true;
    }

    triggerAuditMinigame() {
        if (this.activeAudit) return false;
        const bonusAmount = Math.max(100, Math.round(this.calculateIncomeRate() * 15 + 50));
        this.activeAudit = {
            id: 'audit_' + Date.now(),
            reward: bonusAmount,
            duration: 10,
            timeLeft: 10
        };
        if (this.isBrowserEnv) {
            this.soundFx.playArrival();
        }
        return true;
    }

    claimAuditReward() {
        if (!this.activeAudit) return 0;
        const reward = this.activeAudit.reward;
        this.money += reward;
        this.activeAudit = null;
        if (this.isBrowserEnv) {
            this.soundFx.playFanfare();
        }
        return reward;
    }

    getOfficerCost() {
        return Math.floor(this.officerBaseCost * Math.pow(1.5, this.officers.length));
    }

    addOfficer(name = null) {
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

        if (this.isBrowserEnv) {
            // Visualize officer walking from desk to queue, fetching document, then returning to desk
            this.spawnWalkingFigure({
                id: 'officer_fetch_' + task.id,
                type: 'officer',
                express: '👨‍💼',
                from: `#desk-${officer.id}`,
                to: '#zone-waiting',
                text: 'Fetching file...',
                hasDoc: false,
                durationMs: 1500,
                onComplete: () => {
                    this.spawnWalkingFigure({
                        id: 'officer_return_' + task.id,
                        type: 'officer',
                        express: '👨‍💼',
                        from: '#zone-waiting',
                        to: `#desk-${officer.id}`,
                        text: 'Processing file...',
                        hasDoc: true,
                        durationMs: 1500
                    });
                }
            });
        }

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

        if (this.isBrowserEnv) {
            this.soundFx.playSwoosh();
        }

        // Spawn walking runner carrying document: Officer Desk -> Consultant Desk
        this.spawnWalkingFigure({
            id: 'delegate_walk_' + task.id,
            type: 'officer',
            express: '👨‍💼',
            from: `#desk-${officer.id}`,
            to: `#desk-${consultant.id}`,
            text: 'Delegate!',
            hasDoc: true
        });

        return true;
    }

    checkAchievements() {
        if (this.officers.length >= 1) this.unlockAchievement('firstOfficer');
        if (this.consultants.length >= 1) this.unlockAchievement('firstConsultant');
        if (this.tasksCompleted >= 10) this.unlockAchievement('tasks10');
        if (this.tasksCompleted >= 50) this.unlockAchievement('tasks50');
        if (this.prestigeLevel >= 1) this.unlockAchievement('firstReform');
        if (this.money >= 1000) this.unlockAchievement('bigSpender');
    }

    unlockAchievement(id) {
        const ach = this.achievements[id];
        if (ach && !ach.unlocked) {
            ach.unlocked = true;
            if (this.isBrowserEnv) {
                this.soundFx.playFanfare();
                this.triggerRewardFX(`🏆 Achievement Unlocked: ${ach.title}`, '#office-entrance', '#facc15');
            }
        }
    }

    // --- Game Loop Update ---

    update(dt) { // dt in seconds
        if (dt <= 0) return;

        this.checkAchievements();

        // 1. Audit Micro-Event Timer Update
        if (this.activeAudit) {
            this.activeAudit.timeLeft -= dt;
            if (this.activeAudit.timeLeft <= 0) {
                this.activeAudit = null; // Expired
            }
        } else {
            this.auditTimer += dt;
            if (this.auditTimer >= this.auditInterval) {
                this.auditTimer = 0;
                if (Math.random() < 0.6) { // 60% chance every 25s
                    this.triggerAuditMinigame();
                }
            }
        }

        // 2. Civilian Queue Spawning
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
                    // Task Completed by Officer (multiplied by Prestige bonus)
                    const baseReward = officer.currentTask.reward;
                    const reward = Math.round(baseReward * this.getPrestigeMultiplier());
                    const finishedTask = officer.currentTask;
                    this.money += reward;
                    this.tasksCompleted += 1;

                    if (this.isBrowserEnv) {
                        this.soundFx.playCoin();
                        this.triggerRewardFX(`+$${reward}`, `#desk-${officer.id}`);

                        // Civilian walks away satisfied from Officer Desk -> Exit Door
                        this.spawnWalkingFigure({
                            id: 'walk_exit_' + finishedTask.id,
                            type: 'civ',
                            express: '😃',
                            from: `#desk-${officer.id}`,
                            to: '#office-entrance',
                            text: 'Thanks! Bye!',
                            hasDoc: false
                        });
                    }

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
                    // Task Completed by Consultant (multiplied by Prestige bonus)
                    const baseReward = consultant.currentTask.reward * consultantBonus;
                    const reward = Math.round(baseReward * this.getPrestigeMultiplier());
                    const finishedTask = consultant.currentTask;
                    this.money += reward;
                    this.tasksCompleted += 1;

                    if (this.isBrowserEnv) {
                        this.soundFx.playCoin();
                        this.triggerRewardFX(`+$${reward}`, `#desk-${consultant.id}`, '#c084fc');

                        // Finished paperwork sent back / Civilian walks out
                        this.spawnWalkingFigure({
                            id: 'walk_exit_con_' + finishedTask.id,
                            type: 'consultant',
                            express: '👩‍💻',
                            from: `#desk-${consultant.id}`,
                            to: '#office-entrance',
                            text: 'Approved! ✅',
                            hasDoc: true
                        });
                    }

                    consultant.currentTask = null;
                    consultant.status = 'idle';
                    consultant.progress = 0;
                }
            }
        }
    }

    // --- Figure Movement & Walking Helpers ---

    // Helper to generate Persona HTML markup with animated limbs
    createPersonaHTML(type = 'officer', express = '🙂') {
        return `
            <div class="persona-figure ${type}">
                <div class="persona-head">
                    <span class="persona-face">${express}</span>
                </div>
                <div class="persona-body">
                    <div class="persona-arm left"></div>
                    <div class="persona-arm right"></div>
                    <div class="persona-leg left"></div>
                    <div class="persona-leg right"></div>
                </div>
            </div>
        `;
    }

    animateDoorOpen(durationMs = 800) {
        if (!this.isBrowserEnv) return;
        const doorEl = document.querySelector('#office-entrance');
        if (!doorEl) return;
        doorEl.classList.add('door-open');
        setTimeout(() => {
            doorEl.classList.remove('door-open');
        }, durationMs);
    }

    spawnWalkingFigure(data) {
        if (!this.isBrowserEnv) return;

        if (data.from === '#office-entrance' || data.to === '#office-entrance') {
            this.animateDoorOpen(1000);
        }

        const durationMs = data.durationMs || 2000;

        setTimeout(() => {
            const viewport = document.querySelector('.office-floor-viewport');
            const walkingLayer = document.querySelector('#walking-layer');
            if (!viewport || !walkingLayer) return;

            const fromEl = document.querySelector(data.from);
            const toEl = document.querySelector(data.to);

            if (!fromEl || !toEl) return;

            const vpRect = viewport.getBoundingClientRect();
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();

            // Calculate start and end coordinates relative to viewport
            const startX = (fromRect.left + fromRect.width / 2) - vpRect.left;
            const startY = (fromRect.top + fromRect.height / 2) - vpRect.top;
            const endX = (toRect.left + toRect.width / 2) - vpRect.left;
            const endY = (toRect.top + toRect.height / 2) - vpRect.top;

            const personaType = data.type || 'officer';

            const figure = document.createElement('div');
            figure.className = 'moving-figure walking';
            figure.style.transition = `left ${durationMs / 1000}s linear, top ${durationMs / 1000}s linear`;
            figure.style.left = `${startX}px`;
            figure.style.top = `${startY}px`;

            figure.innerHTML = `
                ${data.text ? `<div class="speech-bubble">${data.text}</div>` : ''}
                <div class="figure-avatar">
                    ${this.createPersonaHTML(personaType, data.express || '🙂')}
                    ${data.hasDoc ? '<span class="figure-doc">📄</span>' : ''}
                </div>
            `;

            walkingLayer.appendChild(figure);

            // Animate position to end coordinates
            requestAnimationFrame(() => {
                figure.style.left = `${endX}px`;
                figure.style.top = `${endY}px`;
            });

            // Remove after animation completes
            setTimeout(() => {
                if (figure.parentNode) {
                    figure.parentNode.removeChild(figure);
                }
                if (data.onComplete) {
                    data.onComplete();
                }
            }, durationMs + 100);
        }, 50);
    }

    triggerHaptic(type = 'light') {
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            try {
                if (type === 'light') window.navigator.vibrate(15);
                else if (type === 'medium') window.navigator.vibrate(35);
                else if (type === 'heavy') window.navigator.vibrate([40, 30, 60]);
                else if (type === 'success') window.navigator.vibrate([20, 40, 30, 40, 50]);
            } catch (e) { }
        }
    }

    triggerRewardFX(text, targetSelector = null, color = '#4ade80') {
        if (!this.isBrowserEnv) return;
        this.triggerHaptic('light');
        const fxContainer = document.querySelector('.floating-fx-container');
        if (!fxContainer) return;

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;

        if (targetSelector) {
            const targetEl = document.querySelector(targetSelector);
            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    x = rect.left + rect.width / 2;
                    y = rect.top + rect.height / 2;
                }
            }
        }

        const el = document.createElement('div');
        el.className = 'floating-text';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.color = color;
        el.textContent = text;
        fxContainer.appendChild(el);

        setTimeout(() => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }, 1200);

        if (this.particleSystem) {
            this.particleSystem.spawnBurst(x, y, 10, color);
        }
    }

    calculateIncomeRate() {
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
            prestigeLevel: this.prestigeLevel,
            prestigeTokens: this.prestigeTokens,
            offlineCapHours: this.offlineCapHours,
            departments: Object.fromEntries(
                Object.entries(this.departments).map(([k, v]) => [k, { unlocked: v.unlocked }])
            ),
            achievements: Object.fromEntries(
                Object.entries(this.achievements).map(([k, v]) => [k, { unlocked: v.unlocked }])
            ),
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
        this.prestigeLevel = state.prestigeLevel || 0;
        this.prestigeTokens = state.prestigeTokens || 0;
        this.offlineCapHours = state.offlineCapHours || 12;

        if (state.departments) {
            for (const key in state.departments) {
                if (this.departments[key]) {
                    this.departments[key].unlocked = !!state.departments[key].unlocked;
                }
            }
        }

        if (state.achievements) {
            for (const key in state.achievements) {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = !!state.achievements[key].unlocked;
                }
            }
        }

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

        if (state.lastTimestamp) {
            const maxOfflineSeconds = 3600 * (this.offlineCapHours || 12);
            const elapsedSeconds = Math.min((Date.now() - state.lastTimestamp) / 1000, maxOfflineSeconds);
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
        this.prestigeLevel = 0;
        this.prestigeTokens = 0;
        this.offlineCapHours = 12;
        for (const key in this.departments) {
            this.departments[key].unlocked = false;
        }
        for (const key in this.achievements) {
            this.achievements[key].unlocked = false;
        }
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
        // Create FX Overlay Container
        const fxContainer = document.createElement('div');
        fxContainer.className = 'floating-fx-container';
        document.body.appendChild(fxContainer);

        const game = new IdleAmtGame();
        game.particleSystem = new ParticleSystem();
        game.loadState();

        // UI Element bindings
        const elMoney = document.getElementById('stat-money');
        const elIncome = document.getElementById('stat-income');
        const elTasks = document.getElementById('stat-tasks');
        const elReputation = document.getElementById('stat-reputation');
        const elSoundBtn = document.getElementById('btn-sound');

        const elWaitingEntities = document.getElementById('waiting-entities');
        const elOfficersDesks = document.getElementById('officers-desks');
        const elConsultantsDesks = document.getElementById('consultants-desks');

        const elCivBadge = document.getElementById('civ-count-badge');
        const elCivQueue = document.getElementById('civ-queue-list');
        const elBtnInviteCiv = document.getElementById('btn-invite-civ');
        const elBtnInviteVip = document.getElementById('btn-invite-vip');
        const elCivArrivalRate = document.getElementById('civ-arrival-rate');

        const elOfficerBadge = document.getElementById('officer-count-badge');
        const elBtnHireOfficer = document.getElementById('btn-hire-officer');
        const elOfficerCost = document.getElementById('officer-cost');
        const elOfficersList = document.getElementById('officers-list');

        const elConsultantBadge = document.getElementById('consultant-count-badge');
        const elBtnHireConsultant = document.getElementById('btn-hire-consultant');
        const elConsultantCost = document.getElementById('consultant-cost');
        const elConsultantsList = document.getElementById('consultants-list');

        const elAuditAlertBox = document.getElementById('audit-alert-box');
        const elAuditRewardVal = document.getElementById('audit-reward-val');
        const elAuditTimerVal = document.getElementById('audit-timer-val');
        const elBtnClaimAudit = document.getElementById('btn-claim-audit');

        const elDepartmentsList = document.getElementById('departments-list');
        const elAchievementsList = document.getElementById('achievements-list');

        const elPrestigeBadge = document.getElementById('prestige-level-badge');
        const elPrestigeSeals = document.getElementById('prestige-seals-val');
        const elPrestigeMult = document.getElementById('prestige-mult-val');
        const elPendingSeals = document.getElementById('pending-seals-val');
        const elBtnPrestige = document.getElementById('btn-prestige');

        const elUpgradesList = document.getElementById('upgrades-list');
        const elBtnSave = document.getElementById('btn-save');
        const elBtnReset = document.getElementById('btn-reset');

        if (elSoundBtn) {
            elSoundBtn.addEventListener('click', () => {
                game.soundFx.enabled = !game.soundFx.enabled;
                elSoundBtn.textContent = game.soundFx.enabled ? '🔊' : '🔇';
                game.soundFx.playClick();
            });
        }

        if (elBtnClaimAudit) {
            elBtnClaimAudit.addEventListener('click', () => {
                const reward = game.claimAuditReward();
                if (reward > 0) {
                    game.soundFx.playSpell();
                    game.triggerRewardFX(`+$${reward} Grant! 🚨`, '#btn-claim-audit', '#f59e0b');
                    render();
                }
            });
        }

        if (elBtnInviteCiv) {
            elBtnInviteCiv.addEventListener('click', (e) => {
                if (game.addCivilianTask()) {
                    game.soundFx.playClick();
                    game.triggerRewardFX('+Task!', '#btn-invite-civ', '#f59e0b');
                    render();
                }
            });
        }

        if (elBtnInviteVip) {
            elBtnInviteVip.addEventListener('click', () => {
                if (game.addCivilianTask(true)) {
                    game.soundFx.playFanfare();
                    game.triggerRewardFX('👑 VIP Invited!', '#btn-invite-vip', '#facc15');
                    render();
                }
            });
        }

        if (elBtnPrestige) {
            elBtnPrestige.addEventListener('click', () => {
                const pending = game.getPendingPrestigeTokens();
                if (pending <= 0) return;
                if (confirm(`Enact Bureaucratic Reform? You will reset your staff and budget in exchange for ${pending} Bureaucratic Seals (+${pending * 10}% boost).`)) {
                    if (game.performPrestige()) {
                        game.soundFx.playSpell();
                        game.triggerRewardFX(`Reform Enacted! +${pending} Seals 📜`, '#btn-prestige', '#facc15');
                        render();
                    }
                }
            });
        }

        if (elBtnHireOfficer) {
            elBtnHireOfficer.addEventListener('click', () => {
                if (game.hireOfficer()) {
                    game.soundFx.playFanfare();
                    game.triggerRewardFX('Officer Hired! 👔', '#btn-hire-officer', '#38bdf8');
                    render();
                }
            });
        }

        if (elBtnHireConsultant) {
            elBtnHireConsultant.addEventListener('click', () => {
                if (game.hireConsultant()) {
                    game.soundFx.playFanfare();
                    game.triggerRewardFX('Consultant Hired! 💼', '#btn-hire-consultant', '#c084fc');
                    render();
                }
            });
        }

        if (elBtnSave) {
            elBtnSave.addEventListener('click', () => {
                game.saveState();
                game.soundFx.playClick();
                game.triggerRewardFX('Saved! 💾', '#btn-save', '#38bdf8');
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

        function renderOfficeFloor() {
            // Render Civilians Waiting Zone
            if (elWaitingEntities) {
                if (game.civQueue.length === 0) {
                    elWaitingEntities.innerHTML = '<p class="sub-text" style="padding: 10px;">Queue is clear ☕</p>';
                } else {
                    elWaitingEntities.innerHTML = game.civQueue.map((t, idx) => `
                        <div class="civ-avatar ${t.isVip ? 'vip-avatar' : ''}" title="${t.title} ($${t.reward})" style="${t.isVip ? 'border: 2px solid #facc15; border-radius: 8px; background: rgba(250, 204, 21, 0.15);' : ''}">
                            ${game.createPersonaHTML('civ', t.isVip ? '👑' : '😐')}
                            <span style="${t.isVip ? 'color: #facc15; font-weight: bold;' : ''}">#${idx + 1} ${t.isVip ? 'VIP' : ''}</span>
                        </div>
                    `).join('');
                }
            }

            // Render Officers Desks Zone
            if (elOfficersDesks) {
                if (game.officers.length === 0) {
                    elOfficersDesks.innerHTML = '<p class="sub-text">No officer desks.</p>';
                } else {
                    elOfficersDesks.innerHTML = game.officers.map(off => {
                        const isWorking = off.status === 'working';
                        const pct = off.duration ? Math.min(100, Math.floor((off.progress / off.duration) * 100)) : 0;
                        return `
                            <div class="desk-unit ${isWorking ? 'active-desk' : ''}" id="desk-${off.id}">
                                <div class="desk-avatar ${isWorking ? 'working' : ''}">${game.createPersonaHTML('officer', isWorking ? '👨‍💻' : '🙂')}</div>
                                <div class="desk-name">${off.name}</div>
                                <span class="desk-status-badge ${off.status}">${off.status}</span>
                                ${isWorking ? `
                                    <div class="desk-mini-progress">
                                        <div class="desk-mini-bar" style="width: ${pct}%"></div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('');
                }
            }

            // Render Consultants Desks Zone
            if (elConsultantsDesks) {
                if (game.consultants.length === 0) {
                    elConsultantsDesks.innerHTML = '<p class="sub-text" style="grid-column: 1/-1;">Hire consultants to expand office!</p>';
                } else {
                    elConsultantsDesks.innerHTML = game.consultants.map(c => {
                        const isWorking = c.status === 'working';
                        const pct = c.duration ? Math.min(100, Math.floor((c.progress / c.duration) * 100)) : 0;
                        return `
                            <div class="desk-unit consultant-desk ${isWorking ? 'active-desk' : ''}" id="desk-${c.id}">
                                <div class="desk-avatar ${isWorking ? 'working' : ''}">${game.createPersonaHTML('consultant', isWorking ? '👩‍💻' : '🙂')}</div>
                                <div class="desk-name">${c.name}</div>
                                <span class="desk-status-badge ${c.status}">${c.status}</span>
                                ${isWorking ? `
                                    <div class="desk-mini-progress">
                                        <div class="desk-mini-bar" style="width: ${pct}%"></div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('');
                }
            }
        }

        function render() {
            renderOfficeFloor();

            // Audit Micro-Event UI Render
            if (elAuditAlertBox) {
                if (game.activeAudit) {
                    elAuditAlertBox.style.display = 'flex';
                    if (elAuditRewardVal) elAuditRewardVal.textContent = game.activeAudit.reward;
                    if (elAuditTimerVal) elAuditTimerVal.textContent = Math.ceil(game.activeAudit.timeLeft);
                } else {
                    elAuditAlertBox.style.display = 'none';
                }
            }

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
                        <div class="queue-item ${t.isVip ? 'vip-item' : ''}" style="${t.isVip ? 'border-left: 4px solid #facc15; background: rgba(250,204,21,0.08);' : ''}">
                            <div class="queue-item-header">
                                <span>${t.isVip ? '👑' : '📋'} ${t.title}</span>
                                <span class="task-reward" style="${t.isVip ? 'color: #facc15; font-weight: bold;' : ''}">+$${t.reward}</span>
                            </div>
                            <div class="sub-text">Duration: ${t.duration.toFixed(1)}s ${t.isVip ? '• 🌟 5x VIP Multiplier!' : ''}</div>
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

                    document.querySelectorAll('.delegate-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const offId = e.target.getAttribute('data-officer');
                            if (game.delegateTaskToConsultant(offId)) {
                                game.soundFx.playSwoosh();
                                game.triggerRewardFX('Delegated! 📄➡️💼', `#desk-${offId}`, '#a855f7');
                                render();
                            }
                        });
                    });
                }
            }

            // Departments UI
            if (elDepartmentsList) {
                elDepartmentsList.innerHTML = Object.entries(game.departments).map(([key, dep]) => {
                    const canAfford = game.money >= dep.cost && !dep.unlocked;
                    return `
                        <div class="card" style="padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid ${dep.unlocked ? '#4ade80' : 'rgba(255,255,255,0.1)'}; text-align: center;">
                            <div style="font-size: 1.8rem;">${dep.icon}</div>
                            <strong style="display: block; margin: 4px 0;">${dep.name}</strong>
                            <span class="sub-text" style="display: block; font-size: 0.8rem; margin-bottom: 8px;">${dep.desc}</span>
                            <button class="btn btn-sm ${dep.unlocked ? 'btn-success' : 'btn-primary'} unlock-dep-btn" data-key="${key}" ${dep.unlocked || !canAfford ? 'disabled' : ''}>
                                ${dep.unlocked ? '✅ Unlocked' : `Establish ($${dep.cost})`}
                            </button>
                        </div>
                    `;
                }).join('');

                document.querySelectorAll('.unlock-dep-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const key = e.target.getAttribute('data-key');
                        if (game.unlockDepartment(key)) {
                            game.soundFx.playFanfare();
                            game.triggerRewardFX('Department Established! 🏛️', e.target, '#4ade80');
                            render();
                        }
                    });
                });
            }

            // Achievements UI
            if (elAchievementsList) {
                elAchievementsList.innerHTML = Object.values(game.achievements).map(ach => `
                    <div style="padding: 8px; border-radius: 8px; background: ${ach.unlocked ? 'rgba(250,204,21,0.12)' : 'rgba(255,255,255,0.02)'}; border: 1px solid ${ach.unlocked ? '#facc15' : 'rgba(255,255,255,0.08)'}; text-align: center; opacity: ${ach.unlocked ? '1' : '0.5'};">
                        <div style="font-size: 1.5rem;">${ach.icon}</div>
                        <strong style="font-size: 0.8rem; display: block; color: ${ach.unlocked ? '#facc15' : '#aaa'};">${ach.title}</strong>
                        <span style="font-size: 0.7rem; color: #888; display: block;">${ach.desc}</span>
                    </div>
                `).join('');
            }

            // Prestige UI
            if (elPrestigeBadge) elPrestigeBadge.textContent = `Reform Lvl ${game.prestigeLevel}`;
            if (elPrestigeSeals) elPrestigeSeals.textContent = `${game.prestigeTokens} 📜`;
            if (elPrestigeMult) elPrestigeMult.textContent = `${game.getPrestigeMultiplier().toFixed(1)}x`;
            const pendingSeals = game.getPendingPrestigeTokens();
            if (elPendingSeals) elPendingSeals.textContent = `+${pendingSeals} 📜`;
            if (elBtnPrestige) elBtnPrestige.disabled = pendingSeals <= 0;

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
                            game.soundFx.playFanfare();
                            game.triggerRewardFX('Upgraded! ⚡', e.target, '#facc15');
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
