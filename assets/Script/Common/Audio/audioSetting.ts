import settingBasic from "../../Setting/settingBasic";

//设置游戏音效名称
const audioSetting = {
    player: {
        walk: {
            onGround: "walkOnGround",
            onStone: "walkOnStone",
            onGrass: "walkOnGrass",
            onWood: "walkOnWood"
        },
        jump: {
            onGround: "jumpOnGround",
            onStone: "jumpOnStone",
            onGrass: "jumpOnGrass",
            onWood: "jumpOnWood"
        },
        heartbeat: {
            heartBeat1:"heartBeat1",
            heartBeat2:"heartBeat2",
            heartBeat3:"heartBeat3",
        }
        // death: "playerDeath",
        // reborn: "playerReborn",
    },
    box: {
        //碰撞
        crash: {
            onGround: "boxCrashGround",
            onStone: "boxCrashStone",
            onGrass: "boxCrashGrass",
            onWood: "boxCrashWood",
            onBanboo: "boxCrashBanboo",
        }
    },
    other: {
        lv1: {
            BGM: "bgm1",
            river: "river",
            waterStream: "waterStream",
            fire: {
                burning: "fireBurning",
                quench: "fireQuench",
            },
            waterWheel: "waterWheel",
        },
        lv2: {
            BGM: "bgm2",
            fish: {
                warning: "fishWarning",
                jumpOut: "fishJumpOut",
                jumpIn: "fishJumpIn",
            },
            gear: "gearRotation",
            waterfall: "waterfall",
            mountainMove:"mountainMove",
        },
        lv3: {
            BGM: "bgm3",
            tiger: {
                walk: "tigerWalk",
                sleep: "tigerSleep",
                attack: "tigerAttack",
            },
            platform: "platformMoving",
        },
        lv4: {
            BGM: "bgm4",
            stone: {
                crash: {
                    onStone: "stoneCrashStone",
                    onGround: "stoneCrashGround",
                },
                rolling: "stoneRolling",
            },
            stoneStepFallDown: "stoneStepFallDown",
            spider: {
                walk: "spiderWalk",
                attack: "spiderAttack",
            }
        },
        lv5: {
            BGM: "bgm5",
            earthKing: {
                normalAttack: "earthKingNormalAttack",
                thump: "earthKingThump",
                roar: "earthKingRoar",
            },
            waterfall: "waterfall",
            eye: "eayRadRay",
            stone: "stoneCrashGround",
        },
    },

    fun: {
        getListByLv(lv: number) {
            let list = audioSetting.other;
            return list["lv" + lv];
        },
        getCurrList() {
            let lv = settingBasic.game.currLevel;
            let list = audioSetting.other;
            return list["lv" + lv];
        }
    }

}

export default audioSetting;